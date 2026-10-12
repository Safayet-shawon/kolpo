import type { Category } from "./projects";

export type Service = {
  id: Category;
  route: string;
  title: string;
  short: string;
  blurb: string;
  image: { key: string; alt: string; position?: string };
  intro: { heading: string; body: string[] };
  capabilities: { title: string; body: string }[];
  process: { title: string; body: string }[];
  support: { key: string; alt: string; caption: string };
  related: Category[];
};

export const services: Record<Category, Service> = {
  architecture: {
    id: "architecture",
    route: "/architecture",
    title: "Architecture & Community Design",
    short: "Architecture",
    blurb: "Masterplans and buildings designed together, so streets, landscape and homes work as one community.",
    image: { key: "arch-colony-aerial", alt: "Aerial view of a planned residential colony around a central park and pond" },
    intro: {
      heading: "Think of the whole place before the first plot is drawn.",
      body: [
        "A colony is more than a set of buildings. It is roads, water, planting, shade and the distances people walk every day. We design those relationships first, then fit homes into them.",
        "From a blank site we work through boundaries, circulation, plots and massing, and test the result in realistic visualisation so decisions are made by looking, not guessing.",
      ],
    },
    capabilities: [
      { title: "Masterplanning & colony design", body: "Site analysis, layout of roads and plots, shared landscape and community facilities." },
      { title: "Architectural design & visualisation", body: "Concept to design development, with photorealistic visualisation to review massing, materials and light." },
      { title: "Residential & commercial design", body: "Homes, apartment buildings and small commercial buildings designed to suit their climate and neighbours." },
      { title: "Planning & site development", body: "Preparing sites and documentation so approvals and construction can proceed cleanly." },
    ],
    process: [
      { title: "Read the site", body: "Boundaries, levels, water, access and what surrounds the land." },
      { title: "Draw the structure", body: "Primary roads, plots and open space set before any building is shaped." },
      { title: "Shape the buildings", body: "Massing, orientation and materials developed with the landscape." },
      { title: "Visualise & refine", body: "Realistic views reviewed with you, then refined into design development." },
    ],
    support: { key: "arch-street", alt: "Street-level view of a tree-lined street in a planned colony", caption: "A planned street seen at eye level. Concept visualisation." },
    related: ["interior", "construction"],
  },
  interior: {
    id: "interior",
    route: "/interior-design",
    title: "Interior Design",
    short: "Interior",
    blurb: "Rooms planned around light, material and the way you live, from first layout to final styling.",
    image: { key: "interior-3-final", alt: "Furnished living room with oak floor, oatmeal sofa and brass pendants beside a glass wall" },
    intro: {
      heading: "An empty room is only a plan until light, material and furniture arrive.",
      body: [
        "We begin with the shell you have — its daylight, proportions and views — and build a calm, layered interior around it: surfaces you want to touch, light that changes through the day, furniture sized for the room.",
        "Every scheme is presented through realistic visualisation so you can judge materials and mood before anything is ordered.",
      ],
    },
    capabilities: [
      { title: "Residential interiors", body: "Whole-home schemes: living, dining, kitchens, bedrooms and bathrooms." },
      { title: "Space planning", body: "Layouts that make the best use of daylight, circulation and furniture." },
      { title: "Material & finish selection", body: "Timber, stone, plaster, textiles and metals chosen to age well together." },
      { title: "Lighting design", body: "Layered ambient, task and accent lighting planned with the architecture." },
      { title: "Joinery & furniture", body: "Built-in joinery and bespoke pieces designed to the room." },
      { title: "Commercial interiors", body: "Reception, studio and workplace interiors with the same material care." },
    ],
    process: [
      { title: "Brief & survey", body: "How you live or work, and what the existing space offers." },
      { title: "Concept & materials", body: "A mood and a palette, tested against real samples and daylight." },
      { title: "Detail & visualise", body: "Joinery, lighting and furniture drawn up and visualised." },
      { title: "Deliver & style", body: "Coordinated installation and final styling." },
    ],
    support: { key: "materials", alt: "Flat-lay of oak, travertine, brass, limewash, linen and terracotta material samples", caption: "A material palette on a limestone slab. Concept styling." },
    related: ["architecture", "construction"],
  },
  construction: {
    id: "construction",
    route: "/construction",
    title: "Construction",
    short: "Construction",
    blurb: "Careful delivery from groundwork to handover, with clear stages, safe sites and documented progress.",
    image: { key: "cons-6-front", position: "55% 70%", alt: "Finished limestone-coloured house with round columns and a stepped path" },
    intro: {
      heading: "Good design only counts once it is built well.",
      body: [
        "Construction is where plans meet weather, materials and people. We organise it as a sequence clients can follow — site, groundwork, structure, envelope, finishes — so you always know where your building is and what comes next.",
        "Site coordination, quality checks and safety are planned from the start, not added at the end.",
      ],
    },
    capabilities: [
      { title: "Construction execution", body: "Groundwork, structure, envelope and finishes delivered in a clear sequence." },
      { title: "Project management & coordination", body: "One point of contact coordinating trades, deliveries and inspections." },
      { title: "Quality assurance", body: "Checks at each stage, from reinforcement to final finishes." },
      { title: "Safety", body: "Site planning, hoarding, method statements and briefings for every crew." },
      { title: "Materials & workmanship", body: "Materials specified for durability, and workmanship checked against the drawings." },
      { title: "Progress documentation", body: "Regular photographic records so every stage is visible to you." },
    ],
    process: [
      { title: "Site & plan", body: "Access, hoarding, logistics and sequence agreed before work begins." },
      { title: "Groundwork & structure", body: "Excavation, foundations and frame built and inspected stage by stage." },
      { title: "Envelope", body: "Walls, windows and roof closed in; scaffolding comes down in one clear step." },
      { title: "Finish & hand over", body: "Landscaping, snagging and a documented handover." },
    ],
    support: { key: "cons-3-structure", alt: "Reinforced concrete frame under construction with a tower crane", caption: "Structure stage on a concept sequence. AI-generated concept frame." },
    related: ["architecture", "interior"],
  },
};

export const approach = [
  { title: "Discover", body: "We listen first: your site, your timeline, how you want to live or work." },
  { title: "Plan", body: "Constraints and opportunities mapped into a clear brief and sequence." },
  { title: "Design", body: "Architecture and interiors developed together, visualised before they are built." },
  { title: "Coordinate", body: "Drawings, materials and trades aligned so nothing is decided on site by accident." },
  { title: "Build", body: "Staged construction with checks, safety planning and visible progress." },
  { title: "Deliver", body: "A documented handover and a building that works as drawn." },
];
