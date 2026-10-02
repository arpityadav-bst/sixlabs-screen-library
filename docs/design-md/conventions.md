### Conventions

How the system and its guide are kept, so the next part goes in the way the last one did.

#### House conventions

- **One token, one value.** A value earns a `--ds-*` name the first time a second part needs it. One name per value means a change happens in one place and a search finds every use.
- **Say it once.** Chapter 0 sets the split between this document and the guide. When the two disagree, the guide's rendering is the fact and the chapter is out of date.
- **Measure, do not transcribe.** A typed number is right on the day it is typed and wrong from the next edit. Reading it from the DOM or the source keeps it current, and an assertion covers the rare value that has to be copied by hand (a timing a component keeps private), so a source change turns Coverage red rather than leaving a wrong figure on show.
- **Effects are ambience, not content.** Because no copy and no control waits on an effect, the guide can pause one to keep its WebGL budget and the site can drop one under reduced motion, and a visitor loses nothing they came for.
- **Nothing loops unattended.** An idle loop off screen spends battery and GPU time on no one, and a loop that ignores reduced motion overrides a choice the reader has already made.
- **Real parts only.** Importing means the guide breaks the day the site changes, which is the point. Parts the site lacks carry no "proposed" tag, because a tag invites a second, looser standard for what ships.

#### Adding to the guide

1. **Catalog first.** A section missing from the catalog has no nav link, no place in the page and no row in the counts. Covers list only what the section really shows, because the index card and Coverage count them.
2. **One section file, under 300 lines.** It exports `<Id>Section` and is listed in `sections/registry.tsx`, the one map the page renders from, so a section outside it never shows. Split a long section into siblings in the same folder.
3. **Assert what you write.** Any value copied from the site's source by hand gets an assertion.
4. **Declare the cost.** WebGL and iframes mount through HeavySlot or ViewportPreview with their cost, so the page keeps to its budget of 8 GL units, 1 floor and 8 frames.
5. **Ids once.** A site id (`understands`, `faq`, `get-access`, `jobs`) renders once on the guide and is listed in the section's renders. `#players`, `#model-line` and `#site-head` never render, because the site's scroll and header code looks them up on the document.
6. **Write the chapter.** A partial in `docs/design-md`, named after the section's id, with the reasons in this document's voice. Then rebuild DESIGN.md, as chapter 0 describes.

#### Code rules, and why

- **Prefixes.** The guide shares a document with the site's globals, so an unprefixed class could restyle a shipped part with no one noticing. `ds-` classes and `--ds-*` tokens make that impossible by name.
- **Compositor rule.** The guide page holds more live effects than any page of the site, so the Mac Chrome cost of one blur or mask there is larger, not smaller.
- **Accent fill.** A guide that breaks the owner rule in its own chrome teaches the opposite of the rule it documents.
- **300 lines.** A file that fits on a few screens can be reviewed whole, and a split forced early lands on a natural seam rather than a desperate one.
- **Punctuation.** Commas, colons and full stops carry every sentence, so comments, the guide and these chapters read in one voice.
- **Quoted copy.** The guide must not invent brand copy, so a specimen says what the site says or says something plainly filler.
