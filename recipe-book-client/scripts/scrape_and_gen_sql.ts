
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

// User IDs fetched from DB
const USER_IDS = [
    "dfe2ca79-f6f5-41ca-9b27-f603f0f38881",
    "5881d557-f01f-4c84-8836-d7559da6d864",
    "fc6ebb38-de25-4850-a231-e46f5760d276",
    "b1c595e8-8d33-482e-af4b-f753bf7f2338",
    "a1ffa149-dfaa-43bb-b696-07294a45ea43",
    "0cfc33ef-43d6-4724-8777-33f9843810c1",
    "c4c2ff07-770d-41cc-95e6-ac2ad44c1d9a",
    "ce3e99cc-792a-4f2f-81bb-f3d8573d0561",
    "e57e39d3-45f2-4415-b2ab-eb3452111c4a",
    "e2c10cb0-4bd6-4a47-9ffc-82c17a167540",
    "11b14247-ad60-4976-9da1-deee9864d7fa",
    "c606d20b-06f7-4de7-bbfb-85b1b729baa0",
    "628d8fa6-da00-4334-a7c0-8d825b7b77d4"
];

const TARGET_URL = 'https://www.simplyrecipes.com/lunch-recipes-5091263';
const TARGET_COUNT = 30;

interface Recipe {
    title: string;
    description: string;
    photo_url: string;
    prep_time: number | null;
    cook_time: number | null;
    servings: number | null;
    ingredients: string[];
    instructions: string;
    category: string;
    // source_url removed to match DB
    user_id: string;
    is_private: boolean;
}

// Helper to escape SQL strings
function escapeSql(str: string): string {
    if (!str) return 'NULL';
    // Replace single quotes with double single quotes
    return "'" + str.replace(/'/g, "''") + "'";
}

function escapeSqlArray(arr: string[]): string {
    if (!arr || arr.length === 0) return "'[]'";
    // For JSONB, we need a valid JSON string, wrapped in SQL quotes.
    // JSON.stringify(["a", "b"]) -> '["a","b"]'
    // Then we escape single quotes for SQL.
    return escapeSql(JSON.stringify(arr));
}

async function scrape() {
    console.log(`Scanning ${TARGET_URL}...`);
    const { data: indexHtml } = await axios.get(TARGET_URL);
    const $ = cheerio.load(indexHtml);

    const links: string[] = [];

    // Selectors for card links
    $('.card, .mntl-card').each((_, el) => {
        const href = $(el).attr('href');
        if (href && (href.includes('/recipes/') || href.includes('-recipe-'))) {
            if (!links.includes(href) && links.length < TARGET_COUNT + 15) {
                links.push(href);
            }
        }
    });

    console.log(`Found ${links.length} links. Target ${TARGET_COUNT}.`);

    const recipes: Recipe[] = [];

    const PUBLIC_LIMIT = 20;

    for (let i = 0; i < links.length; i++) {
        if (recipes.length >= TARGET_COUNT) break;

        const link = links[i];
        console.log(`[${recipes.length + 1}/${TARGET_COUNT}] Scraping ${link}...`);

        try {
            const { data: pageHtml } = await axios.get(link);
            const $p = cheerio.load(pageHtml);

            // Extract fields
            const title = $p('h1.heading__title').text().trim() || $p('h1').first().text().trim();
            const description = $p('p.heading__subtitle').text().trim() || '';
            const photo_url = $p('meta[property="og:image"]').attr('content') || '';

            const prepText = $p('.project-meta__prep-time .meta-text__data').text().trim();
            const cookText = $p('.project-meta__cook-time .meta-text__data').text().trim();
            const servingsText = $p('.project-meta__yield .meta-text__data').text().trim();

            const parseMinutes = (str: string) => {
                if (!str) return 0;
                const match = str.match(/(\d+)\s*(min|hr)/);
                if (!match) return 0;
                let val = parseInt(match[1]);
                if (match[2] === 'hr') val *= 60;
                return val;
            };

            const parseServings = (str: string) => {
                if (!str) return 0;
                const match = str.match(/(\d+)/);
                return match ? parseInt(match[1]) : 0;
            };

            const ingredients: string[] = [];
            $p('ul.structured-ingredients__list li p').each((_, el) => {
                ingredients.push($p(el).text().trim());
            });
            if (ingredients.length === 0) {
                $p('.ingredient-list li').each((_, el) => {
                    ingredients.push($p(el).text().trim());
                });
            }

            let instructions = '';
            $p('#mntl-sc-block_1-0 p, #mntl-sc-block_2-0 p, .recipe__steps ol li p').each((_, el) => {
                instructions += $p(el).text().trim() + '\n\n';
            });

            if (title && ingredients.length > 0) {
                // Random User
                const randomUser = USER_IDS[Math.floor(Math.random() * USER_IDS.length)];

                // Public/Private Logic
                // is_private = true (private) or false (public)
                // We want 20 public. Logic: first 20 are public.
                const isPublic = recipes.length < PUBLIC_LIMIT;
                const isPrivate = !isPublic;

                recipes.push({
                    title,
                    description,
                    photo_url,
                    prep_time: parseMinutes(prepText),
                    cook_time: parseMinutes(cookText),
                    servings: parseServings(servingsText),
                    ingredients,
                    instructions: instructions.trim(),
                    category: 'Lunch',
                    // no source_url
                    user_id: randomUser,
                    is_private: isPrivate
                });
            }

        } catch (e: unknown) {
            console.error(`Failed ${link}:`, (e as Error).message);
        }

        // Polite delay
        await new Promise(r => setTimeout(r, 200));
    }

    // Generate SQL
    console.log(`Generating SQL for ${recipes.length} recipes...`);

    let sql = `INSERT INTO public.rb_recipes (
        title, description, photo_url, prep_time, cook_time, servings, 
        ingredients, instructions, category, user_id, is_private
    ) VALUES \n`;

    const values = recipes.map(r => {
        return `(
            ${escapeSql(r.title)},
            ${escapeSql(r.description)},
            ${escapeSql(r.photo_url)},
            ${r.prep_time || 'NULL'},
            ${r.cook_time || 'NULL'},
            ${r.servings || 'NULL'},
            ${escapeSqlArray(r.ingredients)},
            ${escapeSql(r.instructions)},
            ${escapeSql(r.category)},
            ${escapeSql(r.user_id)},
            ${r.is_private}
        )`;
    }).join(',\n');

    sql += values + ';';

    fs.writeFileSync('scripts/import_lunch.sql', sql);
    console.log('Done! SQL written to scripts/import_lunch.sql');
}

scrape();
