"use client";

// The specimens that hand an icon to a client atom (IconButton takes the icon as a prop, and a server
// section cannot pass a component across), kept in one client leaf.
import { Menu } from "lucide-react";
import { Item } from "@/app/design-system/_kit/Label";
import { IconButton } from "@/components/design-system/IconButton";
import { BUTTON_PAIRS } from "./icons-set";
import styles from "./icons.module.css";

/** 18 in the 40 and 44 boxes, 20 in the 48. */
export function ButtonPairs() {
  return (
    <div className={styles["ds-icon-row"]}>
      {BUTTON_PAIRS.map((p) => (
        <Item key={p.size} label={`${p.box} box · icon ${p.size === "xl" ? 20 : 18}`}>
          <IconButton icon={p.icon} label={p.label} size={p.size} variant="outline" />
        </Item>
      ))}
    </div>
  );
}

/** The menu button on the ladder: the 40 box carries the 18 icon at 1.75. */
export function MenuOnScale() {
  return <IconButton icon={Menu} label="Open menu" size="md" variant="ghost" />;
}
