// SHARED PROJECT SOURCE — every list, filter, card, service page and detail page reads from here.
//
// IMPORTANT: every entry below is DEMONSTRATION CONTENT (`demo: true`). The imagery is AI-generated
// concept visualisation and the places are illustrative. None of these are completed KOLPO projects.
// The UI labels them as concept visualisations. Replace with real projects (set demo: false) as they
// are confirmed; see README → "Replacing demo content".

export type Category = "architecture" | "interior" | "construction";

export type ProjectImage = { key: string; alt: string; caption?: string };

export type Project = {
  slug: string;
  title: string;
  category: Category;
  /** Secondary disciplines involved, used for "related" logic. */
  also?: Category[];
  type: string;
  location: { city: string; area?: string; region: string; lat: number; lng: number };
  status: "Concept visualisation" | "In progress" | "Completed";
  /** Only set when verified. */
  year?: number;
  summary: string;
  description: string[];
  intent: string;
  challenges: { challenge: string; response: string }[];
  facts?: { label: string; value: string }[];
  hero: ProjectImage & { position?: string };
  gallery: ProjectImage[];
  /** Layout hint for the editorial grid. */
  shape: "wide" | "tall" | "square";
  demo: boolean;
  /** Optional empty → finished pair for the before/after control. */
  beforeAfter?: { before: string; after: string; alt: string };
};

export const categoryMeta: Record<Category, { label: string; route: string; short: string }> = {
  architecture: { label: "Architecture & Community", route: "/architecture", short: "Architecture" },
  interior: { label: "Interior Design", route: "/interior-design", short: "Interior" },
  construction: { label: "Construction", route: "/construction", short: "Construction" },
};

export const projects: Project[] = [
  {
    slug: "meadow-court-community",
    title: "Meadow Court Community",
    category: "architecture",
    also: ["construction"],
    type: "Residential masterplan",
    location: { city: "Gazipur", area: "Outskirts of Dhaka", region: "Dhaka Division", lat: 24.0023, lng: 90.4266 },
    status: "Concept visualisation",
    summary: "A walkable residential colony organised around a shared park and pond, with every street ending in green.",
    description: [
      "Meadow Court explores how a colony of around seventy homes can feel like one place rather than a repeated plot. Streets curve gently to slow traffic, plots are sized to give every home a garden edge, and the central park is reachable on foot from any front door.",
      "The visualisation shows the full masterplan in one frame — roads, plots, building massing, planting and water — so that the relationships between them can be judged together.",
    ],
    intent: "Make the community, not the individual plot, the unit of design: shared landscape first, then streets, then homes.",
    challenges: [
      { challenge: "Dense plots can leave no room for shared landscape.", response: "The park and pond sit at the centre of the plan so open space is planned before plots are cut." },
      { challenge: "Long straight streets encourage speed and monotony.", response: "Curved, tree-lined streets with changing views keep traffic slow and every house distinct." },
    ],
    facts: [{ label: "Format", value: "Concept visualisation" }, { label: "Scope shown", value: "Masterplan, massing, landscape" }],
    hero: { key: "arch-colony-aerial", alt: "Aerial view of a planned residential colony of white and limestone houses around a central park and pond at sunrise" },
    gallery: [
      { key: "arch-street", alt: "Street-level view along a tree-lined street in the same colony, with the park visible at the end", caption: "Street level, same colony" },
    ],
    shape: "wide",
    demo: true,
  },
  {
    slug: "courtyard-villa",
    title: "Courtyard Villa",
    category: "architecture",
    also: ["interior"],
    type: "Private residence",
    location: { city: "Chattogram", region: "Chattogram Division", lat: 22.3569, lng: 91.7832 },
    status: "Concept visualisation",
    summary: "A single-storey family home wrapped around a reflecting pool, in board-formed concrete and warm timber.",
    description: [
      "The villa turns inward: living spaces open onto a long shallow pool that cools the air and doubles the sky. Concrete gives mass and shade; timber brings warmth at touch height.",
      "A deep roof overhang keeps glazing in shade through the hottest hours while framing the garden from inside.",
    ],
    intent: "Let water, shade and daylight do the work that mechanical systems would otherwise do.",
    challenges: [
      { challenge: "Large glazing invites heat gain.", response: "A deep overhang and a reflecting pool temper light before it reaches the glass." },
    ],
    facts: [{ label: "Format", value: "Concept visualisation" }],
    hero: { key: "exterior-villa", alt: "Courtyard villa at dusk with a reflecting pool, concrete walls, timber cladding and glowing windows" },
    gallery: [],
    shape: "tall",
    demo: true,
  },
  {
    slug: "sunlit-residence",
    title: "Sunlit Residence",
    category: "interior",
    also: ["architecture"],
    type: "Apartment interior",
    location: { city: "Dhaka", region: "Dhaka Division", lat: 23.8103, lng: 90.4125 },
    status: "Concept visualisation",
    summary: "From an empty concrete shell to a warm, layered living room built around oak, limewash and brass.",
    description: [
      "The brief: an apartment with a fine view and no character. The scheme starts with the floor — wide oak herringbone — and lets limewash walls soften the daylight. Furniture is low and generous so the glazed wall stays the focus.",
      "Brass is used sparingly, at the pendants and the floor lamp, to catch light without competing with the planting outside.",
    ],
    intent: "Keep the view the hero; make everything inside feel quiet, tactile and unhurried.",
    challenges: [
      { challenge: "A raw shell gives sound and light nothing to soften them.", response: "Limewash plaster, a wool rug and floor-to-ceiling linen absorb sound and diffuse glare." },
      { challenge: "A deep room can feel dark away from the windows.", response: "A layered lighting plan — pendants, a floor lamp and recessed downlights — fills the back of the room." },
    ],
    facts: [{ label: "Format", value: "Concept visualisation" }, { label: "Key materials", value: "Oak, limewash, travertine, brass, linen" }],
    hero: { key: "interior-3-final", alt: "Furnished living room with oak herringbone floor, oatmeal sofa, travertine coffee table and brass pendant lights beside a glass wall" },
    gallery: [
      { key: "interior-2-lit", alt: "The same room before furnishing, with brass pendants installed", caption: "Fit-out stage" },
      { key: "interior-1-empty", alt: "The empty room before interior works, with raw floor and white walls", caption: "Before" },
    ],
    beforeAfter: { before: "interior-1-empty", after: "interior-3-final", alt: "Living room before and after interior design" },
    shape: "wide",
    demo: true,
  },
  {
    slug: "walnut-and-stone-kitchen",
    title: "Walnut & Stone Kitchen",
    category: "interior",
    type: "Kitchen & dining",
    location: { city: "Sylhet", region: "Sylhet Division", lat: 24.8949, lng: 91.8687 },
    status: "Concept visualisation",
    summary: "Oak joinery, a veined stone splashback and one long table turn the kitchen into the heart of the home.",
    description: [
      "Joinery runs floor to ceiling to hide storage and keep the room calm. Under-cabinet light grazes the stone so its veining reads as a feature, and a long solid-timber table invites people to stay.",
    ],
    intent: "Treat the kitchen as furniture: warm timber, honest stone and a table that is meant to be used.",
    challenges: [
      { challenge: "Tall storage can overwhelm a room.", response: "A single timber species and flush handles keep the wall quiet and architectural." },
    ],
    facts: [{ label: "Format", value: "Concept visualisation" }],
    hero: { key: "interior-kitchen", alt: "Oak kitchen with marble splashback, brass tap and a long walnut dining table beside a large window" },
    gallery: [],
    shape: "square",
    demo: true,
  },
  {
    slug: "stone-bathroom-suite",
    title: "Stone Bathroom Suite",
    category: "interior",
    type: "Bathroom",
    location: { city: "Rajshahi", region: "Rajshahi Division", lat: 24.3745, lng: 88.6042 },
    status: "Concept visualisation",
    summary: "A carved stone bath, veined slabs and backlit mirrors create a calm, spa-like retreat.",
    description: [
      "Large-format stone slabs minimise joints so the room reads as a single material. Brass fittings and soft backlighting add warmth to the cool palette, and a sheer curtain filters the window light.",
    ],
    intent: "Reduce the number of materials and joints so the room feels monolithic and still.",
    challenges: [
      { challenge: "Cool stone can feel clinical.", response: "Walnut joinery, brass and warm backlighting offset the grey." },
    ],
    facts: [{ label: "Format", value: "Concept visualisation" }],
    hero: { key: "interior-bathroom", alt: "Bathroom with a freestanding stone bath, veined grey marble walls and a floating walnut vanity with backlit mirrors" },
    gallery: [{ key: "interior-bedroom", alt: "Calm bedroom with oatmeal upholstered bed, walnut bedside tables, brass lamps and herringbone floor", caption: "Companion bedroom scheme" }],
    shape: "tall",
    demo: true,
  },
  {
    slug: "studio-reception",
    title: "Studio Reception",
    category: "interior",
    also: ["construction"],
    type: "Commercial interior",
    location: { city: "Khulna", region: "Khulna Division", lat: 22.8456, lng: 89.5403 },
    status: "Concept visualisation",
    summary: "A welcoming reception and shared workspace in oak slats, stone and soft pendant light.",
    description: [
      "A timber slat wall gives acoustic softness and a clear sense of arrival, while a solid stone desk anchors the entry. The long shared table sits under diffuse lighting for calm, collaborative work.",
    ],
    intent: "Make a workplace feel like a home for good ideas: warm, quiet and clearly organised.",
    challenges: [
      { challenge: "Open workplaces can be loud and impersonal.", response: "Timber slats, a wool rug and fabric-shaded pendants soften sound and light." },
    ],
    facts: [{ label: "Format", value: "Concept visualisation" }],
    hero: { key: "interior-commercial", alt: "Boutique studio reception with a stone desk, oak slat wall, linen pendants and a long oak table" },
    gallery: [],
    shape: "wide",
    demo: true,
  },
  {
    slug: "corner-plot-house",
    title: "Corner Plot House",
    category: "construction",
    also: ["architecture"],
    type: "Residential new build",
    location: { city: "Cumilla", region: "Chattogram Division", lat: 23.4607, lng: 91.1809 },
    status: "Concept visualisation",
    summary: "A three-storey home followed from empty plot, through foundations and frame, to finished facade.",
    description: [
      "This concept sequence shows the stages of delivering a new house: an empty plot, groundwork and foundations, a concrete frame, an enclosed envelope behind scaffolding, and the finished building with landscaping.",
      "The stages are shown to illustrate how KOLPO describes delivery — they are AI-generated concept frames, not site photographs of a completed KOLPO project.",
    ],
    intent: "Show delivery as a sequence people can follow, so clients always know which stage their building is in.",
    challenges: [
      { challenge: "Deep excavation next to an access road needs careful control.", response: "Hoarding, a defined plant route and staged material deliveries keep the site tidy and safe." },
      { challenge: "Scaffolding hides the building for months.", response: "The envelope is sequenced so façade finishes are installed top-down and scaffolding comes off in one clear step." },
    ],
    facts: [{ label: "Format", value: "Concept visualisation" }, { label: "Stages shown", value: "Site, groundwork, frame, envelope, completion" }],
    hero: { key: "cons-6-front", position: "55% 70%", alt: "Front of a finished limestone-coloured house with round columns, green roof planting and a stepped entrance path" },
    gallery: [
      { key: "cons-1-site", alt: "Aerial view of an empty plot ready for development", caption: "01 — Site" },
      { key: "cons-2-groundwork", alt: "Excavated foundation pit with excavator, dump truck and rebar", caption: "02 — Groundwork" },
      { key: "cons-3-structure", alt: "Reinforced concrete frame with a tower crane", caption: "03 — Structure" },
      { key: "cons-4-envelope", alt: "Building enclosed behind scaffolding and green netting", caption: "04 — Envelope" },
      { key: "cons-5-complete", alt: "Finished building with landscaping and entrance path", caption: "05 — Completion" },
    ],
    shape: "wide",
    demo: true,
  },
  {
    slug: "garden-terrace-apartments",
    title: "Garden Terrace Apartments",
    category: "construction",
    also: ["architecture"],
    type: "Low-rise residential",
    location: { city: "Narayanganj", region: "Dhaka Division", lat: 23.6238, lng: 90.5 },
    status: "Concept visualisation",
    summary: "A four-storey apartment building with deep timber-louvred balconies and a landscaped forecourt.",
    description: [
      "Recessed balconies shade the glazing and give each apartment a private outdoor room. A stone base and planted terraces tie the building to its landscaped entrance.",
    ],
    intent: "Make every apartment feel like it has a garden, even four storeys up.",
    challenges: [
      { challenge: "Balconies can add cost and complexity to the structure.", response: "A repeated structural bay keeps formwork simple and quality consistent floor to floor." },
    ],
    facts: [{ label: "Format", value: "Concept visualisation" }],
    hero: { key: "exterior-lowrise", alt: "Four-storey apartment building with timber-louvred balconies, stone base and landscaped forecourt" },
    gallery: [],
    shape: "square",
    demo: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const projectsByCategory = (c: Category) => projects.filter((p) => p.category === c || p.also?.includes(c));
export const relatedProjects = (p: Project, n = 3) =>
  projects
    .filter((o) => o.slug !== p.slug)
    .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category))
    .slice(0, n);
