export type Item = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  quantity?: string;
};

export type Section = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  accentColor: string;
  badgeClass: string;
  progressClass: string;
  items: Item[];
};

export const sections: Section[] = [
  /* ─────────── TACOS ─────────── */
  {
    id: "tacos",
    title: "Tacos",
    subtitle: "The star of the show — load 'em up!",
    emoji: "🌮",
    accentColor: "#E8632A",
    badgeClass: "bg-orange-100 text-orange-800",
    progressClass: "bg-orange-400",
    items: [
      { id: "tacos-shells",     name: "Taco Shells / Tortillas",       description: "Hard shells or soft flour/corn tortillas",  emoji: "🫓", quantity: "pack of 20+" },
      { id: "tacos-beef",       name: "Seasoned Ground Beef",          description: "Taco-seasoned ground beef, cooked & ready", emoji: "🥩", quantity: "serves 8–10" },
      { id: "tacos-chicken",    name: "Shredded Chicken",              description: "Seasoned shredded chicken thighs or breast", emoji: "🍗", quantity: "serves 8–10" },
      { id: "tacos-lettuce",    name: "Shredded Lettuce",              description: "Iceberg or romaine, shredded fine",          emoji: "🥬", quantity: "large bag" },
      { id: "tacos-cheese",     name: "Shredded Cheese",               description: "Mexican blend or sharp cheddar",             emoji: "🧀", quantity: "2 cups+" },
      { id: "tacos-tomato",     name: "Pico de Gallo",                 description: "Fresh diced tomatoes, onion & cilantro",     emoji: "🍅", quantity: "2 cups" },
      { id: "tacos-sour-cream", name: "Sour Cream",                    description: "Full container for topping",                emoji: "🥛", quantity: "16 oz" },
      { id: "tacos-guacamole",  name: "Guacamole",                     description: "Fresh or store-bought — the good stuff",     emoji: "🥑", quantity: "2 cups" },
      { id: "tacos-salsa",      name: "Salsa",                         description: "Mild, medium, or hot — your call",           emoji: "🫙", quantity: "jar (16 oz)" },
      { id: "tacos-jalapenos",  name: "Jalapeños",                     description: "Sliced pickled or fresh jalapeños",          emoji: "🌶️", quantity: "1 jar / fresh" },
    ],
  },

  /* ─────────── NACHOS ─────────── */
  {
    id: "nachos",
    title: "Nachos",
    subtitle: "Piled high and fully loaded",
    emoji: "🧆",
    accentColor: "#C89B0A",
    badgeClass: "bg-amber-100 text-amber-800",
    progressClass: "bg-amber-400",
    items: [
      { id: "nachos-chips",       name: "Tortilla Chips",      description: "Large restaurant-style tortilla chips",     emoji: "🍟", quantity: "2 large bags" },
      { id: "nachos-queso",       name: "Queso / Cheese Sauce",description: "Velveeta-style or homemade queso dip",      emoji: "🧀", quantity: "large pot" },
      { id: "nachos-beans",       name: "Refried Beans",       description: "Canned or homemade refried beans",          emoji: "🫘", quantity: "2 cans" },
      { id: "nachos-olives",      name: "Black Olives",        description: "Sliced black olives for topping",           emoji: "🫒", quantity: "1 can (sliced)" },
      { id: "nachos-green-onion", name: "Green Onions",        description: "Sliced scallions for a fresh kick",         emoji: "🌿", quantity: "1 bunch" },
      { id: "nachos-cilantro",    name: "Cilantro",            description: "Fresh cilantro — love it or leave it",      emoji: "🌱", quantity: "1 bunch" },
      { id: "nachos-lime",        name: "Lime Wedges",         description: "Fresh limes cut into wedges",               emoji: "🍋", quantity: "4–5 limes" },
      { id: "nachos-hot-sauce",   name: "Hot Sauce",           description: "Tabasco, Cholula, or your fave bottle",     emoji: "🔥", quantity: "1–2 bottles" },
    ],
  },

  /* ─────────── DRINKS ─────────── */
  {
    id: "drinks",
    title: "Drinks",
    subtitle: "Stay cool and refreshed all night",
    emoji: "🥤",
    accentColor: "#2176AE",
    badgeClass: "bg-sky-100 text-sky-800",
    progressClass: "bg-sky-400",
    items: [
      { id: "drinks-horchata",    name: "Horchata",               description: "Classic Mexican cinnamon rice drink",    emoji: "🥛", quantity: "1 gallon jug" },
      { id: "drinks-agua-fresca", name: "Agua Fresca",            description: "Jamaica, watermelon, or tamarind",       emoji: "🍹", quantity: "1 gallon" },
      { id: "drinks-lemonade",    name: "Lemonade",               description: "Classic fresh-squeezed or sparkling",    emoji: "🍋", quantity: "1 gallon" },
      { id: "drinks-water",       name: "Water / Sparkling Water",description: "Still or sparkling cases",               emoji: "💧", quantity: "case (24 ct)" },
      { id: "drinks-soda",        name: "Sodas (assorted)",       description: "Coke, Sprite, Jarritos, etc.",           emoji: "🥤", quantity: "2 × 12-pack" },
      { id: "drinks-punch",       name: "Punch / Mocktail Mix",   description: "A festive non-alcoholic punch",          emoji: "🍊", quantity: "1 gallon" },
      { id: "drinks-ice",         name: "Ice Bags",               description: "Bag(s) of ice for the coolers",         emoji: "🧊", quantity: "2 × 10 lb bags" },
      { id: "drinks-cups",        name: "Cups & Napkins",         description: "Disposable cups and extra napkins",      emoji: "🥤", quantity: "pack of 50" },
    ],
  },
];
