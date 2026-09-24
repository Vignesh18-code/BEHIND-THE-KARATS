export const SOCIAL = {
  youtube: "https://youtube.com",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
} as const;

export const HERO_STATS = [
  { value: "10+", label: "Years of Heritage" },
  { value: "100+", label: "Founders & Voices" },
  { value: "XRF Tech", label: "Gold Precision" },
  { value: "100%", label: "Unfiltered Truth" },
] as const;

export const HOST = {
  name: "Vikas Singhvi",
  role: "Founder & Host, Behind The Karats",
  credentials: "Jewellery Technologist • Director at S.R. Scales • Maxsell & A&D Precision Ambassador",
  motto: "Learn first. Lead next.",
  intro:
    "For Vikas, business never began with a title. It began with learning the work from the ground up. Before stepping into leadership, he immersed himself in the grit of retail operations, technical machinery, and the relentless discipline required to build lasting trust in the jewellery domain.",
  pullQuote:
    "Family business may give you an opportunity. Knowledge, responsibility and respect still have to be earned.",
  showNote:
    "A platform created to move beyond titles, numbers and polished success stories. To talk about the choices. The setbacks. The lessons. And the people behind the journey.",
  timelineIntro: "How an apprentice's discipline built a modern voice for the jewellery industry.",
} as const;

export const TIMELINE = [
  { year: "2014 – 2015", title: "Learning Retail, Firsthand", icon: "shop", aside: "Retail Groundwork", highlight: "Varsidhi Clothing Store",
    body: "At Varsidhi Clothing Store, Vikas learned the fundamentals of retail — customers, operations, store management and the discipline behind everyday business." },
  { year: "2015 – 2016", title: "First Salary. First Real Responsibility.", icon: "briefcase", aside: "Corporate Operations", highlight: "Brown Tree Retail Pvt. Ltd.",
    body: "At Brown Tree Retail Pvt. Ltd., he worked across marketing and backend operations, gaining his first full-time corporate experience and learning what it meant to take ownership of his work." },
  { year: "2016 – 2017", title: "Learning the Tech Behind Jewellery", icon: "atom", aside: "XRF & Precision Science", highlight: "Arihant Maxsell Technologies",
    body: "Before entering the family business, Vikas trained at Arihant Maxsell Technologies, developing a strong understanding of XRF Gold Testing Technology and the technical side of the jewellery industry. He chose to learn like an employee before stepping into ownership." },
  { year: "2017 – Now", title: "Building the Next Chapter at S.R. Scales", icon: "scale", aside: "Jewellery Tech Expansion", highlight: "S.R. Scales", current: true,
    body: "From sales and marketing to business development, customer relationships and brand building, Vikas has helped evolve S.R. Scales from a conventional weighing-solutions company into a broader jewellery technology solutions brand.",
    extra: "His journey has included growing the presence of Maxsell Gold Testing Machines and A&D Japan Precision Balances, expanding into new technology categories and building long-term relationships across the jewellery ecosystem." },
] as const;

export const JOURNEY = {
  kicker: "Evolution & Milestones",
  title: "The Ground-Up Journey",
  sub: "How an apprentice's discipline built a modern voice for the jewellery industry.",
} as const;

/**
 * The two statements that bracket the film cascade — the first as the episodes
 * rise out of the dark, the second once the last one has gone.
 */
export const CASCADE_COPY = {
  opening: [
    "Gold is measured in karats. A life's work is not.",
    "Every conversation goes past the showroom — to the risk taken, the year lost, and the call that changed everything.",
  ],
  closing: [
    "The shine is the last part of the story.",
    "We came for the rest.",
  ],
} as const;

/** Copy for the group-photo section that closes the page. */
export const GROUP_SECTION = {
  kicker: "Behind The Karats",
  title: "THE PEOPLE IN THE ROOM",
  note: "Hover a face",
  touchNote: "Swipe the line-up",
  alt: "The Behind The Karats line-up",
} as const;

export type GroupPerson = { name: string; role: string; href?: string };

/**
 * The line-up, strictly left to right as they stand in the photo. Fill a name
 * in and that person's card appears on hover; add an `href` and their silhouette
 * becomes a link to the episode. An entry left blank still waves — it just says
 * nothing about who it is.
 */
export const GROUP_PEOPLE: GroupPerson[] = [
  { name: "Mr. Agar Chand", role: "Founder, Sri Jain Jewellery Private Limited" },
  { name: "SS Alam", role: "Founder, Aurum Jewels Ltd" },
  { name: "Mr. Karthik Surabi", role: "Founder, Surabi Bullion" },
  { name: "Vikas Singhvi", role: "group.png Managing Director, SR Scales , Host - Bwhind the Karats" },
  { name: "Mr. Nithin", role: "CEO, Sukra Jewellery" },
  { name: "Mr. K. Srinivasan", role: "Founder, Emerald Jewel Industry India Limited" },
  { name: "Shri Nandakumar", role: "IRS" },
];

/**
 * The Shorts reel, in play order. Ids only: the thumbnail and the player are
 * both derived from the id, so adding one is a single line.
 */
export const SHORTS = [
  "9vDQoA7IZaI", "x3XTdOkPsc0", "ySeKQclZqmw", "z-YMGxlloUw",
  "7S6jTsV5JWE", "eHl3klFDnKc", "eOrd7959na4", "ojF0iRdHEV8",
  "G6CADBEUMZ8", "lUvotxEqw-w", "Nc2jaaqDUCI", "CDUDcUqSFTE",
  "gugKkHSeV3Y", "de-PtLgWAF0", "kfunMqkfl6E", "rWNIUssoNCU",
] as const;

export const NOMINATE_BENEFITS = [
  { title: "Unscripted Studio Experience", body: "Deep long-form audio-visual interview tailored to legacy and technical substance." },
  { title: "Multi-Platform Distribution", body: "Broadcast across YouTube, Spotify, Apple Podcasts, LinkedIn, and Instagram." },
  { title: "Direct Editorial Review", body: "Every single submission is personally reviewed by Vikas Singhvi and the creative desk." },
] as const;
