"use client";

// Region / language picker in the header. Opens from its top-right corner on a soft spring, the rows
// fade in one after another, and a highlight glides between rows under the pointer or the arrow keys.
// Closes on selection, Escape or a click outside.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "US", label: "English" },
  { code: "KR", label: "한국어" },
  { code: "JP", label: "日本語" },
  { code: "CN", label: "中文" },
];

const spring = { type: "spring", stiffness: 460, damping: 34, mass: 0.7 } as const;

// Named states, so the panel can stagger its rows in as it opens.
const panel = {
  hidden: { opacity: 0, scale: 0.94, y: -8, filter: "blur(4px)" },
  shown: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { ...spring, staggerChildren: 0.035, delayChildren: 0.04 } },
  gone: { opacity: 0, scale: 0.97, y: -4, filter: "blur(2px)", transition: { duration: 0.14, ease: "easeIn" as const } },
};
const row = { hidden: { opacity: 0, y: -4 }, shown: { opacity: 1, y: 0, transition: spring } };

export function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const choose = (k: number) => { setSelected(k); setOpen(false); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % LANGUAGES.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + LANGUAGES.length) % LANGUAGES.length); }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(active); }
  };

  return (
    <div ref={root} className="relative" onKeyDown={onKey}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${LANGUAGES[selected].label}`}
        onClick={() => { setActive(selected); setOpen((o) => !o); }}
        className={
          "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors duration-200 " +
          (open ? "bg-slate-200/60 text-[#0a1b33]" : "text-slate-500 hover:text-accent")
        }
      >
        <motion.span animate={{ rotate: open ? 20 : 0 }} transition={spring} className="flex">
          <Globe className="w-[18px] h-[18px]" />
        </motion.span>
        <span className="text-[12px] font-medium w-[18px] text-left">{LANGUAGES[selected].code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-activedescendant={`lang-${active}`}
            variants={panel}
            initial="hidden"
            animate="shown"
            exit="gone"
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full mt-3 w-48 p-1.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/70 shadow-[0_18px_50px_-12px_rgba(10,27,51,0.18)]"
            onPointerLeave={() => setActive(selected)}
          >
            {LANGUAGES.map((lang, k) => (
              <motion.li
                key={lang.code}
                id={`lang-${k}`}
                role="option"
                aria-selected={k === selected}
                variants={row}
                onPointerEnter={() => setActive(k)}
                onClick={() => choose(k)}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer select-none"
              >
                {k === active && (
                  <motion.span layoutId="lang-highlight" transition={spring} className="absolute inset-0 rounded-xl bg-slate-100" />
                )}
                <span className="relative w-6 text-[11px] font-semibold tracking-wide text-slate-400">{lang.code}</span>
                <span className={"relative flex-1 text-[15px] " + (k === selected ? "font-medium text-[#0a1b33]" : "text-slate-600")}>
                  {lang.label}
                </span>
                {k === selected && <Check className="relative w-4 h-4 text-[#0a1b33]" />}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
