-- Seed Data for Recipes
-- Generated automatically


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
    'Homemade Coffee Creamer',
    'This is a budget-friendly, easy, and more nourishing alternative to store-bought coffee creamer, made with just 3-ingredients.',
    '["4 cups whole milk, divided (or your milk of choice)","1/2 cup dark brown sugar (or your sweetener of choice)","2 teaspoons vanilla extract (or vanilla bean paste)"]'::jsonb,
    '10 Lazy Summer Recipes You Can Make With 5 Ingredients or Less
FEATURED IN:',
    NULL,
    35,
    NULL,
    'Dinner',
    '0cfc33ef-43d6-4724-8777-33f9843810c1',
    false,
    'https://www.simplyrecipes.com/thmb/za_8EBSznn5Bl-oL1BDR4EiVpQY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Cold-Brew-Coffee-LEAD-10-370e9962821a496886677f1b7dbcdce5.jpg'
);

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
    'Hummus Soup',
    'The solution for those who can never get enough hummus.',
    '["2 (15-ounce) cans chickpeas, drained and rinsed (3 heaping cups), divided","8 medium garlic cloves, peeled","3 tablespoons olive oil, divided","1 3/4 teaspoons kosher salt, plus more to taste","1 1/2 teaspoons ground cumin, divided","1 large yellow onion, chopped (about 1 3/4 cups)","4 small carrots, peeled and coarsely chopped (about 1 1/2 cups)","4 cups vegetable broth","1 cup water, plus more as needed","1/3 cup tahini","3 tablespoons fresh lemon juice (from 2 lemons), plus more to taste","1/4 cup chopped fresh flat-leaf parsley"]'::jsonb,
    'I often find myself eating hummus directly out of the container, and not just when I’ve reached the dregs of it. However strange it might sound (say, “hummus soup five times fast”), the classic dip lends itself beautifully to a simple, nourishing soup: bright lemon, velvety tahini, and a hearty blend of chickpeas and root vegetables.',
    10,
    40,
    NULL,
    'Dinner',
    'c4c2ff07-770d-41cc-95e6-ac2ad44c1d9a',
    false,
    'https://www.simplyrecipes.com/thmb/s8Yg0_tKaNz5SpPxkAjuJvx-RXc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Hummus-Soup-LEAD-3-15d4c9410f2b41c58944c1cf64f07b38.jpg'
);

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
    'Nilagang Baka (Filipino Beef Stew)',
    'The comforting one-pot meal couldn’t be easier to make.',
    '["2 pounds beef chuck stew meat (cubed), or beef sirloin, cubed","2 pounds beef short ribs","1 teaspoon baking soda","2 tablespoons vegetable oil","1 large white or yellow onion, chopped","2 cloves garlic, minced","2 green onions, chopped, white and green parts separated","10 cups water, or enough to fully cover the meats and vegetables","1 tablespoon fish sauce, like Red Boat","2 medium yellow or white potatoes, (5 to 10 ounces each), peeled and quartered","1 medium carrot (about 3 ounces), peeled and sliced","8 ounces green beans, trimmed and cut into 2-inch pieces (about 2 cups)","1/4 pound green cabbage, cut into 8 wedges","1/2 teaspoon kosher salt","1/4 teaspoon ground black pepper","4 cups steamed rice, optional","1/4 cup fish sauce"]'::jsonb,
    'Why Make This
This beef stew is a one-pot meal where everything simmers together for easy hands-off cooking.  The tender beef is flavored with garlic, onions, and fish sauce, resulting in a savory, clear broth.  You can swap in sweet potatoes, napa cabbage, or bok choy based on what you have available.',
    10,
    120,
    NULL,
    'Dinner',
    'fc6ebb38-de25-4850-a231-e46f5760d276',
    false,
    'https://www.simplyrecipes.com/thmb/UuNve5_SNUvXsuiEUnX8FenrHKI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SimplyRecipesNilagangBakaLead-8SERP-b6bc96d8f75a483990194666478ca599.jpg'
);

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
    'Steak Tips',
    'With a caramelized crust and tender, juicy interior, these New England-style steak tips are a restaurant favorite you can easily master at home.',
    '["1/2 cup ketchup","1/4 cup red wine vinegar","1/4 cup extra-virgin olive oil","1/4 cup water","4 ounces Coca-Cola","1/2 tablespoon Worcestershire sauce","1/2 tablespoon garlic powder","1/2 tablespoon oregano","1 3/4 teaspoon Diamond Crystal Kosher Salt (or 1 teaspoon Morton Kosher Salt), plus more for your seasoning","1/2 teaspoon black pepper","2 pounds steak tips, cut into 2-inch pieces","Canola oil, for searing","2 tablespoons finely minced parsley, for serving (optional)"]'::jsonb,
    'Steak tips are an absolute classic dish across New England, enjoyed at many pubs, bars, and American-style restaurants. They''re often grilled or seared, then served with a mound of creamy mashed potatoes and a side of greens or a salad.',
    10,
    20,
    NULL,
    'Dinner',
    'c4c2ff07-770d-41cc-95e6-ac2ad44c1d9a',
    false,
    'https://www.simplyrecipes.com/thmb/yzgNMDbhS95406wb6T_NOe_suOo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Steak-Tips-LEAD-2-3a7a23c4a7cd4976b8cbf65a1a87fcad.jpg'
);

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
    'Budae Jjigae (Army Base Stew)',
    'A family favorite that deliciously combines American ingredients and Korean cuisine.',
    '["2 tablespoons gochujang","2 tablespoons soy sauce","2 tablespoons mirin","2 tablespoons gochugaru","1 tablespoon fish sauce","2 teaspoons granulated sugar","2 ramen spice packets","4 cloves garlic, grated","1 cup rice cakes (sliced oval coins, fresh or frozen)","2 green onions","1 cup kimchi","1/4 cup napa cabbage","8 ounces enoki mushrooms","1 (4.6-ounce) can Vienna sausages, drained","1 (12-ounce) can Spam","12 ounces firm tofu, drained","1/2 cup canned pork and beans or baked beans","6 cups chicken broth","2 package instant ramen (preferably spicy)","1 to 2 slices american cheese","3 cups steamed rice"]'::jsonb,
    'Why Make This
Budae jjigae brings together Korean flavors and American pantry staples in one pot.This hearty stew uses flexible ingredients so you can tailor it to what you have on hand.Vegetarian and vegan swaps are simple, making this recipe adaptable for everyone.',
    20,
    15,
    NULL,
    'Dinner',
    'dfe2ca79-f6f5-41ca-9b27-f603f0f38881',
    false,
    'https://www.simplyrecipes.com/thmb/VYi5144besj_hTlsgDfVvmzdrFs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Budae-Jjigae-LEAD-02-a22325eea5b54891826b2d78c52fd90c.jpg'
);

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
    'Carne Picada',
    'Carne picada is tender braised beef with vegetables and a hearty sauce that makes a memorable main dish and perfect taco filling.',
    '["1 1/2 tablespoons all-purpose flour","1/2 teaspoon kosher salt","1/2 teaspoon freshly ground black pepper","2 pounds chuck roast, excess fat removed, cut into 1-inch cubes","2 tablespoons neutral oil, like canola or avocado, plus more as needed","1 (6-ounce) can tomato paste","5 cloves garlic, peeled","1 red bell pepper, stem and seeds removed","1/4 yellow or white onion (reserve the rest for the braise)","1/4 cup fresh cilantro","1/2 teaspoon ground cumin","1/2 teaspoon dried Mexican oregano","3 cups beef broth","1 tablespoon neutral oil","1 red bell pepper, thinly sliced","1 green bell pepper, thinly sliced","Remaining 3/4 yellow or white onion, thinly sliced","Salt and pepper, to taste"]'::jsonb,
    'Why Make This
Carne picada is a saucy braise of tender beef and vegetables that melts in your mouth.Serve it over rice, tuck it into tacos, or use it as a hearty burrito or quesadilla filling.',
    15,
    100,
    NULL,
    'Dinner',
    '5881d557-f01f-4c84-8836-d7559da6d864',
    false,
    'https://www.simplyrecipes.com/thmb/V2XxKv6M4J6zPCa6qKVOaPO9Rxc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Carne-Picada-LEAD-5-595c4623791c49999268899ed1d74079.jpg'
);

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
    'One-Pot Mac and Cheese',
    'Make this silky smooth mac and cheese all in one pot.',
    '["2 tablespoons unsalted butter","24 (76g) Ritz crackers, crushed (about 1 cup plus 2 tablespoons)","1/8 teaspoon freshly ground black pepper","Pinch kosher salt","1 tablespoon unsalted butter","1/2 teaspoon ground mustard","1/2 teaspoon freshly ground black pepper, plus more to taste","Pinch cayenne (optional)","4 cups water","2 cups half and half","1 teaspoon kosher salt, plus more to taste","1 pound elbow macaroni","4 ounces cream cheese, cubed and at room temperature","8 ounces sharp cheddar cheese, freshly grated (about 2 packed cups)","4 ounces Monterey Jack cheese, freshly grated (about 1 packed cup)"]'::jsonb,
    'Why Make This
Cook this macaroni right in the sauce for a creamy one-pot meal with less cleanup.Cream cheese, cheddar, and Monterey Jack create extra silkiness.The crunchy Ritz cracker topping adds texture, contrasting with the creamy pasta.',
    10,
    20,
    NULL,
    'Dinner',
    'c4c2ff07-770d-41cc-95e6-ac2ad44c1d9a',
    false,
    'https://www.simplyrecipes.com/thmb/eNeZK5vnEFJhq3fqk8HJhxltowg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-One-Pot-Mac-Cheese-LEAD-4-b54f2372ddcc49ab9ad09a193df66f20.jpg'
);

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
    'Johnny Marzetti Casserole',
    'This classic Midwestern pasta casserole is a total crowd-pleaser.',
    '["12 ounces mushrooms, cleaned and chopped or sliced","1 tablespoon olive oil or neutral cooking oil","1 large onion, chopped","5 cloves garlic, minced","1 bell pepper (any color), seeded and cored, finely chopped","Salt, to taste","1 1/2 pounds lean ground beef (90:10 is good)","1 (28-ounce) can whole plum tomatoes in juice","3 tablespoons tomato paste","3/4 teaspoon dried oregano","1/4 teaspoon crushed red pepper flakes","Freshly ground black pepper","12 ounces (2 3/4 cups) uncooked elbow macaroni","8 ounces grated cheddar cheese (2 generous cups), divided","4 ounces grated Parmesan cheese (1 1/2 cups), divided"]'::jsonb,
    'Johnny Marzetti casserole hails from the center of a heart-shaped state on the eastern boundary of the region we call the heartland. I can’t think of anything more Midwestern.',
    15,
    75,
    NULL,
    'Dinner',
    'e2c10cb0-4bd6-4a47-9ffc-82c17a167540',
    false,
    'https://www.simplyrecipes.com/thmb/TLGeNkN3tfNEHXjRzVzpgRXog_k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SimplyRecipes_JohnnyMarzettiCasserole_LEAD_6-c13a723336b04487b382ca871c13569b.jpg'
);

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
    'Honey Popcorn',
    'Forget caramel corn. Honey popcorn is so much easier and just as delicious.',
    '["2 tablespoons oil, such as canola, avocado, or coconut oil","1/2 cup (104g) popcorn kernels","1/2 cup honey","1/4 cup (56g) salted butter","1/2 teaspoon kosher salt, optional"]'::jsonb,
    'Growing up, my dad would pull out the air popper every night at nine and make popcorn. I loved the crispy texture and always looked forward to the bedtime snack. Every once in a while, mom would make caramel popcorn instead and I would eat as much as I could get away with.',
    10,
    50,
    NULL,
    'Dinner',
    'ce3e99cc-792a-4f2f-81bb-f3d8573d0561',
    false,
    'https://www.simplyrecipes.com/thmb/23p_g7HrsAnHRwqmusvAxjB54Os=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SimplyRecipes_HoneyPopcorn_LEAD_3-0865af29c73a43988eddf2593a76a654.jpg'
);

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
    'Baked Chicken Breasts',
    'Say goodbye to dry chicken breasts. Guaranteed juicy oven baked chicken breasts every time.',
    '["4 medium boneless, skinless chicken breasts (about 2 pounds total)","1 tablespoon kosher salt","1 teaspoon black pepper","1 tablespoon olive oil"]'::jsonb,
    'Boneless, skinless chicken breasts have a bad reputation for being dry and tough. While chicken breasts are certainly a go-to cut for various dishes due to their convenience, versatility, and quick cook time, no one likes a dry chicken breast. It’s time to change all of that with this recipe for tender and juicy chicken breasts, every time.',
    15,
    25,
    NULL,
    'Dinner',
    'e57e39d3-45f2-4415-b2ab-eb3452111c4a',
    false,
    'https://www.simplyrecipes.com/thmb/0F-qYK-QqfCuAWbbt8XFZLRaJ1o=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Baked-Chicken-Breasts-LEAD-12-91782c8919184521af1188b295f942c1.jpg'
);

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
    'Chicken Pot Pie Soup',
    'All of the chicken pot pie, none of the hassle.',
    '["3 tablespoons unsalted butter","1 large yellow onion, chopped (about 2 cups)","2 small carrots, chopped (about 1 1/4 cups)","2 medium ribs celery, sliced (about 1 1/4 cups)","6 large garlic cloves, chopped (about 2 tablespoons)","1 1/2 teaspoons kosher salt","1 teaspoon dried thyme","3 tablespoons all-purpose flour","6 cups chicken broth","2 cups shredded chicken (from 1 rotisserie chicken)","2 cups chopped red potatoes (about 4 potatoes)","2 cups frozen peas (from one 16-ounce bag)","1/2 cup half and half","2 cups oyster crackers","1/4 cup olive oil","1 teaspoon kosher salt","1 teaspoon dried thyme","1/4 teaspoon cayenne pepper (optional)"]'::jsonb,
    'Let us paint you a picture. Snow is swirling outside your window, there’s a fire blazing in your fireplace, and you’re snuggled on the couch in your slippers with a pot of chicken pot pie soup simmering away on the stove. We think if comfort could be bottled and sold, it would take the form of this soup, a minimal-prep version of chicken pot pie that allows for plenty of nesting time.',
    10,
    40,
    NULL,
    'Dinner',
    'dfe2ca79-f6f5-41ca-9b27-f603f0f38881',
    false,
    'https://www.simplyrecipes.com/thmb/le0jfSHhvnInhAI3WgOvNOKK8Qg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Chicken-Pot-Pie-Soup-LEAD-4-62236449b8074e14b798740d072c1c99.jpg'
);

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
    'Stuffed Pepper Soup',
    'Stuffed peppers, deconstructed as soup and just as satisfying.',
    '["2 tablespoons olive oil","1 large yellow onion, chopped (about 2 cups)","3 cups chopped bell pepper, any color (from 3 bell peppers)","6 garlic cloves, chopped (about 2 tablespoons)","2 teaspoons smoked paprika","1 teaspoon kosher salt","1 teaspoon ground cumin","1 pound lean ground beef (85:15)","1 (15-ounce) can crushed tomatoes","4 cups beef broth","1 (8.8-ounce) package precooked microwavable white rice","6 ounces sharp white Cheddar cheese, shredded (about 1 1/2 cups)","Chopped fresh flat-leaf parsley, for serving"]'::jsonb,
    'With peppers, onions, garlic, ground beef, beef broth, and tomatoes, this soup has all the ingredients you typically find in stuffed peppers, but it’s even easier to make! No oven required. We like topping our bowls with a hefty helping of shredded sharp white Cheddar cheese and a sprinkling of fresh parsley.',
    10,
    40,
    NULL,
    'Dinner',
    'c4c2ff07-770d-41cc-95e6-ac2ad44c1d9a',
    false,
    'https://www.simplyrecipes.com/thmb/ePYh9Yjz6EZQ2Z4xA4det3EQnNk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Stuffed-Pepper-Soup-LEAD-3-6cb024e1ea244d15a60f8b19189e42a6.jpg'
);

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
    'Monster Cookies',
    'Packed with chocolate chips, M&Ms, and peanut butter, these oat-based cookies are naturally gluten-free.',
    '["1 cup (255g) creamy peanut butter","1/4 cup unsalted butter, room temperature","1/2 cup (100g) packed light brown sugar","1/2 cup (100g) granulated sugar","2 large eggs, room temperature","2 teaspoons vanilla extract","1 teaspoon baking soda","1/2 teaspoon kosher salt","3 cups (260g) quick-cooking oats","1 cup M&Ms","1 cup semi-sweet chocolate chips"]'::jsonb,
    'Monster cookies are soft-baked, peanut butter-based cookies loaded up with oats, chocolate chips, and M&Ms. They’re crisp on the outside and soft and chewy on the inside. This version is flourless, relying on peanut butter and oats to create an irresistible texture.',
    15,
    14,
    NULL,
    'Dinner',
    '0cfc33ef-43d6-4724-8777-33f9843810c1',
    false,
    'https://www.simplyrecipes.com/thmb/zy0_BEfX-SIyfTu-E9EysUnYiT8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Monster-Cookies-LEAD-9-3a105eaf86bd4691913cbb2c18c1b5a3.jpg'
);

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
    'Garlic Fried Rice',
    'It takes just a few simple ingredients to make this iconic Filipino dish.',
    '["3 to 4 cups cooked long grain white rice, 1 to 2 days old, refrigerated","1 teaspoon salt, divided","2 tablespoons vegetable oil","4 large cloves garlic, minced","1/4 teaspoon white pepper","1 thinly sliced green onion or a handful of chives, optional, for garnish"]'::jsonb,
    'Why Make This
This Filipino garlic fried rice recipe is a clever way to use leftover white rice.Serve it with eggs, tomatoes, or cured meats for a versatile breakfast or side.Cooking minced garlic in hot oil infuses the dish with irresistible aroma and flavor.',
    5,
    6,
    NULL,
    'Dinner',
    'e57e39d3-45f2-4415-b2ab-eb3452111c4a',
    false,
    'https://www.simplyrecipes.com/thmb/Xv-6vi7cwe12MvRXzYBelcq7Pyg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Garlic-Fried-Rice-LEAD-3-7869fdcded86485ebc13ceacd93d7796.jpg'
);

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
    'Homemade Cosmic Brownies',
    'Fudgy, chocolatey, and adorable, these cosmic brownies are ten times better than store-bought.',
    '["Nonstick cooking spray","1/2 cup (113g) unsalted butter","1/4 cup (28g) Dutch-process cocoa powder","2 tablespoons neutral oil, such as canola or vegetable","5 ounces (142g) bittersweet chocolate, finely chopped","2/3 cup (145g) granulated sugar","1/3 cup (72g) packed light brown sugar","2 large eggs, at room temperature","1 teaspoon vanilla extract","1/4 cup (32g) all-purpose flour","1/2 teaspoon baking powder","1/2 teaspoon kosher salt","3 ounces (85g) bittersweet chocolate, finely chopped","Pinch kosher salt","6 tablespoons heavy cream","Candy-coated chocolate chip sprinkles, as desired for topping"]'::jsonb,
    'Why Make This
A simple ganache and colorful sprinkles create that nostalgic Cosmic Brownie look.The recipe guides you through achieving a fudgy, moist crumb with a shiny, crinkly top.These brownies keep well for days, making them a great make-ahead dessert.',
    20,
    30,
    NULL,
    'Dinner',
    '5881d557-f01f-4c84-8836-d7559da6d864',
    false,
    'https://www.simplyrecipes.com/thmb/w52xKYdM2peskIGtntk3i4202sU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SimplyRecipes_CosmicBrownies_LEAD_5-01ab51e01a644e87becbdec1a7a3b67c.jpg'
);

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
    'Pizza Salad',
    'Featuring all your favorite pizza toppings in one big bowl, pizza salad is all about flavor and fun.',
    '["1/4 cup red wine vinegar","1 teaspoon tomato paste","2 teaspoons Dijon mustard","1/2 teaspoon sugar","1 1/2 teaspoons dried oregano","1 teaspoon garlic powder","1/2 teaspoon kosher salt","1 teaspoon black pepper","3/4 cup extra-virgin olive oil","6 ounces sliced pepperoni slices","5 ounces mini mozzarella balls (or large balls, quartered)","2/3 cup sliced black olives","1 cup sliced red onion","2 cups chopped bell pepper (yellow, red, green)","4 packed cups shredded iceberg lettuce","4 packed cups chopped romaine lettuce","1/2 cup freshly, finely grated Parmesan cheese","4 breadsticks"]'::jsonb,
    'Why Make This
All your favorite pizza toppings come together in this fresh, crunchy salad bowl.A tomato-oregano vinaigrette brings classic pizza flavor.Easily customize the toppings to suit meat lovers, vegetarians, or picky eaters.',
    25,
    NULL,
    NULL,
    'Dinner',
    'b1c595e8-8d33-482e-af4b-f753bf7f2338',
    false,
    'https://www.simplyrecipes.com/thmb/fRQpkakCu1wWD3HLqAms74q1JQw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Pizza-Salad-LEAD-25-2-aae5d5c178e24109b8f8fac85436c370.jpg'
);

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
    'Banh Mi Salad',
    'A fresh, colorful salad with the flavors of a classic bánh mì.',
    '["1/2 cup distilled white vinegar","1/2 cup water","1/4 cup granulated sugar","1/2 teaspoon salt","2 medium carrots","1 (6-ounce) piece daikon (no more than 2 inches wide)","2 tablespoons minced lemongrass","2 cloves garlic, minced","1 tablespoon sugar","1 tablespoon olive oil","1 tablespoon fish sauce","1 tablespoon soy sauce","1/2 teaspoon freshly ground black pepper","1 1/2 pounds boneless skinless chicken thighs","Juice of 1 medium lime (about 2 tablespoons)","2 tablespoons mayonnaise","2 tablespoons olive oil","1 small or 1/2 medium jalapeño pepper, seeded and minced (about 1 tablespoon)","1 clove garlic, minced","1/4 teaspoon kosher salt","2 medium romaine lettuce hearts (about 8 ounces total), chopped or sliced","2 Persian cucumbers (about 6 ounces total), thinly sliced","1/2 cup fresh cilantro leaves","French baguette, for serving (optional)"]'::jsonb,
    'A bánh mì is one of my very favorite sandwiches thanks to the combination of savory, spicy, and sweet flavors and the counterplay of crunchy and soft textures. The Vietnamese dish consists of a baguette spread with aioli and pâté and filled with meat, sweet and tangy pickled vegetables, cilantro, and often sliced cucumber and jalapeño.',
    20,
    20,
    NULL,
    'Dinner',
    'ce3e99cc-792a-4f2f-81bb-f3d8573d0561',
    false,
    'https://www.simplyrecipes.com/thmb/8pjDNOsGBIyKFajPkLkOzXMAYlM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Banh-Mi-Salad-LEAD-05-f149db3c7667453093a032cfa3c83a92.jpg'
);

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
    'Homemade Poultry Seasoning',
    'Add this homemade poultry seasoning to so much more than just turkey or chicken!',
    '["1 tablespoon rubbed sage","2 teaspoons dried thyme","1 teaspoon dried marjoram","1/2 teaspoon dried crushed rosemary","1/8 teaspoon ground white pepper (or substitute black pepper)","1/8 teaspoon ground nutmeg"]'::jsonb,
    '18 Homemade Seasoning Blends That Beat Anything From the Store
FEATURED IN:',
    5,
    NULL,
    NULL,
    'Dinner',
    'b1c595e8-8d33-482e-af4b-f753bf7f2338',
    false,
    'https://www.simplyrecipes.com/thmb/fck77xCez__BmE7r2F2imWq9GKg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Homemade-Poultry-Seasoning-LEAD-5-36-b9e458f8b23345bb955cd3a83ae8ef22.jpg'
);

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
    'Easy Roast Chicken',
    'This is the easiest, simple roast chicken recipe. Works every time.',
    '["1 (3 1/2 to 5-pound) whole chicken","5 cups roughly chopped vegetables (1 to 1 1/2-inch pieces), such as carrots, onions, potatoes, parsnip, fennel, butternut squash, or turnips","2 tablespoons olive oil","Salt and freshly ground black pepper","1 small lemon, halved, or 1/2 large lemon","1/2 yellow or white onion, peeled and cut into 1-inch wedges","2 sprigs rosemary or 1 small bunch thyme, optional","3 tablespoons butter, softened (optional)"]'::jsonb,
    'Why Make This
This recipe yields juicy meat and crisp skin without basting.Chopped vegetables roast alongside the chicken, soaking up flavorful pan juices.You can use any leftover chicken in easy meals like enchiladas, wraps, or salad the next day.',
    15,
    60,
    NULL,
    'Dinner',
    'ce3e99cc-792a-4f2f-81bb-f3d8573d0561',
    false,
    'https://www.simplyrecipes.com/thmb/40sEPQ1pzJiXiZIZPSgUbitwvUo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Easy-Roast-Chicken-LEAD-eb425a506ddd47bb86c7159882872a40.jpg'
);

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
    'Marble Blondies',
    'Can’t decide between blondies and brownies? Don’t! Make these marble blondies instead.',
    '["Nonstick cooking spray, for greasing the pan","1 cup (226g) unsalted butter, melted and cooled","1 1/3 cups (270g) packed light brown sugar","1/3 cup (70g) granulated sugar","2 large eggs plus 1 large yolk, room temperature, divided","1 tablespoon vanilla extract","2 cups (270g) all-purpose flour","1 1/4 teaspoons kosher salt","1 teaspoon baking powder","3 1/2 ounces semi-sweet chocolate, melted and cooled","2 tablespoons Dutch-process cocoa powder","1/4 teaspoon espresso powder, optional","1/2 cup white chocolate chips","1/2 cup semi-sweet chocolate chips"]'::jsonb,
    'As someone who grew up in the Hannah Montana era, I’d be remiss to not make the joke that these blondies are truly “the best of both worlds.” This recipe uses one simple batter to yield a vanilla blondie and a chocolatey, brownie-esque batter that are layered and swirled to create mesmerizing, decadent marbled blondies. If you can’t decide between blondies and brownies, then this recipe is the answer.',
    20,
    30,
    NULL,
    'Dinner',
    '0cfc33ef-43d6-4724-8777-33f9843810c1',
    false,
    'https://www.simplyrecipes.com/thmb/A_c0tlNb750zopkm6wkLudd8Z3g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SimplyRecipes_MarbleBlondies_LEAD_5-6aa9eddc8446419796e0c3cc6d0acfed.jpg'
);

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
    'Caribbean Green Seasoning',
    'Add it to everything from stews to rice to meat.',
    '["1 large onion, roughly chopped","16 cloves garlic, peeled","6 Trinidadian pimento peppers or 1 red or green Cubanelle pepper","8 green onions, trimmed","4 Guyanese wiri wiri peppers (or 1 Scotch bonnet or 2 to 3 habaneros)","6 culantro leaves","Leaves from 10 sprigs parsley","16 sprigs thyme","10 basil leaves"]'::jsonb,
    'Why Make This
This versatile green seasoning boosts flavor in meats, stews, seafood, and rice.Fresh herbs like culantro, thyme, and basil create an aromatic cooking base.You can store it for weeks in the fridge or freeze cubes for six months.',
    20,
    NULL,
    NULL,
    'Dinner',
    'b1c595e8-8d33-482e-af4b-f753bf7f2338',
    true,
    'https://www.simplyrecipes.com/thmb/1eDSvgQ3_TNT25oPX9Tp3qqeYFs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Caribbeangreenseasoning-31-97976c23aa954a79aef479cfdb4e548d.jpg'
);

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
    'Almond Croissants',
    'Bakery-worthy almond croissants are surprisingly easy to make at home.',
    '["1/4 cup (50g) granulated sugar","1/4 cup (60ml) water","1 tablespoon dark rum, or 1 teaspoon vanilla extract","1 cup (96g) almond flour","1 tablespoon all-purpose flour","1/4 teaspoon kosher salt","1/2 cup (113g) unsalted butter, at soft room temperature","1 cup (113g) powdered sugar","1 large egg","1/2 teaspoon almond extract","6 store-bought or leftover croissants","1/2 cup (43g) sliced almonds","Powdered sugar, for dusting"]'::jsonb,
    'If you’re a café or bakery regular, you might assume almond croissants are too elaborate to make at home. The truth is that they''re deceivingly easy to make. Almond croissants are a delicious way for bakeries to reinvent leftover croissants from the day before—and you can, too.',
    30,
    20,
    NULL,
    'Dinner',
    'fc6ebb38-de25-4850-a231-e46f5760d276',
    true,
    'https://www.simplyrecipes.com/thmb/TSdrLyOJpN_jhWcast6xkY2vr4k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Almond-Croissant-LEAD-2-091fb90cb09d4e9c864cc3522b977b8b.jpg'
);

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
    'Garam Masala',
    'Fresh garam masala is in a whole other league from anything you can get at the store.',
    '["2 tablespoons plus 1 teaspoon (15g) coriander seeds","4 teaspoons (10g) cumin seeds","2 teaspoons (6g) green cardamom pods","3/4 teaspoon whole cloves (1g)","1 teaspoon black peppercorns (3g)","1/2 stick (2.9g) Ceylon cinnamon","1/2 (0.3g) Tej patta (Indian bay leaf), crushed into 1/2-inch pieces (optional)"]'::jsonb,
    'There is nothing like the smell of earthy, sweet, and freshly toasted spices in the kitchen. As a child, this was a familiar scent I came to expect on weekend mornings when my mother was grinding whole spices into fragrant powders to store in the pantry.',
    7,
    3,
    NULL,
    'Dinner',
    'ce3e99cc-792a-4f2f-81bb-f3d8573d0561',
    true,
    'https://www.simplyrecipes.com/thmb/4EZKliglpDuwZS1oB4vmgHQ4lJs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Garam-Masala-LEAD-2-V-5-4cb3a1111af64447bdbf7c470bc6b504.jpg'
);

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
    'Maduros (Fried Sweet Plantains)',
    'Perfectly tender and crisp maduros are easy to make at home.',
    '["2 sweet plantains, very ripe","1 cup neutral oil, for frying"]'::jsonb,
    'Fried sweet plantains or platanos maduros fritos (maduros for short) are soft, sweet, and extremely simple to make. You only need two ingredients: a plantain and oil to fry it in! Despite their caramelized sugar taste, this dish is most often served as an accompaniment to savory foods throughout the Caribbean, Latin America, and many countries in Africa. I come from Jamaican heritage and we enjoy fried plantains any time of the day—alongside breakfast, lunch, and dinner.',
    5,
    10,
    NULL,
    'Dinner',
    'dfe2ca79-f6f5-41ca-9b27-f603f0f38881',
    true,
    'https://www.simplyrecipes.com/thmb/HWo5Y5QHWOdHwMnnOZwpijeUsAY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Maduros-METHOD-3B-72b223775bea4d1cb48aa2e53fd3b503.jpg'
);

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
    'British Flapjacks',
    'This sweet, oaty British snack is great for taking on the go.',
    '["2 1/2 cups (250g) quick-cook rolled oats","1/2 cup (75g) mixed seeds","1/2 cup (75g) dried fruit","1/2 teaspoon kosher salt","1/2 teaspoon cinnamon","1/2 cup (113g) unsalted butter","1/2 cup (107g) brown sugar","1/3 cup (112g) golden syrup"]'::jsonb,
    'Why Make This
British flapjacks offer a chewier, more buttery alternative to American granola bars.This recipe is highly customizable with your favorite seeds, nuts, or dried fruits.Flapjacks stay fresh for a week at room temperature, or they can be frozen for longer storage.',
    15,
    25,
    NULL,
    'Dinner',
    'fc6ebb38-de25-4850-a231-e46f5760d276',
    true,
    'https://www.simplyrecipes.com/thmb/w7o9p_3_cCjBOtHrRUSrj_OYjxQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Flapjacks-LEAD-3-f78246cceadb49b6a9bda34cba603eb3.jpg'
);

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
    'Kitchen Sink Cookies',
    'Soft, chewy, and infinitely riffable, you''re going to love these cookies!',
    '["2 1/2 cups (338g) all-purpose flour","1 3/4 teaspoons baking soda","1 1/4 teaspoons kosher salt","1/2 teaspoon baking powder","1 cup (226g) unsalted butter, melted and cooled","3/4 cup (164g) firmly packed light brown sugar","1/4 cup (50g) granulated sugar","1 3/4 teaspoons vanilla extract","2 large eggs, at room temperature","1 1/3 cups (8 ounces) chocolatey mix-ins, such as semi-sweet chocolate chips or chunks","1 1/3 cups (3 ounces) salty mix-ins, such as ridged, salted potato chips or pretzels","1/2 cup (2 1/2 ounces) nutty mix-ins, such as chopped, roasted peanuts","1/4 cup (2 ounces) chewy/sticky mix-ins, such as toffee bits"]'::jsonb,
    'Why Make This
These cookies are soft, chewy, and packed with a variety of flavors and textures.The recipe is endlessly adaptable, letting you swap in your favorite mix-ins each time.You can freeze scooped dough portions to bake fresh cookies on demand.',
    10,
    15,
    NULL,
    'Dinner',
    'dfe2ca79-f6f5-41ca-9b27-f603f0f38881',
    true,
    'https://www.simplyrecipes.com/thmb/l_sd7_LzMavUTOwJjywA8Cq7BDU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Kitchen-Sink-Cookies-LEAD-7-beb811464e15402b9447551a14e0d239.jpg'
);

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
    'Homemade Macaroni and Cheese Mix',
    'Way better than the blue box stuff.',
    '["1 1/2 cups (6 ounces/170g) dry macaroni, shells, or other smaller pasta shape","3 tablespoons (20g) cheddar cheese powder, orange or white","1/2 teaspoon tapioca starch, optional","1/4 teaspoon salt","3 tablespoons milk, any kind","1 to 2 tablespoons butter (if using salted, reduce the salt a bit)"]'::jsonb,
    'We love macaroni and cheese in all forms at our house: from scratch on the stovetop, baked in the oven with a crown of buttery breadcrumbs, and especially from a box mix. Those little orange or blue boxes have been my friends since I was a kid. They represented simple, comforting meals I could make myself. Ditto the years I spent as a clueless adult making my way in the world. Before our daughter was born, about once a week her dad and I gloriously slummed it on Trader Joe’s classic macaroni and cheese enriched with cut-up hot dogs and frozen peas.',
    5,
    20,
    NULL,
    'Dinner',
    'c4c2ff07-770d-41cc-95e6-ac2ad44c1d9a',
    true,
    'https://www.simplyrecipes.com/thmb/jVR46TC1eifl1fpGFayfZvJdWbw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-DIY-Macaroni-Cheese-LEAD-03-3de03194f28d4f54b870daae7d9d5778.jpg'
);

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
    'One-Pot Taco Pasta',
    'A complete, crowd-pleasing meal with minimal clean-up? Yes, please!',
    '["1 tablespoon olive oil","1 white onion, chopped","1 red bell pepper, chopped","1 pound lean ground beef (12 ounces if using Impossible Meat)","2 tablespoons homemade taco seasoning or 1 (1-ounce) packet taco seasoning","1 teaspoon smoked or sweet paprika","1 teaspoon ground cumin","1 (14.5-ounce) can diced tomatoes","1 (4-ounce) can chopped green chilis","8 ounces elbow pasta","2 cups beef or vegetable broth","1 cup shredded cheddar cheese","1/4 cup fresh cilantro, chopped","2 tablespoons fresh lime juice (about 1 lime)","1 tablespoon hot sauce, optional","Salt, as needed","Green onions, chopped","Sour cream","Lime wedges"]'::jsonb,
    'We get all of our cooking skills from our mom, but today we’re going to give some credit to our dad. True to his bold Leo personality, he likes to add some shock value to whatever he’s making, regardless of the outcome. One time he added Grape-Nuts to meatloaf, a decision he still stands by even though it traumatized our entire family.',
    5,
    30,
    NULL,
    'Dinner',
    'b1c595e8-8d33-482e-af4b-f753bf7f2338',
    true,
    'https://www.simplyrecipes.com/thmb/NOy6DBjDvoNkqGOJ4Gf8W-isJqs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-One-Pot-Taco-Pasta-LEAD-10-e29b5d7e069f4395a10b730d95e72fd5.jpg'
);

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
    'Quick and Easy Buffalo Chicken Tacos',
    'This weeknight winner is ready in under 20 minutes and is topped with a creamy, crunchy slaw and blue cheese.',
    '["6 tablespoons (3/4 stick) unsalted butter","1/2 cup hot sauce, such as Franks RedHot or Cholula","1/2 teaspoon garlic powder","1 small or 1/2 large plain rotisserie chicken (about 1 3/4 pounds), shredded (about 4 packed cups)","3 tablespoons whole milk plain Greek yogurt or sour cream","2 tablespoons freshly squeezed lime juice (about 1 medium lime)","1 tablespoon olive oil","1/2 teaspoon kosher salt","1/4 teaspoon freshly ground black pepper","4 packed cups (10 ounces) coleslaw mix","12 (6-inch) flour tortillas","2 green onions, thinly sliced","4 ounces blue cheese, crumbled (about 1 cup)"]'::jsonb,
    'Why Make This
Buffalo chicken tacos come together in under 20 minutes using convenient shortcuts.Shredded rotisserie chicken and bagged coleslaw mix save time and effort.The creamy, tangy slaw with blue cheese provides great flavor and crunchy texture.',
    15,
    2,
    NULL,
    'Dinner',
    'c4c2ff07-770d-41cc-95e6-ac2ad44c1d9a',
    true,
    'https://www.simplyrecipes.com/thmb/daAjrqUrSNWN_e2UpRx2Z7xbTic=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Buffalo-Chicken-Tacos-LEAD-2-bc08e06aff4c4970b0beabd80287356c.jpg'
);

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
    'Million Dollar Pie',
    'A classic icebox pie gets an upgrade—but it’s still super duper easy.',
    '["12 whole graham crackers (180g)","2 tablespoons granulated sugar","1/2 teaspoon ground cinnamon","1/4 teaspoon kosher salt","8 tablespoons (113g) unsalted butter, melted","1 cup (113g) chopped pecans","1 cup (85g) sweetened desiccated coconut","1 (20-ounce) can crushed pineapple","1 (14-ounce) can sweetened condensed milk","3 tablespoons lemon juice","4 ounces cream cheese, softened","3 tablespoons powdered sugar","2 cups (480ml) heavy cream","8 to 10 maraschino cherries, optional"]'::jsonb,
    'Why Make This
Million dollar pie is an almost no-bake recipe that comes together without heating your house.You can make this pie a day ahead, and it actually tastes better after chilling for several hours.Choose shortcuts like a store-bought crust and whipped topping if you want to save time.',
    30,
    10,
    NULL,
    'Dinner',
    'e2c10cb0-4bd6-4a47-9ffc-82c17a167540',
    true,
    'https://www.simplyrecipes.com/thmb/1jYl1zECev7QmtUvw7VYSmemeU4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SimplyRecipes_MillionDollarPie_LEAD_1-98b470e043f24f8eb8389f1c7cd8a79f.jpg'
);
