// Vercel Cron target (scheduled in vercel.json → "crons").
//
// Deletes uploaded files that nothing points to any more: photos and videos of
// deleted recipes (including recipes removed with a deleted user), files
// replaced by an edit, old avatars, and uploads abandoned before the form was
// saved.
//
// It is a dry run — it reports what it would delete and deletes nothing —
// unless the Vercel project sets STORAGE_SWEEP_DELETE=true.
//
// It needs the service role key (SUPABASE_SERVICE_ROLE_KEY, never VITE_-prefixed
// or it would ship to browsers): RLS hides private recipes and storage listings
// from the anon key, which would make files in use look orphaned.

import { timingSafeEqual } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const BUCKETS = ['recipe-photos', 'recipe-videos', 'recipe-images', 'avatars'];

// Files are uploaded as soon as they're picked in a form, before the row that
// points to them is saved, so give fresh uploads a day before they count.
const GRACE_MS = 24 * 60 * 60 * 1000;

// This app only produces a handful of orphans a day. Many more in one run is
// more likely a bug (e.g. a bad reference read) than real churn, so stop and
// delete nothing.
const MAX_DELETES_PER_RUN = 25;

const LIST_PAGE_SIZE = 1000;

// Created by the Supabase dashboard to keep empty folders visible.
const FOLDER_PLACEHOLDER = '.emptyFolderPlaceholder';

type StoredFile = { bucket: string; path: string; createdAt: string; size: number };

// Unlike /api/keepalive, this endpoint deletes data with the service role key,
// so it fails closed: with no CRON_SECRET configured, nobody gets in.
function isAuthorized(request: Request): boolean {
    const secret = process.env.CRON_SECRET;
    if (!secret) return false;

    // Constant-time compare; timingSafeEqual throws on unequal lengths, so check first.
    const given = Buffer.from(request.headers.get('authorization') ?? '');
    const expected = Buffer.from(`Bearer ${secret}`);
    return given.length === expected.length && timingSafeEqual(given, expected);
}

// Storage URLs look like <project>/storage/v1/object/public/<bucket>/<path>.
// Returns the possible "<bucket>/<path>" keys (raw and URL-decoded), or none
// for external links such as YouTube or other sites.
function storageKeysFromUrl(url: string | null): string[] {
    const match = url?.match(/\/storage\/v1\/object\/(?:public\/|sign\/|authenticated\/)?([^?#]+)/);
    if (!match) return [];
    try {
        return [match[1], decodeURIComponent(match[1])];
    } catch {
        return [match[1]];
    }
}

// Every storage file a recipe or profile currently points to. Throws rather
// than return a partial set: a missing reference would get its file deleted.
async function loadReferencedKeys(supabase: SupabaseClient): Promise<Set<string>> {
    const [recipes, profiles] = await Promise.all([
        supabase.from('rb_recipes').select('photo_url, video_url', { count: 'exact' }),
        supabase.from('rb_profiles').select('avatar_url', { count: 'exact' }),
    ]);
    if (recipes.error) throw new Error(`reading rb_recipes: ${recipes.error.message}`);
    if (profiles.error) throw new Error(`reading rb_profiles: ${profiles.error.message}`);
    if (recipes.data.length === 0) throw new Error('rb_recipes returned no rows');
    // PostgREST caps rows per request; a cut-off read would hide references.
    if (recipes.data.length !== recipes.count || profiles.data.length !== profiles.count) {
        throw new Error('reference read was truncated');
    }

    const urls = [
        ...recipes.data.flatMap((r) => [r.photo_url, r.video_url]),
        ...profiles.data.map((p) => p.avatar_url),
    ];
    return new Set(urls.flatMap(storageKeysFromUrl));
}

// The Storage API lists one folder level at a time; folders come back as
// entries without an id, so walk into them.
async function listFiles(supabase: SupabaseClient, bucket: string, prefix = ''): Promise<StoredFile[]> {
    const files: StoredFile[] = [];
    for (let offset = 0; ; offset += LIST_PAGE_SIZE) {
        const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: LIST_PAGE_SIZE, offset });
        if (error) throw new Error(`listing ${bucket}/${prefix}: ${error.message}`);

        for (const entry of data) {
            const path = prefix ? `${prefix}/${entry.name}` : entry.name;
            if (!entry.id) {
                files.push(...(await listFiles(supabase, bucket, path)));
            } else if (entry.name !== FOLDER_PLACEHOLDER) {
                files.push({ bucket, path, createdAt: entry.created_at, size: entry.metadata?.size ?? 0 });
            }
        }
        if (data.length < LIST_PAGE_SIZE) return files;
    }
}

function findOrphans(files: StoredFile[], referenced: Set<string>, now: number): StoredFile[] {
    // An unparseable date gives NaN, which fails the age check, so the file is kept.
    return files.filter((f) => !referenced.has(`${f.bucket}/${f.path}`) && now - Date.parse(f.createdAt) > GRACE_MS);
}

async function deleteFiles(supabase: SupabaseClient, files: StoredFile[]): Promise<number> {
    let deleted = 0;
    for (const bucket of new Set(files.map((f) => f.bucket))) {
        const paths = files.filter((f) => f.bucket === bucket).map((f) => f.path);
        const { data, error } = await supabase.storage.from(bucket).remove(paths);
        if (error) throw new Error(`deleting from ${bucket}: ${error.message}`);
        deleted += data.length;
    }
    return deleted;
}

export async function GET(request: Request): Promise<Response> {
    if (!isAuthorized(request)) {
        return new Response('Unauthorized', { status: 401 });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
        return Response.json({ ok: false, error: 'Supabase env vars missing' }, { status: 500 });
    }
    const dryRun = process.env.STORAGE_SWEEP_DELETE !== 'true';

    const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    try {
        const referenced = await loadReferencedKeys(supabase);
        const files = (await Promise.all(BUCKETS.map((bucket) => listFiles(supabase, bucket)))).flat();
        const orphans = findOrphans(files, referenced, Date.now());

        const report = {
            dryRun,
            filesListed: files.length,
            orphans: orphans.map((f) => ({
                file: `${f.bucket}/${f.path}`,
                kB: Math.round(f.size / 1024),
                createdAt: f.createdAt,
            })),
        };
        console.log('storage-sweep', JSON.stringify(report));

        if (orphans.length > MAX_DELETES_PER_RUN) {
            const error = `refusing to delete ${orphans.length} files (limit ${MAX_DELETES_PER_RUN}); check the list`;
            return Response.json({ ok: false, error, ...report }, { status: 500 });
        }
        if (dryRun || orphans.length === 0) {
            return Response.json({ ok: true, ...report });
        }

        const deleted = await deleteFiles(supabase, orphans);
        console.log('storage-sweep deleted', deleted);
        return Response.json({ ok: true, deleted, ...report });
    } catch (error) {
        console.error('storage-sweep failed', error);
        return Response.json({ ok: false, error: String(error) }, { status: 502 });
    }
}
