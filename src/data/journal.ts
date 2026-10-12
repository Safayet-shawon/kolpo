// Journal content. Nothing here is presented as a published KOLPO article: entries flagged
// `sample: true` demonstrate the layout and say so on the page. Add real articles by appending to `articles`.

export type Article = {
  slug: string;
  title: string;
  category: "Architecture" | "Interior" | "Construction";
  date: string; // ISO
  readMinutes: number;
  excerpt: string;
  image: { key: string; alt: string };
  body: { h?: string; p: string }[];
  sample: boolean;
};

export const articles: Article[] = [
  {
    slug: "reading-a-site-before-drawing-it",
    title: "Reading a site before drawing it",
    category: "Architecture",
    date: "2026-10-01",
    readMinutes: 3,
    excerpt: "Four questions worth answering about any plot before a single line of the plan is drawn.",
    image: { key: "cons-1-site", alt: "Aerial view of an empty development plot with a gravel access road and trees" },
    sample: true,
    body: [
      { p: "Every site has already made a set of decisions for you: where water will run, where the wind comes from, which edge faces the road. Good design starts by noticing them." },
      { h: "Where does water go?", p: "Walk the plot after rain. Low corners, drainage ditches and soft ground decide where buildings can sit and where landscape should." },
      { h: "Where does the sun travel?", p: "Orientation shapes shade, heat and the way rooms feel in the morning and evening. Map it before you map the rooms." },
      { h: "How will people arrive?", p: "The approach — by car, by foot, by bicycle — shapes the entrance and the first impression." },
      { h: "What is next door?", p: "Neighbouring buildings and trees set heights, privacy and views. Design with them, not against them." },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const journalCategories = ["Architecture", "Interior", "Construction"] as const;
