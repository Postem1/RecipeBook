
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Types for our scraped data
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

const TARGET_URL = 'https://www.simplyrecipes.com/recipes-5090746';
const RECIPE_COUNT = 30;

async function scrapeRecipes() {
    console.log(`Starting scrape of ${TARGET_URL}...`);

    try {
        const { data: indexHtml } = await axios.get(TARGET_URL);
        const $ = cheerio.load(indexHtml);

        // Extract recipe links
        const links: string[] = [];

        // Selector based on browser inspection: .mntl-card
        $('.mntl-card').each((_, element) => {
            const href = $(element).attr('href');
            if (href && !links.includes(href) && links.length < RECIPE_COUNT) {
                links.push(href);
            }
        });

        // Fallback for list items if needed
        if (links.length < RECIPE_COUNT) {
            $('.card').each((_, element) => {
                const href = $(element).attr('href');
                if (href && !links.includes(href) && links.length < RECIPE_COUNT) {
                    links.push(href);
                }
            });
        }

        console.log(`Found ${links.length} potential recipe links.`);

        const recipes: ScrapedRecipe[] = [];

        for (const link of links) {
            console.log(`Scraping: ${link}`);
            try {
                const { data: recipeHtml } = await axios.get(link);
                const $r = cheerio.load(recipeHtml);

                // Extract Metadata
                const title = $r('h1.heading__title').text().trim() || $r('h1').first().text().trim();
                const description = $r('p.heading__subtitle').text().trim() || $r('#article-header_1-0 p').text().trim();
                const photo_url = $r('meta[property="og:image"]').attr('content') || '';

                const prepText = $r('.project-meta__prep-time .meta-text__data').text().trim();
                const cookText = $r('.project-meta__cook-time .meta-text__data').text().trim();
                const servingsText = $r('.project-meta__yield .meta-text__data').text().trim();

                const category = $r('.breadcrumbs__item').last().text().trim() || 'Dinner';

                const ingredients: string[] = [];
                // Try multiple ingredient selectors
                const ingSelectors = [
                    'ul.structured-ingredients__list li',
                    '.ingredient-list li',
                    '.js-ingredients li'
                ];

                for (const sel of ingSelectors) {
                    if (ingredients.length > 0) break;
                    $r(sel).each((_, el) => {
                        const t = $r(el).text().trim();
                        if (t) ingredients.push(t);
                    });
                }

                let instructions = '';
                // Instructions selectors
                const stepSelectors = [
                    '#mntl-sc-block_1-0',
                    '#mntl-sc-block_2-0',
                    '.mntl-sc-block-group--LI',
                    '.recipe__steps ol li',
                    '.js-directions ol li'
                ];

                for (const sel of stepSelectors) {
                    $r(sel).each((_, el) => {
                        const stepText = $r(el).text().trim();
                        // check if it's already added to avoid dups if selectors overlap
                        if (stepText && !instructions.includes(stepText)) {
                            instructions += stepText + '\n\n';
                        }
                    });
                    if (instructions.length > 50) break; // If we found decent content
                }

                const parseMinutes = (str: string) => {
                    if (!str) return null;
                    const match = str.match(/(\d+)\s*(min|hr)/);
                    if (!match) return null;
                    let val = parseInt(match[1]);
                    if (match[2] === 'hr') val *= 60;
                    return val;
                };

                const parseServings = (str: string) => {
                    if (!str) return null;
                    const match = str.match(/(\d+)/);
                    return match ? parseInt(match[1]) : null;
                };

                // Only add if we have at least a title and ingredients
                if (title && ingredients.length > 0) {
                    recipes.push({
                        title,
                        description,
                        photo_url,
                        prep_time: parseMinutes(prepText),
                        cook_time: parseMinutes(cookText),
                        servings: parseServings(servingsText),
                        ingredients,
                        instructions: instructions.trim(),
                        category,
                        source_url: link
                    });
                }

            } catch (err) {
                console.error(`Failed to scrape ${link}:`, err);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        fs.writeFileSync('recipes_data.json', JSON.stringify(recipes, null, 2));
        console.log(`Saved ${recipes.length} recipes to recipes_data.json`);

    } catch (error) {
        console.error("Main scrape failed:", error);
    }
}

scrapeRecipes();
