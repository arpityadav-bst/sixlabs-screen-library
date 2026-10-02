"use client";

// A person or a player model in small form. Shape tells them apart before any picture loads: a circle is
// a person, a 28% rounded square is a player model (the tiles' characters, and their AI copies on navy so
// the hologram's blue reads). The picture fades in over 200ms and falls back to initials on an error, then
// to an icon when there is no name (and at 20, too small for letters). Initials and the icon sit on the
// type scale and the icon ladder, so the face grows round them. The status dot is a quarter of the size
// with a page-colour ring.
import { User } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { FOCUS } from "./focus";
import { forceAttr, forces, type ForceState } from "./force";
import { Icon } from "./Icon";
import type { IconSize } from "./token-shape";
import { AVATAR_SIZES, type AvatarSize } from "./avatar-sizes";
export { AVATAR_SIZES, type AvatarSize };
export type AvatarShape = "circle" | "model";
export type AvatarStatus = "live" | "online" | "idle";

// the size ladder lives in avatar-sizes.ts, a plain module, so the guide's server pages can read it

const DOT: Record<AvatarStatus, string> = {
  live: "bg-(--ds-color-accent)",
  online: "bg-(--ds-color-success)",
  idle: "bg-(--ds-color-line-strong)",
};
const SAID: Record<AvatarStatus, string> = { live: "live", online: "online", idle: "away" };

/** Initials on the type scale per size (none at 20), and the fallback icon on its ladder, capped at 24. */
const LETTERS: Record<AvatarSize, number | null> = { 20: null, 24: 11, 32: 13, 40: 16, 48: 20, 64: 26, 96: 34 };
const GLYPH: Record<AvatarSize, IconSize> = { 20: 12, 24: 12, 32: 16, 40: 20, 48: 24, 64: 24, 96: 24 };

/** Two letters from a name: the first letters of its first two words. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

export type AvatarProps = {
  /** a person's or a model's name, also the accessible name */
  name?: string;
  src?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** navy behind an AI copy, so the hologram's blue reads */
  fill?: "container" | "navy";
  status?: AvatarStatus;
  /** makes it a button (a profile) */
  onClick?: () => void;
  disabled?: boolean;
  /** the 2px page-colour ring an avatar wears inside a group */
  ringed?: boolean;
  forceState?: ForceState;
  className?: string;
  style?: CSSProperties;
};

export function Avatar({
  name,
  src,
  size = 40,
  shape = "circle",
  fill = "container",
  status,
  onClick,
  disabled: disabledProp = false,
  ringed = false,
  forceState,
  className = "",
  style,
}: AvatarProps) {
  const [failed, setFailed] = useState<string | null>(null);
  const disabled = disabledProp || forces(forceState, "disabled");

  const radius = shape === "model" ? "var(--ds-radius-model)" : "var(--ds-radius-full)";
  const letters = name ? LETTERS[size] : null;
  const dot = Math.max(6, Math.round(size * 0.25));
  const label = name ? name + (status ? `, ${SAID[status]}` : "") : status ? SAID[status] : "Avatar";
  const ground = fill === "navy" ? "bg-(--ds-color-primary) text-white" : "bg-(--ds-color-container) text-(--ds-color-ink)";
  const showImg = src && failed !== src;
  const shown = (el: HTMLImageElement) => {
    el.style.opacity = "1";
  };
  // a picture that settled before hydration fires no event, so the ref reads where it stands
  const settle = (el: HTMLImageElement | null) => {
    if (!el?.complete) return;
    if (el.naturalWidth > 0) shown(el);
    else if (src) setFailed(src);
  };

  const face = (
    <span
      className={`relative grid h-full w-full place-items-center overflow-hidden ${ground}`}
      style={{ borderRadius: radius, boxShadow: ringed ? "0 0 0 2px var(--ds-color-page)" : undefined }}
    >
      {!showImg &&
        (name && letters ? (
          <span aria-hidden className="font-display font-medium leading-none" style={{ fontSize: `var(--ds-text-${letters})` }}>
            {initials(name)}
          </span>
        ) : (
          <Icon icon={User} size={GLYPH[size]} className="text-(--ds-color-text-muted)" />
        ))}
      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element -- a small square still at its own size
        <img
          key={src}
          ref={settle}
          src={src}
          alt=""
          width={size}
          height={size}
          draggable={false}
          onLoad={(e) => shown(e.currentTarget)}
          onError={() => setFailed(src ?? null)}
          className="h-full w-full object-cover opacity-0 transition-opacity duration-(--ds-dur-ui) ease-(--ds-ease-out) motion-reduce:transition-none"
        />
      )}
    </span>
  );
  const badge = status && (
    <span
      aria-hidden
      className={`absolute bottom-0 right-0 rounded-full ${DOT[status]}`}
      style={{ width: dot, height: dot, boxShadow: "0 0 0 2px var(--ds-color-page)" }}
    />
  );
  const box: CSSProperties = { width: size, height: size, ...style };

  if (onClick)
    return (
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        data-force={forceAttr(forceState)}
        className={
          `relative inline-block shrink-0 cursor-pointer transition-[scale,box-shadow] duration-(--ds-dur-ui) ` +
          `ease-(--ds-ease-out) hover:shadow-[0_0_0_2px_var(--ds-color-line-strong)] ` +
          `data-[force=hover]:shadow-[0_0_0_2px_var(--ds-color-line-strong)] data-[force=pressed]:shadow-[0_0_0_2px_var(--ds-color-line-strong)] ` +
          `active:scale-(--ds-scale-press-round) data-[force=pressed]:scale-(--ds-scale-press-round) ` +
          `disabled:cursor-not-allowed disabled:opacity-40 ` +
          `disabled:hover:shadow-none ${FOCUS} ${className}`
        }
        style={{ ...box, borderRadius: radius }}
      >
        {face}
        {badge}
      </button>
    );
  return (
    <span role="img" aria-label={label} className={`relative inline-block shrink-0 ${className}`} style={box}>
      {face}
      {badge}
    </span>
  );
}
