// The floating tiles' spots, sizes, depths, tilts and casts (FloatingBadges.tsx), and the picture files:
// each tile in three sizes (768px, and 512 / 384 scaled down ahead with a high-quality filter) with the
// width it shows at by breakpoint (its classes: half on phones, 65% on tablets, 80% on laptops), so the
// browser takes the one nearest the tile's size on that screen. Shrunk a lot on the fly (a 768px picture
// shown 100 to 250px wide, tilted, moving), the picture went soft on phones and could shimmer at its edges.
export type Badge = {
  cast: string[];
  x: string;
  y: string;
  mx: string; // below 1600px the line reaches the middle tiles: three tiles above it, three below
  my: string; // (phones) off the line's own top or bottom (--line-h, set by ScrubLine.tsx), about half a
  // badge and a gap, so the rows keep clear of the words however many lines they wrap to and however tall
  // the screen; a share of the height closed in on them on short or narrow phones
  ty: string; // (tablets and laptops)
  size: number;
  depth: number;
  tilt: number;
  delay: number;
};

export const BADGES: Badge[] = [
  {
    cast: [
      "03-braids",
      "02-pink-buns",
      "21-purple-braids-fighter",
      "16-top-knot",
    ],
    x: "15%",
    y: "27%",
    mx: "17%",
    my: "calc(50% - var(--line-h, 200px) / 2 - 74px)",
    ty: "24%",
    size: 242,
    depth: 1.4,
    tilt: -6,
    delay: 0,
  },
  {
    cast: [
      "18-afro-esports",
      "01-snapback",
      "23-mohawk-speedrunner",
      "20-turban-simracer",
    ],
    x: "82%",
    y: "25%",
    mx: "83%",
    my: "calc(50% - var(--line-h, 200px) / 2 - 71px)",
    ty: "23%",
    size: 216,
    depth: 0.8,
    tilt: 5,
    delay: 1.2,
  },
  {
    cast: [
      "19-ginger-streamer",
      "11-blue-hair",
      "07-curls-glasses",
      "28-pixie-cozy",
    ],
    x: "10%",
    y: "56%",
    mx: "50%",
    my: "calc(50% - var(--line-h, 200px) / 2 - 102px)",
    ty: "22%",
    size: 198,
    depth: 0.6,
    tilt: 4,
    delay: 2.1,
  },
  {
    cast: [
      "24-pink-hair-rhythm",
      "04-silver-shades",
      "29-longhair-retro",
      "08-bucket-hat",
    ],
    x: "88%",
    y: "53%",
    mx: "50%",
    my: "calc(50% + var(--line-h, 200px) / 2 + 122px)",
    ty: "78%",
    size: 255,
    depth: 1.6,
    tilt: -4,
    delay: 0.6,
  },
  {
    cast: [
      "14-silver-bob-cat-ears",
      "05-ponytail-headset",
      "25-braid-strategist",
      "17-platinum-crop",
    ],
    x: "20%",
    y: "77%",
    mx: "17%",
    my: "calc(50% + var(--line-h, 200px) / 2 + 71px)",
    ty: "76%",
    size: 207,
    depth: 1,
    tilt: 6,
    delay: 1.7,
  },
  {
    cast: [
      "10-cap-cheer",
      "09-beanie-wink",
      "13-hijab-headset",
      "30-holo-cosplay",
    ],
    x: "77%",
    y: "79%",
    mx: "83%",
    my: "calc(50% + var(--line-h, 200px) / 2 + 73px)",
    ty: "77%",
    size: 224,
    depth: 1.2,
    tilt: -5,
    delay: 0.3,
  },
];

// bump when the tile renders change, so browsers fetch the new ones instead of their cached copies
const TILES_V = 6;
export const src = (name: string, w = 768) =>
  `/tiles/float/${w === 768 ? "" : `${w}/`}${name}.webp?v=${TILES_V}`;
export const srcSet = (name: string) =>
  [384, 512, 768].map((w) => `${src(name, w)} ${w}w`).join(", ");
export const sizesOf = (s: number) =>
  `(max-width: 767px) ${s * 0.5}px, (max-width: 1279px) ${s * 0.65}px, (max-width: 1599px) ${s * 0.8}px, ${s}px`;
