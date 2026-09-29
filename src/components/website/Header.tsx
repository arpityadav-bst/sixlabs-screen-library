// Top header, from the Halo prompt's navbar (layout and styling only), recoloured to this site's light
// palette: navy wordmark and pill button, slate links. The mark is a placeholder until the SixLabs logo
// arrives. The nav labels are the prompt's own and are placeholders too.
const LINKS = ["Network", "Ecosystem", "Rewards", "Help", "News"];

export function Header() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <a href="/website" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-[#0a1b33] text-white flex items-center justify-center text-[13px]">
            ✦
          </span>
          <span className="font-display text-2xl font-medium tracking-tight text-[#0a1b33]">SixLabs</span>
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

        <button className="bg-[#0a152d] text-white text-[15px] font-medium px-6 py-3 rounded-full hover:bg-[#1e2b47] transition-colors duration-200">
          Open Wallet
        </button>
      </div>
    </nav>
  );
}
