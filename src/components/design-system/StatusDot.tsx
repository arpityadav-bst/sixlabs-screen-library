// A status dot. Live ping is the hero's social-proof pair (an accent core under an animate-ping halo at
// accent 40%), live pulse is the player card's running dot. The dot is the one accent fill a light ground
// may carry. It is decorative, so the words beside it carry the status, and it stands still under reduced
// motion.

export type StatusDotTone = "live" | "idle" | "success" | "danger";
export type StatusDotMotion = "ping" | "pulse" | "none";

const TONE: Record<StatusDotTone, string> = {
  live: "bg-(--ds-color-accent)",
  idle: "bg-(--ds-color-line-strong)",
  success: "bg-(--ds-color-success)",
  danger: "bg-(--ds-color-danger)",
};

export type StatusDotProps = {
  size?: 6 | 8;
  tone?: StatusDotTone;
  motion?: StatusDotMotion;
  className?: string;
};

export function StatusDot({ size = 8, tone = "live", motion = "none", className = "" }: StatusDotProps) {
  const box = size === 8 ? "h-2 w-2" : "h-1.5 w-1.5";
  const ping = motion === "ping";
  return (
    <span aria-hidden className={`relative inline-flex shrink-0 ${box} ${className}`}>
      {ping && (
        <span
          className={
            "absolute inset-0 animate-ping rounded-full motion-reduce:animate-none " +
            (tone === "live" ? "bg-(--ds-color-accent-ping)" : TONE[tone] + " opacity-40")
          }
        />
      )}
      <span
        className={
          `relative rounded-full ${box} ${TONE[tone]} ` +
          (motion === "pulse" ? "animate-pulse motion-reduce:animate-none" : "")
        }
      />
    </span>
  );
}
