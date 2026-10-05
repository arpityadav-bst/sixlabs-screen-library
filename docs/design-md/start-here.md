### Start here

**What this is.** The 6labs design system comes in two halves. The live guide at `/design-system` renders every part from the site's own components, with its states forced and its exact values in a drawer. This file gives the rule and the reason behind each part. The guide shows, this file explains, and each guide section carries a chip with its number here. About this document (chapter 0) has the full contract between the two.

**Where things live.**
- `src/app/design-system/` is the guide. `_data/catalog*.ts` is its one catalog of groups, sections and covers, `sections/<group>/` holds a file and a data module per section, and `_kit/` holds the building blocks, with its API in `_kit/README.md`.
- `src/components/design-system/` holds the system's own parts and the tokens: `tokens.ts` and its `token-*.ts` families.
- `src/components/website/` and `src/components/tiles/` are the live site. The guide imports them and never edits them.
- `docs/design-md/` holds the partials this file is built from, one per guide section. `tools/design-md/` holds the build and the checks.

**Add a part.** Build it in `src/components/design-system/` from `--ds-*` tokens only. Show it in its section with a Spec and a state grid, add it to that section's covers in the catalog with the states the grid shows, and spec it in the section's partial under the ten labels, Purpose first. A piece that only lives inside another part goes in `INTERNAL_PARTS` instead, and owes no specimen.

**Add a section.** Add its entry to its group's `catalog-*.ts` file (id, title, file, its number here, covers), write the section file under `sections/<group>/` and import it in `sections/registry.tsx`, keep its values in a data module listed in `meta/meta-modules.ts`, then write `docs/design-md/<id>.md` headed with the section's title. The catalog number places it in this file.

**Change a token.** Edit its entry in its `token-*.ts` family with the source it mirrors, then rebuild this file so the Tokens reference (chapter 3) carries the new row. About this document (chapter 0) lists the steps. A token never reaches the live site, which does not read `--ds-*`.

**Run the checks.** `node tools/design-md/build.mjs` rebuilds this file after a partial or a token changes. `npm run ds:check` runs TypeScript, the DESIGN.md check and the guide's own build checks (the catalog, the tokens, the source reads and every assertion), and exits non-zero on any failure. It is not part of `next build`, so documentation drift never blocks a deploy.

**Where values come from.** A value the guide prints is one of three kinds: a token read from `tokens.ts`, a value copied from a site or system file with the `file:line` it was read off and, wherever an assertion holds it, the exact text there (its needle), or a measurement the guide takes as the page builds or in the browser. Coverage (10.1) counts every assertion and turns red when a file stops saying what the guide prints. Known gaps (10.2) lists what no assertion reaches.
