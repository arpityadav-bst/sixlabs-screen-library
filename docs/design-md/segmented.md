### Segmented control

**Purpose.** A choice among two to four short, equal options, made in place and seen whole. The site has two: Human / AI on the accent water, with a white thumb that slides, and the jobs switch on white below xl, with a navy fill that jumps. They are one idea built twice. Segmented is that idea once, with three grounds and the keyboard model neither shipped version has.

**Anatomy.** A track: a pill with a 1px border and 3px inside it, the 4px inset the segments sit in. A border rather than a shadow ring, so the track keeps its outline in forced colours. The segments, each a label with 14px either side. The thumb: one element that sits under the chosen segment and travels to the next one when the choice changes.

**Variants.** Three grounds. Light is the jobs switch made whole: a white track with a hairline, a navy thumb and white text when chosen, the muted grey at rest. Container is for the grey hero container: a 70% white track with no line, the same navy thumb with white text, and the body slate at rest, because navy is the chosen colour on every light ground. Blue keeps Human / AI's white thumb with ink, and sets its other labels straight on the water in full white inside a white 40% line, where ModeToggle lays 15% glass under them at 80%, so a label at rest keeps the 4.49:1 that white has on the accent. White is the chosen colour on blue for the reason in the accent rule (chapter 8), as navy is on light ones. In forced colours the thumb fills `Highlight` on every ground.

**Sizes.** The size names the segment, not the track: sm 32, md 36, lg 40, with labels at 13, 14 and 15. The track adds 8 around it, so sm stands 40 tall, close to the jobs switch, and md 44, close to Human / AI. Naming the segment lets a segmented sm line up its segments with a 32 button in the same toolbar. `equal` gives every segment the width of the widest, for options whose lengths differ but whose weight should not.

**States.** Rest. Hover on an unchosen segment: its label takes the ground's strong colour. Chosen: the thumb under it. Focus-visible: the ring around the chosen segment, which holds the one tab stop, white on blue. Pressed: the segment settles to 0.97. A disabled segment drops to 40% and the arrows skip it. A disabled control drops the whole track to 40% and takes no input.

**Props.** `options` (`id`, `label`, optional `disabled`), `value`, `onChange`, `label` (the group's accessible name), `size`, `ground`, `equal`, `role`, `thumbId`, `optionId` and `controls` for the tab role, `disabled`, `forceState` and `forceOn`.

**Motion.** The thumb slides on the thumb spring (stiffness 500, damping 40), the one Human / AI uses, on every ground. Labels change colour over 200ms. The thumb is a shared layout element, so `thumbId` must be unique among mounted controls, or motion animates one thumb between two of them. The players section mounts Human / AI twice (a desktop and a phone placement) and gives the phone copy its own thumb id for this reason. The system control makes its own unique id when none is given. Under reduced motion the thumb moves at once.

**Accessibility.** As a choice, it is a radio group: one tab stop on the chosen segment, Left and Right (and Up and Down) move the choice and wrap, Home and End jump. Selection follows focus, as a radio group's does. As a switch of content in place, it takes the tab role, and `optionId` and `controls` tie each segment to the content it shows. Human / AI is a radio group whose radios are both tab stops and ignore the arrows, and the jobs switch has tab roles with no panels or arrow keys, which is the drift the system control closes.

**Segmented or Tabs.** Segmented is for a few short options of equal weight that change a view in place, where every option should stay in sight. Tabs are for switching between panels of content, for longer labels, and for more than four options, because the tab line scrolls and a segmented control should never need to.

**Responsive.** The control keeps its size at every width. Where a phone runs short of room, the answer is fewer or shorter options, or Tabs, rather than a smaller size. The jobs switch shows only below xl, where its cards become a swipe row it names, and hides from xl, where the three cards sit side by side.

**Do / Don't.**
- Do keep options to two to four short labels.
- Do use the blue ground only on the accent water and the container ground only on the grey container.
- Do give every mounted control its own thumb id when it sets one.
- Don't let a segmented control scroll or wrap.
- Don't use it to switch whole panels of content.
- Don't show the chosen segment in the accent.
