### Avatar

**Purpose.** A person or a player model in small form: in a list of testers, on a model's record, in a group of players a studio follows. The site has no avatar yet, but it has the pictures an avatar shows, the tiles' characters and their AI copies, so the system builds the part in the site's own grounds.

**Anatomy.** The face fills the box: the picture cropped to cover, or the initials in Outfit 500, ink on the container grey, on the type scale by size (`--ds-text-*`): 11 at 24, 13 at 32, 16 at 40, 20 at 48, 26 at 64 and 34 at 96, and none at 20. An optional status dot sits at the bottom right, a quarter of the size and never under 6px, ringed 2px in the page colour so it reads as cut out of the face.

**Variants.** Two shapes. A circle is a person. A rounded square at 28% of its size is a player model. The site's whole story is a human and the model made of them, so the shape tells the two apart before any picture has loaded and without colour. An AI copy keeps the model's square and sits on the primary navy, because its hologram is a light blue that would wash out on the grey.

**Sizes.** 20, 24, 32, 40, 48, 64 and 96. 20 and 24 sit in a dense row or beside a chip label, 32 and 40 in lists and cards, 48 and 64 on a record, 96 on a profile. The initials step with the face, and at 20 there are none, because two letters in a 20px face read as a smudge, so it shows the picture or the person icon. Below 32 prefer the picture.

**Fallbacks.** The picture fades in over 200ms once it has loaded, so a slow image never pops. If it fails, the face falls back to the initials, and without a name it shows a person icon in the muted slate. The slot never shows a broken image or an empty circle.

**Status.** Live is the accent, pending decision 3 in Decisions pending (10.3), online is the success green, idle is the strong slate. The status is spoken after the name ("Person one, online"), so the dot is never the only carrier.

**States.** As a button (with `onClick`) the avatar rings 2px in the strong slate on hover, presses to 0.94 (`--ds-scale-press-round`), takes the accent focus ring 2px off its own shape, and fades to 40% when disabled. A plain avatar has no states.

**Group.** Faces overlap by a quarter of their size, each ringed 2px in the page colour so the edges stay read where they cross. A group shows four at most and then a +N disc in the light slate fill with the count in Inter 12 at 500, so the row keeps one length whatever the list's size. The group is named as a whole ("6 players") and the disc says how many it stands for.

**Props.** Avatar: `name`, `src`, `size`, `shape`, `fill`, `status`, `onClick`, `disabled`, `ringed`, `forceState`. AvatarGroup: `people`, `size`, `shape`, `max`, `label`.

**Motion.** The picture fades in over 200ms once it has loaded. A clickable avatar's ring and press change over the same 200ms on the one ease. Nothing else moves, and under reduced motion the picture appears at once.

**Accessibility.** A plain avatar is an image named by the person or model (role img with an aria-label), and its picture is decorative inside it, so the name is read once. A clickable avatar is a button with the same name. A group is a labelled group, so a screen reader can skip it whole.

**Responsive.** One face fewer on a phone keeps a group of 40s inside a narrow card. The avatar itself does not change with the viewport.

**Do / Don't.**
- Do give every player model the rounded square.
- Do pass a name even with a picture. It is the accessible name and the fallback.
- Don't show a model in a circle.
- Don't show more than four faces in a row.
