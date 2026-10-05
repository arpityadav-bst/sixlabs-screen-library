### Empty state

**Purpose.** What a view shows when there is nothing to show: it has no content yet, the search or filter found nothing, it failed to load, the visitor is offline, or the visitor may not see it. The site has none today. Every one of these moments is a place a visitor can leave, so the part's whole job is to explain what happened in a line and offer the next step.

**Anatomy.** A centred column at most 400 wide: an icon (24px in a 48px white circle with a hairline) or the 44px brand mark for a brand moment, a title in Outfit 20 at 500 and -0.03em, a body in Inter 14 at 1.5, and an actions row. Contained, the column sits in the container look at the card size: the #f5f6f8 grey, radius 36 and the faint hairline, with no shadow, at 48 padding. The radius stays 36 at every width, since the part answers its own box and only its padding steps down. Uncontained, it sits bare inside a card, at 40 by 24.

**Variants.** firstUse invites the visitor to make the first thing (Inbox icon). noResults names what was searched and offers the way back, usually Clear filters as a secondary (SearchX). error says what failed and that nothing was lost, with Try again as a secondary and a support link, and its icon turns danger ink, the only tint the part carries (CircleAlert). offline says what needs the connection and that the view recovers on its own (WifiOff). noAccess says whose the content is and how to get in (Lock). The variant only picks the icon, so a new case never needs a new variant, just new words.

**Copy.** The title names the state in plain words ("No sessions match ‘refund’", not "Oops"). The body gives the reason or the way on in one or two short sentences. The primary action fixes the cause where it can (Clear filters, Try again, Sign in), and the secondary is a link to help. Never blame the visitor and never leave the view without an action, except offline, where the body says it recovers by itself.

**Sizes.** One size, which adapts to its own width: under 560 the padding drops to 32, and under 400 the actions stack, the primary on top and full width.

**States.** Static, and the action's own states. A retry shows its work in the button (loading), and the message holds still, so the visitor sees the attempt rather than a flicker of the whole view. If the retry fails again the part stays as it was, which is the honest result.

**Props.** `variant`, `title`, `body`, `primaryAction` (one md Button), `secondaryAction` (a TextLink or a secondary Button), `contained`, `icon`, `mark`, `headingLevel` (3 by default, one level under the view's own heading) and `announce`.

**Motion.** It rises 12px and fades in over 500ms on the one ease when it mounts, transform and opacity only, so an empty view arriving after a load reads as a result rather than a gap. Nothing moves under reduced motion.

**Accessibility.** The title is a real heading at the level the view needs, so the empty state can be found by heading navigation. The icon is decorative. The body is #475569, not the site's #64748b, because #64748b reads 4.40:1 on the container grey and fails AA at 14px, while #475569 holds 7.0:1. Set `announce` (role alert) only when the empty state replaces content after the visitor's own action, such as a search that returns nothing. An empty state that is simply there on arrival is read in the normal order.

**Responsive.** It sizes from its own width (a container query), not the window's. The same part sits in a full page column and in a narrow card on a wide screen, and only its own width says how much room it has.

**Do / Don't.**
- Do end every empty state on one action that moves the visitor forward.
- Do name the query in a no-results title, so the visitor can see what to change.
- Do keep the body at #475569 on the container grey.
- Don't contain it inside a card, which already draws an edge.
- Don't use an illustration in place of the words.
- Don't give an empty state two primaries.
