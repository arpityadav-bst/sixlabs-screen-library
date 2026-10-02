// The closing section as the page lays it out: inside the page's side gutter, on the grain ground, with
// ClickLock mounted as the page mounts it. The guide frames it at true widths to measure the container,
// both gutters, the measure and the type steps. The gutter is read from the layout tokens, which mirror
// main's padding in app/website/page.tsx. The closing sits deep in the page's grained block, so its grain
// starts past its fade (GrainLead).
import { ClickLock } from "@/components/website/ClickLock";
import { Closing } from "@/components/website/Closing";
import s from "./layout-closing.module.css";
import { GrainLead } from "./page-column";

export function LayoutClosing() {
  return (
    <GrainLead>
      <div className={s["ds-frame-gutter"]} data-ds-gutter="">
        <ClickLock />
        <Closing />
      </div>
    </GrainLead>
  );
}
