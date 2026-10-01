// The closing call, after the onBlue creators page's (blueai/public/experiments/onblue-vesper,
// #get-access) in the page's own light look: centred, the mark, the two-line promise with its second line
// typed in behind the hero's caret once it comes into view, one line of why, the primary CTA, and a quiet
// sign-in line under it. The numbers are written out, since the words carry the scale.
import { PrimaryCta } from "./PrimaryCta";
import { TypedWord } from "./TypedWord";

export function Closing() {
  return (
    <section
      id="get-access"
      className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center px-4 pt-[clamp(40px,4vw,72px)] pb-[clamp(92px,10vw,150px)] text-center md:px-16"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 44px mark, no optimisation needed */}
      <img
        src="/brand/sixlabs-mark.svg"
        alt=""
        width={44}
        height={44}
        className="mb-6 h-11 w-11"
      />
      <h2 className="font-display text-[clamp(38px,5.2vw,74px)] font-medium leading-[1.05] tracking-[-0.045em] text-[#0a1b33]">
        1 million made
        <br />
        <TypedWord word="2 billion to go" className="text-accent" onView />
      </h2>
      <p className="mt-5 max-w-[520px] text-balance font-sans text-[15px] leading-[1.5] text-[#64748b] md:text-[16px]">
        Every studio that joins makes the model better for every studio after
        it. Your players are next.
      </p>
      <div className="mt-[34px]">
        <PrimaryCta>Try now</PrimaryCta>
      </div>
      <p className="mt-[34px] font-sans text-[13.5px] tracking-[-0.01em] text-[#64748b]">
        Already have an account?{" "}
        <a
          href="#"
          className="text-[#0a1b33] underline decoration-slate-300 decoration-1 underline-offset-[3px] transition-colors duration-300 hover:text-accent hover:decoration-accent"
        >
          Sign in
        </a>
      </p>
    </section>
  );
}
