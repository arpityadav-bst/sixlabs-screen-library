// Top header: layout and styling from the Halo prompt's navbar, recoloured to this site's light palette;
// content from the 6labs.ai header. The logo is the 6labs wordmark (Logo.tsx).
import { LanguageMenu } from "./LanguageMenu";
import { Logo } from "./Logo";

const LINKS = ["Product", "The players", "What it does"];

export function Header() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <a href="/website" className="flex items-center">
          <Logo className="text-[34px]" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-base font-medium text-slate-500 hover:text-[#0a1b33] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageMenu />
          <button className="bg-[#0a152d] text-white text-[15px] font-medium px-6 py-3 rounded-full hover:bg-[#1e2b47] transition-colors duration-200">
            Sign in
          </button>
        </div>
      </div>
    </nav>
  );
}
