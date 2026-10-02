// A bare page per part, for the guide's iframes: no guide chrome, the real fonts from the root layout,
// the site's globals untouched. Inside a frame the viewport, window scroll and window events are the
// frame's own, which is why shell parts render honestly there.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TokenStyle } from "@/components/design-system/TokenStyle";
import "../_kit/ds.css";

export const metadata: Metadata = {
  title: "6labs design system frame",
  robots: { index: false, follow: false },
};

export default function FrameLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TokenStyle />
      {children}
    </>
  );
}
