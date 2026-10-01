"use client";

// Phones (Header.tsx, below md): the header's tabs, which do not fit the bar, behind a menu button. It opens
// a white sheet straight under the bar: the tabs as large rows (each glides to its section, as on desktop,
// and closes the sheet), the language picker, and the primary call to action; a light veil over the page
// closes it too, as does Escape. The page holds still while it is open.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { LanguageMenu } from "./LanguageMenu";
import { PrimaryCta } from "./PrimaryCta";
import { jumpTo, type Spot } from "./jump";

const ease = [0.22, 1, 0.36, 1] as const;
// the page held still while the sheet is open (its overflow clipped), and free again
const holdPage = (on: boolean) => {
  document.documentElement.style.overflow = on ? "clip" : "";
};

export function MobileMenu({
  links,
}: {
  links: { label: string; to: Spot }[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    holdPage(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      holdPage(false);
    };
  }, [open]);

  const go = (to: Spot) => {
    setOpen(false);
    holdPage(false); // free before the glide starts
    jumpTo(to);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-10 w-10 place-items-center rounded-full text-[#0a1b33] md:hidden"
      >
        {open ? (
          <X size={22} strokeWidth={1.75} />
        ) : (
          <Menu size={22} strokeWidth={1.75} />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="veil"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="absolute inset-x-0 top-full h-screen bg-[#0a1b33]/20 md:hidden"
            />
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
              className="absolute inset-x-0 top-full border-b border-slate-200/80 bg-white px-4 pb-6 pt-1 md:hidden"
            >
              <ul>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <a
                      href={`#${to}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(to);
                      }}
                      className="flex items-center justify-between border-b border-slate-100 py-4 font-display text-[20px] font-normal tracking-tight text-[#0a1b33] transition-colors duration-200 active:text-accent"
                    >
                      {label}
                      <ArrowRight
                        size={18}
                        strokeWidth={1.75}
                        className="text-slate-400"
                      />
                    </a>
                  </li>
                ))}
              </ul>
              {/* above the call to action, so the language list opens over it, not under it */}
              <div className="relative z-10 mt-4 flex items-center justify-between">
                <span className="font-sans text-[13px] text-[#64748b]">
                  Language
                </span>
                <LanguageMenu />
              </div>
              <div className="mt-5 [&>button]:w-full">
                <PrimaryCta>Try now</PrimaryCta>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
