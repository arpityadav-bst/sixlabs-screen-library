// The one anchor rule for DESIGN.md, shared by the build (links.mjs) and the guide's chapter chips
// (Section.tsx), so a chip's link and the heading it points at cannot drift apart. Pure, no imports.

/**
 * GitHub's heading anchor: lower case, punctuation dropped, each space a hyphen.
 * @param {string} text the heading's text
 * @returns {string}
 */
export const slug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");

/**
 * The anchor of a numbered heading, "## 3 Tokens reference" or "### 7.1 Button". The build fails when a
 * numbered heading's anchor would take GitHub's -1 suffix, so this plain form is always the right one.
 * @param {string} num the chapter or section number
 * @param {string} title the heading's title
 * @returns {string}
 */
export const numberedAnchor = (num, title) => slug(`${num} ${title}`);
