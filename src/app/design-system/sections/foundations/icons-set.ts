// The icons the client specimens draw: the ladder's sizes and set, and the IconButton pairs. Kept apart
// from icons-data.ts, which reads file:lines at build, so the client leaves never pull a server reader.
import { ArrowUp, Check, Globe, Menu, ShieldCheck, Waves, type LucideIcon } from "lucide-react";
import type { IconSize } from "@/components/design-system/tokens";

export const LADDER_SIZES: readonly IconSize[] = [12, 14, 16, 18, 20, 24];

/** The six icons every ladder column draws: the site's own glyphs, wave to shield. */
export const LADDER_SET: readonly { name: string; icon: LucideIcon }[] = [
  { name: "Waves", icon: Waves },
  { name: "ArrowUp", icon: ArrowUp },
  { name: "Globe", icon: Globe },
  { name: "Check", icon: Check },
  { name: "Menu", icon: Menu },
  { name: "ShieldCheck", icon: ShieldCheck },
];

/** Icon inside an IconButton: 18 in the 40 and 44 boxes, 20 in the 48. The menu sits at md, the 40 box
 *  the site's menu button ships in (MobileMenu.tsx), and Back to top at lg, the floating button's 44. */
export const BUTTON_PAIRS = [
  { size: "md", box: 40, icon: Menu, label: "Open menu" },
  { size: "lg", box: 44, icon: ArrowUp, label: "Back to top" },
  { size: "xl", box: 48, icon: Globe, label: "Language" },
] as const;
