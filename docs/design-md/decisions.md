### Decisions pending

Calls only the owner can make. For each: the two options, the scope of the change each one means, and the recommendation with its reason. Until a call is made the site stays as it is, and the guide marks the recommendation without acting on it. Each decision is cited by its number, as decision 1, and the citation links here.

#### 1. Accent text under 24px

A, keep `#1a6dff` for all accent text. B, add an accent ink `#1559d6` for accent text under 24px and for link hovers. *Scope:* A, none. B, one token and the hover and small-text classes of the files that hover links to the accent. *Recommend B.* The brand blue stays wherever it reads as brand (display type, icons, dots, the ring, the water), and the darker ink appears only where reading is the job. WCAG asks 4.5:1 of small text, and the blue gives about 4.3:1 on the page and 3.6:1 on the container.

#### 2. White labels on the accent

White on the accent is 4.49:1, a hair under the 4.5:1 that copy under 24px needs, and the system parts made for the water set their labels in full white at 12 to 15px: Segmented's segments at rest, the Slider's label, value and ticks, the Switch's label and description, the Progress name and value, the on-blue Chip and the glass Button. A, set them large: labels and values on the water grow to 24px, or 18.66px bold, where 3:1 is enough, and each control grows with them. B, put them on a white surface: small labels sit on white in ink, as ModeToggle ships its chosen state, and the water keeps only large type, icons and rings. *Scope:* A, the type and the size of those six parts on blue. B, their on-blue forms, which move their small labels onto white. *Recommend B.* Ink on white clears every bar with room to spare, and a white pill is already how the water shows a chosen control, so B adds no new look. A would make every control on the water large enough to compete with the players for the eye. Until the call, Known gaps (10.2) lists the parts and Contrast (2.3) names them as shipped pairs under the line.

#### 3. Dots on a light ground

The system's live dots fill with the accent on light grounds: StatusDot's live tones, an avatar's live dot and the live badge's dot, as the hero's shipped ping does. The accent rule lists no such fill. A, accent, a named exception: the rule gains one line, that a live dot of 8px at most may take the accent on a light ground, as the hero's ships. B, navy dots: live dots take the navy, as the index card's pin dots already do, so the accent fills nothing outside the water, and a live dot loses the colour that sets it apart. *Scope:* A, none, the rule gains a line. B, StatusDot, Avatar and Badge. *Recommend A.* At 6 to 8px a dot has no area to read as a surface, and the accent is the colour the page already uses to mark a live point, while a navy dot beside navy words reads as a bullet and loses "live". Until the call, the accent rule (chapter 8) lists these dots as pending, and the rule itself stands as written: the accent fills nothing outside the players section.

#### 4. Two navies

A, keep ink `#0a1b33` for type and primary `#0a152d` for fills. B, merge them into one value. *Scope:* A, none. B, the primary fills move to the ink. *Recommend A.* At 1.05:1 the merge saves no visible colour, while two names let a fill and a line of type change on their own later.

#### 5. The comparison's navy card

A, keep the 6labs card in primary navy with no accent word. B, move it to the container look with accent key words. *Scope:* A, none. B, the card and its lines in Understands.tsx. *Recommend A.* The navy is the primary, not the accent, so the one-accent rule holds, and the pair exists to contrast. Accent words on the grey would also read at about 3.6:1.

#### 6. Focus ring colour

A, the accent ring. B, a navy ring. *Scope:* A, none. B, the focus token and every ring that reads it. *Recommend A.* The ring asks for attention, which is the accent's job, and the 2px offset leaves the ground showing between ring and control, so it reads on a navy fill too. A navy ring beside a navy button looks like the button's own border.

#### 7. Tokens in the site's theme

A, the site keeps writing raw values and the `--ds-*` tokens stay mirrors. B, the values move into `@theme` in `globals.css`. *Scope:* A, none, with the assertions watching for drift. B, every site file, one page at a time. *Recommend B, as its own pass.* Only B ends the drift the audit found (a local copy of the ease in every file that uses it, the navies a point apart) rather than watching it, and the guide's assertions give each page a check before it ships.

#### 8. The mono family

A, leave `--font-mono` unmapped. B, map it to JetBrains Mono, which the site already loads. *Scope:* A, none. B, one line in `@theme`. *Recommend B.* The system mono in the player card footers is an accident of the theme, not a choice, and it puts two monos on one page.

#### 9. The card sheen

A, keep the site's sheen with its mask and drop-shadow filter. B, redraw it with background layers only. *Scope:* A, none. B, the `.sheen` rules in `globals.css`. *Recommend B.* The sheen is decoration, and the compositor cost of its mask and filter falls on the whole page for as long as a job card is on screen.

#### 10. FAQ open behaviour

A, several answers open at once. B, one at a time. *Scope:* A, none. B, the open state in Faq.tsx. *Recommend A.* The questions run in pairs (what it is, how it differs from ChatGPT), and a reader comparing two answers should not lose the first.

**Closing a decision.** The owner picks an option, the change ships on the site with its own review, the entry moves to the changelog with its date, and it leaves this chapter.
