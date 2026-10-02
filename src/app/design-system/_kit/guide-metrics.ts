// The guide shell's two shared numbers, written once. GUIDE_TOP is the scroll offset under the sticky toolbar
// (its 56px plus 16 of air): the scroll spy's band starts there, and GuideShell sets it on .ds-root as --dsg-top
// for the sections' scroll margin. GUIDE_NAV_BP is where the sidebar gives way to the phone drawer: the drawer
// closes itself at it, and ds-shell.css writes it as its max-width: 899px query (a media query cannot read a
// custom property).
export const GUIDE_TOP = 72;
export const GUIDE_NAV_BP = 900;
