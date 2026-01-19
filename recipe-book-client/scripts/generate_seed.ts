
import fs from 'fs';

// Define the User IDs directly here
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
    "e2c10cb0-4bd6-4a47-9ffc-82c17a167540"
];

interface ScrapedRecipe {
    title: string;
    description: string;
    photo_url: string;
    prep_time: number | null;
    cook_time: number | null;
    servings: number | null;
    ingredients: string[];
    instructions: string;
    category: string;
    source_url: string;
}

function generateSeed() {
    try {
        const rawData = fs.readFileSync('recipes_data.json', 'utf8');
        const recipes: ScrapedRecipe[] = JSON.parse(rawData);

        if (!recipes || recipes.length === 0) {
            console.error("No recipes found in recipes_data.json");
            return;
        }

        let sql = `-- Seed Data for Recipes
-- Generated automatically

`;

        // 20 Public, Rest Private
        // We'll shuffle strictly to ensure randomness if needed, or just iterate
        // Requirement: 20 Public, 10 Private.

        let publicCount = 0;
        const targetPublic = 20;

        recipes.forEach((recipe) => {
            // Random user
            const userId = USER_IDS[Math.floor(Math.random() * USER_IDS.length)];

            // Determine visibility (map public->private)
            let isPrivate = false;
            // First 20 are public (isPrivate = false), rest are private (isPrivate = true)
            if (publicCount < targetPublic) {
                isPrivate = false;
                publicCount++;
            } else {
                isPrivate = true;
            }

            // Build SQL
            // Escape single quotes in text
            const escape = (str: string) => str.replace(/'/g, "''");

            const title = escape(recipe.title);
            const desc = escape(recipe.description);
            const instructions = escape(recipe.instructions);
            const category = escape(recipe.category);
            const photo = escape(recipe.photo_url);

            // Convert ingredients array to JSON string for Postgres
            const ingredientsJson = JSON.stringify(recipe.ingredients).replace(/'/g, "''");

            sql += `
INSERT INTO rb_recipes (
    title, 
    description, 
    ingredients, 
    instructions, 
    prep_time, 
    cook_time, 
    servings, 
    category, 
    user_id, 
    is_private, 
    photo_url
) VALUES (
    '${title}',
    '${desc}',
    '${ingredientsJson}'::jsonb,
    '${instructions}',
    ${recipe.prep_time || 'NULL'},
    ${recipe.cook_time || 'NULL'},
    ${recipe.servings || 'NULL'},
    '${category}',
    '${userId}',
    ${isPrivate},
    '${photo}'
);
`;
        });

        fs.writeFileSync('seed_recipes.sql', sql);
        console.log(`Generated SQL for ${recipes.length} recipes in seed_recipes.sql`);

    } catch (error) {
        console.error("Error generating seed:", error);
    }
}

generateSeed();
