// /design-system: the guide's chrome around the one long page. A route group, so the URL stays
// /design-system while frame/ keeps its own bare layout. The root layout's fonts and globals apply as
// they do on the site, and the guide's own CSS is ds- prefixed so it restyles nothing there.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TokenStyle } from "@/components/design-system/TokenStyle";
import { GuideShell } from "../_kit/GuideShell";
import "../_kit/ds.css";
import "../_kit/ds-shell.css";
import "../_kit/ds-spec.css";
import "../_kit/ds-measure.css";
import "../_kit/ds-chart.css";

export const metadata: Metadata = {
  title: "6labs design system",
  description: "Every token, part and pattern of the 6labs site, rendered from its own components.",
};

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TokenStyle />
      <GuideShell>{children}</GuideShell>
    </>
  );
}
