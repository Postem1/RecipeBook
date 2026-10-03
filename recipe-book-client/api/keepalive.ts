// Vercel Cron target (scheduled in vercel.json → "crons").
//
// The Supabase project is on the free tier, which pauses after ~7 days without
// activity — taking the whole app down. Once a day this runs one tiny read
// against the database so the project always looks active.
//
// It uses the same public anon key the browser bundle already ships, so it can
// only see what an anonymous visitor could.

import { timingSafeEqual } from 'node:crypto';

const PING_TIMEOUT_MS = 10_000;

// Should this request be allowed to trigger a ping?
//
// When a CRON_SECRET environment variable is set on the Vercel project, Vercel
// Cron sends it on every scheduled call as `Authorization: Bearer <CRON_SECRET>`,
// and we require it. With no secret configured we stay open on purpose: a
// rejected ping would let the database pause again, and the endpoint only does
// a read anyone could already make with the public anon key.
function isAuthorized(request: Request): boolean {
    const secret = process.env.CRON_SECRET;
    if (!secret) return true;

    // Constant-time compare; timingSafeEqual throws on unequal lengths, so check first.
    const given = Buffer.from(request.headers.get('authorization') ?? '');
    const expected = Buffer.from(`Bearer ${secret}`);
    return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: Request): Promise<Response> {
    if (!isAuthorized(request)) {
        return new Response('Unauthorized', { status: 401 });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
        return Response.json({ ok: false, error: 'Supabase env vars missing' }, { status: 500 });
    }

    // A real PostgREST query (not just the auth health endpoint) so Postgres
    // itself sees the activity.
    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/rb_recipes?select=id&limit=1`, {
            headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
            signal: AbortSignal.timeout(PING_TIMEOUT_MS),
        });
        // A non-2xx here (e.g. 540 when already paused) shows up as a failed
        // cron run in the Vercel dashboard instead of passing silently.
        return Response.json({ ok: res.ok, supabaseStatus: res.status }, { status: res.ok ? 200 : 502 });
    } catch (error) {
        return Response.json({ ok: false, error: String(error) }, { status: 502 });
    }
}
