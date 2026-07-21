// ALTA ZERO — central site content
// One source for collections, size guide, footer, editorial bands, and long-form pages.
// Voice: warm, considered, confident, understated, a little witty.
// House rule: no em dashes, no en dashes anywhere. Commas and periods only.

// ---------------------------------------------------------------------------
// 1. COLLECTIONS
// Eight collections. Six shop by category, two are curated edits.
// Each collection lists its member archive numbers so a collection page can
// filter the full 114 piece archive down to its pieces. Category runs also
// carry a `range` for convenience. `filterKey` groups the shop-by-category
// six against a piece's category field.
// ---------------------------------------------------------------------------

const COLLECTIONS = [
  {
    slug: "the-tees",
    name: "The Tees",
    tagline: "The blank done right, soft where it counts, honest at the neck.",
    intro:
      "The foundation of the whole archive, twenty five blanks in cotton, waffle, and washed finishes, sorted by weight so you can find your exact hand. Start here, then build out one piece at a time.",
    filterKey: "Tee",
    range: [1, 25],
    memberArchiveNumbers: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25,
    ],
  },
  {
    slug: "the-long-sleeves",
    name: "The Long Sleeves",
    tagline: "The in between layer, made to stand alone or slide under a shell.",
    intro:
      "Ten long sleeves built for the months that cannot decide, full enough to wear on their own when the light drops. The easy answer between summer and the cold.",
    filterKey: "Long Sleeve",
    range: [26, 35],
    memberArchiveNumbers: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
  },
  {
    slug: "the-heavyweights",
    name: "The Heavyweights",
    tagline: "More cloth, more weight, the pieces that outlive the season.",
    intro:
      "Crews and hoodies, the dense fleece core of the archive, from an easy 280gsm pullover to the monumental 530gsm hood. The pieces you reach past everything else for.",
    filterKey: "Heavyweight",
    range: [45, 63],
    memberArchiveNumbers: [
      45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
    ],
  },
  {
    slug: "the-trousers",
    name: "The Trousers",
    tagline: "Quiet from the waist down, built to move and to last.",
    intro:
      "Pants and sweatpants, twenty one bottoms from tapered fleece joggers to heavyweight wide leg cotton. The other half of the uniform.",
    filterKey: "Trouser",
    range: [64, 84],
    memberArchiveNumbers: [
      64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
      83, 84,
    ],
  },
  {
    slug: "the-shorts",
    name: "The Shorts",
    tagline: "The deepest run in the archive, broken in and warm weather ready.",
    intro:
      "Twenty five warm weather blanks in washed cotton, waffle, fleece, and mesh. Sits clean, wears soft, and outlasts the thin ones every time.",
    filterKey: "Short",
    range: [85, 109],
    memberArchiveNumbers: [
      85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102,
      103, 104, 105, 106, 107, 108, 109,
    ],
  },
  {
    slug: "the-layers",
    name: "The Layers",
    tagline: "For the cold ground and the long descent, warmth without the shout.",
    intro:
      "Everything with a collar or a zip, polos, camp shirts, denim and track jackets, the mesh vest, and the muscle tank. The finishing pieces that close an outfit.",
    filterKey: "Layer",
    // Two runs: 036 to 044 and 110 to 114.
    memberArchiveNumbers: [36, 37, 38, 39, 40, 41, 42, 43, 44, 110, 111, 112, 113, 114],
  },
  {
    slug: "the-essentials-ten",
    name: "The Essentials Ten",
    tagline: "The short list. The pieces you would rebuy the day they wore out.",
    intro:
      "If you buy nothing else, buy from here, ten blanks that cover a full week without thinking about it, one from each corner of the archive. The Snow Washed Oversized Tee, the Sueded Cotton Tee, the Heavyweight Boxy Tee, the Heavyweight Long Sleeve, the Heavyweight Crewneck, the Heavyweight Hoodie, the Heavyweight Fleece Joggers, the Straight Leg Sweatpant, the Wide Leg Panel Pant, and the Heavyweight Fleece Short.",
    filterKey: "Edit",
    memberArchiveNumbers: [1, 15, 20, 35, 48, 54, 64, 65, 80, 92],
  },
  {
    slug: "sun-faded",
    name: "Sun Faded",
    tagline: "Washed and mineral finished, no two land exactly alike.",
    intro:
      "A warm weather capsule of washed and mineral finished pieces, broken in before it reaches you. Every piece carries its own tone, so the one you get is only yours.",
    filterKey: "Edit",
    memberArchiveNumbers: [1, 14, 16, 18, 26, 46, 56, 82, 89, 94, 97, 103],
  },
];

// ---------------------------------------------------------------------------
// 2. SIZE GUIDE
// Chest and length in inches, laid flat. Fits the heavyweight core cleanly and
// runs close enough across the archive to guide any piece.
// ---------------------------------------------------------------------------

const SIZEGUIDE = {
  units: "inches",
  measure: "Laid flat. Chest measured pit to pit, doubled. Length measured high point of shoulder to hem.",
  columns: ["Size", "Chest", "Length"],
  rows: [
    { size: "S", chest: 20, length: 27 },
    { size: "M", chest: 21.5, length: 28 },
    { size: "L", chest: 23, length: 29 },
    { size: "XL", chest: 24.5, length: 30 },
    { size: "2XL", chest: 26, length: 31 },
  ],
  fitNote:
    "True to size with a clean, considered cut, not boxy and not skin tight. If you like a little more room, size up one. Every product page carries the exact measurements for that piece, and the neck tag confirms your size once it arrives.",
};

// ---------------------------------------------------------------------------
// 3. FOOTER
// Columns of links plus a newsletter line.
// ---------------------------------------------------------------------------

const FOOTER = {
  columns: [
    {
      heading: "Shop",
      links: [
        { label: "The Tees", href: "/collections/the-tees" },
        { label: "The Long Sleeves", href: "/collections/the-long-sleeves" },
        { label: "The Heavyweights", href: "/collections/the-heavyweights" },
        { label: "The Trousers", href: "/collections/the-trousers" },
        { label: "The Shorts", href: "/collections/the-shorts" },
        { label: "The Layers", href: "/collections/the-layers" },
      ],
    },
    {
      heading: "Edits",
      links: [
        { label: "The Essentials Ten", href: "/collections/the-essentials-ten" },
        { label: "Sun Faded", href: "/collections/sun-faded" },
        { label: "The Full Archive", href: "/collections/archive" },
      ],
    },
    {
      heading: "The House",
      links: [
        { label: "The House", href: "/pages/the-house" },
        { label: "The Tags", href: "/pages/the-tags" },
        { label: "Lookbook", href: "/pages/lookbook" },
        { label: "FAQ", href: "/pages/faq" },
      ],
    },
    {
      heading: "Care",
      links: [
        { label: "Size Guide", href: "/pages/size-guide" },
        { label: "Shipping", href: "/pages/faq#shipping" },
        { label: "Returns", href: "/pages/faq#returns" },
        { label: "Contact", href: "/pages/contact" },
      ],
    },
  ],
  newsletter: {
    heading: "Go the other way with us.",
    line: "Hear about new pieces from the archive first, before they go wide. Start from zero, go higher.",
    placeholder: "Your email",
    button: "Join",
  },
  wordmarkLine: "A House Of Blanks. The Mark Is On The Tag.",
  location: "Salt Lake City",
  legal: "Alta Zero. Start From Zero. Go Higher.",
};

// ---------------------------------------------------------------------------
// 4. SPOKEN
// Three hero text-tee blurbs for a home editorial band.
// Short, quotable, worn like a line on the chest we chose not to print.
// ---------------------------------------------------------------------------

const SPOKEN = [
  {
    line: "The colony went to the sea. We went to the mountains.",
    sub: "One penguin looked the other way, toward the high cold ground nobody walks to, and it went. That is the one we build for.",
  },
  {
    line: "Zero is not empty. It is the base of the climb.",
    sub: "Beginning again on purpose. The reset you choose beats the one you are handed.",
  },
  {
    line: "Quiet on the outside. Everything on the inside.",
    sub: "No logo doing the talking, just the cut, the cloth, and the care at your neck. The mark is on the tag.",
  },
];

// ---------------------------------------------------------------------------
// 5. LOOKBOOK
// Four short captioned editorial slides.
// ---------------------------------------------------------------------------

const LOOKBOOK = [
  {
    slide: 1,
    title: "Ground Zero",
    caption:
      "The clean morning before the noise. A bone tee, heavy in the hand, and nothing to prove.",
  },
  {
    slide: 2,
    title: "The Other Way",
    caption:
      "While the colony turned for the sea, one walked toward the mountains. Layers for the cold ground and the long climb.",
  },
  {
    slide: 3,
    title: "The Weight",
    caption:
      "Dense fleece that stands almost on its own. You feel what you are wearing the second it goes on.",
  },
  {
    slide: 4,
    title: "The Summit",
    caption:
      "High point and fresh start in the same breath. Read the tag, and you get the truth of the piece.",
  },
];

// ---------------------------------------------------------------------------
// 6. HOME HERO
// The top of the page, pulled from the site copy so it lives in one place.
// ---------------------------------------------------------------------------

const HOME = {
  eyebrow: "A TEXTILE HOUSE. EST. AT GROUND ZERO.",
  headline: "Start From Zero. Go Higher.",
  subcopy: "Beautiful blanks, quietly made. The whole story lives on the tag.",
  wordmarkLabel: "A House Of Blanks. The Mark Is On The Tag.",
  tagline: "Start From Zero. Go Higher.",
};

// ---------------------------------------------------------------------------
// 7. ABOUT — The House
// ---------------------------------------------------------------------------

const ABOUT = {
  slug: "the-house",
  title: "The House",
  paragraphs: [
    "We are a house of blanks, and that is the point. Every piece we make is beautiful, heavy in the hand, cut clean, and left nearly unmarked. We do not shout across the chest. We spend the noise you would have worn out loud on the things you feel instead. The weight of the cotton. The fall of the shoulder. The one tag at your neck that tells you where it came from and why it exists. The garment stays quiet so you can be the loud part.",
    "Our whole story sits in one small animal. Picture a colony of penguins, all of them turning together toward the sea, because that is what the colony does. One of them stops. It looks the other way, toward the mountains, toward the high cold ground nobody walks to, and it goes. That is the one we build for. Not the loudest, not the rebel for the sake of it, just the one who quietly decided the summit was more interesting than the crowd. We named the feeling Alta Zero. The high point, and the fresh start, in the same breath.",
    "Alta Zero stands for beginning again on purpose. Zero is not empty, it is the base of the climb, the reset you choose, the clean morning before the noise. We put that idea into clothing you can actually live in, wear thin, and reach for on the days that matter. Start from zero. Go higher. We mean it as a way to get dressed and a way to move through the year.",
  ],
};

// ---------------------------------------------------------------------------
// 8. TAGS — The Tags (manifesto)
// ---------------------------------------------------------------------------

const TAGS = {
  slug: "the-tags",
  title: "The Tags",
  paragraphs: [
    "Most brands live on the outside of the shirt. We moved the whole brand to the inside, to a woven neck label and a hangtag you have to hold to read. That is not modesty for its own sake. It is a bet. A blank only earns the word premium when the maker had nothing to hide behind, no logo doing the talking, just the cut, the cloth, and the care. So we put the care where you find it in private. The tag is the handshake. Everything else is the garment doing its job.",
    "Read the tag and you get the truth of the piece. Where it sits in the archive. What it is made of. How to keep it alive. One line of why we made it at all. Nobody on the street needs that information. You do. That is the point of a house of blanks. The label is not the afterthought at the back of the neck, it is the front door.",
  ],
  neckLabel: {
    lines: ["ALTA", "ZERO", "No. 004 / 114", "SALT LAKE CITY"],
    ethos: "The one who went the other way.",
  },
  hangtag: {
    front: ["ALTA ZERO", "No. 004 / 114", "Start From Zero. Go Higher."],
    back: [
      "THE HEAVYWEIGHT TEE",
      "100% Combed Cotton, 240 GSM",
      "Cut and finished quiet, on purpose.",
      "CARE",
      "Wash cold, inside out. Tumble low or hang dry.",
      "No bleach. Iron cool if you must.",
      "MADE FOR",
      "Salt Lake City, and the ones who go the other way.",
      "The mark is on the tag. That was the whole idea.",
    ],
  },
};

// ---------------------------------------------------------------------------
// 9. FAQ
// ---------------------------------------------------------------------------

const FAQ = [
  {
    q: "How does shipping work, and how long until my piece arrives?",
    a: "Every Alta Zero piece is made to order, so nothing sits in a warehouse waiting. Give it about 5 to 8 business days to be made, then standard shipping on top. You get a tracking link the moment it leaves us.",
  },
  {
    q: "How do the pieces fit?",
    a: "True to size with a clean, considered cut, not boxy and not skin tight. If you like a little more room, size up one. Every product page carries the exact measurements, and the neck tag confirms your size once it arrives.",
  },
  {
    q: "What are they made of?",
    a: "Heavy, honest cloth and nothing cheap. Combed cotton in the tees, higher GSM in the heavyweights, real weight you feel the second you pick it up. The exact fiber and weight live on the hangtag and the product page.",
  },
  {
    q: "What is your return policy?",
    a: "Since each piece is made to order, we look at returns case by case. If it arrives flawed or the size is wrong, we make it right, fast. Reach out within 14 days and we will take care of you.",
  },
  {
    q: "What is the No. 004 / 114 number on the tag?",
    a: "The archive is finite. There are 114 pieces in the house, and each one holds its own number. Yours is not a serial code, it is a place in a collection. When a piece retires, its number retires with it.",
  },
  {
    q: "Why sell blanks instead of graphics?",
    a: "Because a blank has nowhere to hide. No logo doing the work, just the cut, the cloth, and the care at your neck. We think the best thing you can wear is a garment that lets you be the loud part. The mark is on the tag. That was the whole idea.",
  },
];

// ---------------------------------------------------------------------------
// 10. ETHOS LINES
// Ten short marketing lines, reusable across bands, emails, and product pages.
// ---------------------------------------------------------------------------

const ETHOS_LINES = [
  "Start from zero. Go higher.",
  "The mark is on the tag. That was always the plan.",
  "A house of blanks, and the blanks say plenty.",
  "The colony went to the sea. We went to the mountains.",
  "Zero is not empty. It is the base of the climb.",
  "Wear the garment. Skip the billboard.",
  "Quiet on the outside. Everything on the inside.",
  "Go the other way. It is less crowded up here.",
  "The reset you choose beats the one you are handed.",
  "No logo doing the talking. Just the cut, the cloth, the care.",
];

const SITE = {
  COLLECTIONS,
  SIZEGUIDE,
  FOOTER,
  SPOKEN,
  LOOKBOOK,
  HOME,
  ABOUT,
  TAGS,
  FAQ,
  ETHOS_LINES,
};
