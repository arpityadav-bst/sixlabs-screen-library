// Icons: the site's icons as shipped first, then the ladder (six sizes, one stroke each), the inline and
// boxed forms, how an icon pairs with text and buttons, and two decisions. Values live in icons-data.ts.
import { ArrowUp, Check, Globe, Menu, ShieldCheck, Waves } from "lucide-react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Icon } from "@/components/design-system/Icon";
import {
  BOXED_RUNGS,
  FORM_PINS,
  FORM_VALUES,
  ICON_CODE,
  ICON_PROPS,
  LADDER_VALUES,
  PAIR_VALUES,
  SHIPPED,
  SHIPPED_VALUES,
  TEXT_PAIRS,
  TONE_VAR,
  type ShippedGround,
  type ShippedIcon,
} from "./icons-data";
import { IconLadder } from "./icons-ladder";
import { ButtonPairs, MenuOnScale } from "./icons-pairs";
import styles from "./icons.module.css";

const SRC = { from: "@/components/design-system/Icon", name: "Icon" };
const GAP: Readonly<Record<number, string>> = { 6: "me-1.5", 8: "me-2" };
const onScale = SHIPPED.filter((s) => !s.fix).length;

function Shipped({ s }: { s: ShippedIcon }) {
  return (
    <Item
      label={
        <>
          {s.where} · {s.size} / {s.stroke} ·{" "}
          <span className={s.fix ? styles["ds-icon-fix"] : undefined}>
            {s.fix ? `normalise to ${s.fix}` : "on scale"}
          </span>
        </>
      }
    >
      <span className={styles["ds-icon-glyphs"]} style={{ color: TONE_VAR[s.tone] }}>
        {s.icons.map((Glyph, k) => (
          <Glyph key={k} aria-hidden size={s.size} strokeWidth={s.stroke} />
        ))}
      </span>
    </Item>
  );
}

function ShippedOn({ ground }: { ground: ShippedGround }) {
  const canvas = ground === "light" ? "page" : ground;
  return (
    <Canvas ground={canvas} label={`Icons as shipped, ${ground} ground`}>
      <div className={styles["ds-icon-shipped"]}>
        {SHIPPED.filter((s) => s.ground === ground).map((s) => (
          <Shipped key={s.where} s={s} />
        ))}
      </div>
    </Canvas>
  );
}

export function IconsSection() {
  return (
    <Section
      id="icons"
      lead="Lucide line icons on one ladder of six sizes. The size sets the stroke, so no icon is tuned by eye."
    >
      <Sub title="As shipped">
        <Spec
          title="The site's icons"
          level={4}
          source={{ from: "lucide-react" }}
          role="Every lucide icon on the site at its real size and stroke, against the ladder step it belongs on."
          caption={`${SHIPPED.length} uses · ${onScale} on scale · ${SHIPPED.length - onScale} to normalise`}
          drawer={{ values: SHIPPED_VALUES }}
        >
          <ShippedOn ground="light" />
          <ShippedOn ground="on-blue" />
          <ShippedOn ground="terminal" />
        </Spec>
      </Sub>

      <Sub title="Ladder">
        <Spec
          title="Sizes and strokes"
          level={4}
          source={SRC}
          props="size"
          role="Each size carries its own stroke, so a 12 and a 24 land close to one line weight on screen."
          caption="lucide 24-unit grid · round caps and joins · colour from currentColor"
          drawer={{ values: LADDER_VALUES, props: ICON_PROPS, code: ICON_CODE }}
        >
          <IconLadder />
        </Spec>
      </Sub>

      <Sub title="Forms">
        <Spec
          title="Inline and boxed"
          level={4}
          source={SRC}
          props="form box"
          role="Inline icons ride the text baseline. The boxed form gives a lone icon a white surface and an edge."
          drawer={{ values: FORM_VALUES }}
        >
          <Anatomy pins={FORM_PINS} label="Icon forms">
            <span data-pin="inline" className={styles["ds-icon-pair"]} style={{ fontSize: 13.5 }}>
              Back to top
              <Icon icon={ArrowUp} size={14} form="inline" className="ms-1.5" />
            </span>
            <span data-pin="boxed">
              <Icon icon={ShieldCheck} size={18} form="boxed" />
            </span>
          </Anatomy>
          <SizeLadder
            label="Boxed sizes"
            ground="container"
            sizes={BOXED_RUNGS.map((r) => ({
              name: `${r.box} · icon ${r.px}`,
              spec: r.box,
              node: <Icon icon={ShieldCheck} size={r.px} form="boxed" />,
            }))}
          />
        </Spec>
      </Sub>

      <Sub title="Pairing">
        <Spec
          title="With text and in buttons"
          level={4}
          source={SRC}
          role="The icon steps with the line or the box it sits in, never picked on its own."
          drawer={{ values: PAIR_VALUES }}
        >
          <Canvas label="Icons with text">
            <div className={styles["ds-icon-row"]}>
              {TEXT_PAIRS.map((p) => (
                <Item key={p.size} label={`${p.size} · ${p.px}px text · gap ${p.gap}`}>
                  <span className={styles["ds-icon-pair"]} style={{ fontSize: p.px }}>
                    <Icon icon={p.icon} size={p.size} form="inline" className={GAP[p.gap]} />
                    {p.text}
                  </span>
                </Item>
              ))}
            </div>
          </Canvas>
          <Canvas ground="container" label="Icons in icon buttons">
            <ButtonPairs />
          </Canvas>
        </Spec>
      </Sub>

      <DoDont>
        <Do reason="All three render a 1.17px line, so the row reads as one set.">
          <span className={styles["ds-icon-glyphs"]} style={{ color: TONE_VAR.ink }}>
            <Icon icon={Globe} size={16} />
            <Icon icon={Check} size={16} />
            <Icon icon={Waves} size={16} />
          </span>
        </Do>
        <Dont reason="Lucide's default stroke of 2 renders 1.50px on the 18 globe and 1.33px on the check, beside a 1.17px wave.">
          <span className={styles["ds-icon-glyphs"]} style={{ color: TONE_VAR.ink }}>
            <Globe aria-hidden size={18} strokeWidth={2} />
            <Check aria-hidden size={16} strokeWidth={2} />
            <Waves aria-hidden size={16} strokeWidth={1.75} />
          </span>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="The 40 box carries the 18 step at 1.75, the size it is drawn for.">
          <MenuOnScale />
        </Do>
        <Dont reason="A 22 icon falls between the 20 and 24 steps, so it matches no stroke and no box.">
          <span className={styles["ds-icon-circle"]}>
            <Menu aria-hidden size={22} strokeWidth={1.75} />
          </span>
        </Dont>
      </DoDont>
    </Section>
  );
}
