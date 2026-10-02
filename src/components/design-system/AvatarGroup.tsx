// A row of people or models that overlap by a quarter of their size, each in a 2px page-colour ring so the
// edges stay read. It shows four at most (three on phones), then a +N disc in the neutral grey. The group is
// named as a whole ("5 players"), and the disc says how many more it stands for.
import { Avatar, type AvatarShape, type AvatarSize } from "./Avatar";

export type AvatarPerson = { name: string; src?: string };

function More({ n, size, shape, className }: { n: number; size: AvatarSize; shape: AvatarShape; className: string }) {
  return (
    <span
      role="img"
      aria-label={`${n} more`}
      className={
        "relative grid shrink-0 place-items-center bg-(--ds-color-fill-highlight) font-sans font-medium " +
        `text-(--ds-color-text-body) tabular-nums ${className}`
      }
      style={{
        width: size,
        height: size,
        marginLeft: -size * 0.25,
        borderRadius: shape === "model" ? "var(--ds-radius-model)" : "var(--ds-radius-full)",
        boxShadow: "0 0 0 2px var(--ds-color-page)",
        fontSize: size >= 32 ? "var(--ds-text-12)" : "var(--ds-text-11)",
      }}
    >
      +{n}
    </span>
  );
}

export function AvatarGroup({
  people,
  size = 32,
  shape = "circle",
  max = 4,
  label,
  className = "",
}: {
  people: readonly AvatarPerson[];
  size?: AvatarSize;
  shape?: AvatarShape;
  /** the most shown from md, one fewer on phones */
  max?: number;
  /** the group's accessible name, "5 players" by default */
  label?: string;
  className?: string;
}) {
  const wide = Math.min(max, people.length);
  const narrow = Math.min(max - 1, people.length);
  return (
    <div role="group" aria-label={label ?? `${people.length} people`} className={`flex items-center ${className}`}>
      {people.slice(0, wide).map((p, k) => (
        <Avatar
          key={p.name}
          name={p.name}
          src={p.src}
          size={size}
          shape={shape}
          ringed
          className={k >= narrow ? "max-md:hidden" : ""}
          style={k > 0 ? { marginLeft: -size * 0.25 } : undefined}
        />
      ))}
      {people.length > narrow && (
        <More n={people.length - narrow} size={size} shape={shape} className="md:hidden" />
      )}
      {people.length > wide && <More n={people.length - wide} size={size} shape={shape} className="max-md:hidden" />}
    </div>
  );
}
