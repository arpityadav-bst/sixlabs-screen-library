// The frame parts: one bare page each at /design-system/frame/<part>, prerendered from PARTS (ids.ts). Every
// name maps to its component here, and the map is checked against the full list, so a name with no part
// fails tsc instead of shipping a frame that renders nothing.
import type { ComponentType } from "react";
import * as shellHeader from "./shell-header";
import * as shellFoot from "./shell-foot";
import type { PartId } from "./ids";
import { AccordionPhone } from "./accordion-phone";
import { CarouselPhone } from "./carousel-phone";
import { TerminalPhone } from "./terminal-phone";
import { ButtonGroupPart } from "./button-group";
import { SectionFaq } from "./section-faq";
import { SectionJobs } from "./section-jobs";
import { LayoutClosing } from "./layout-closing";
import { FieldSizesPart, RadioStackPart, SelectNativePart } from "./inputs";
import { SectionUnderstands } from "./understands";
import { ScrollSetPiece } from "./scroll-set-piece";
import { HeroNumbersPart } from "./hero-numbers";
import { AvatarGroupPart } from "./avatar-group";
import { SectionHeadPart } from "./section-head";
import { DialogAutoPart, ToastStackPart } from "./overlays";
import { HeroContainerPart, HeroFullPart } from "./hero";
import { PlayersPart } from "./players";

export { PARTS, frameHref, isPart, type PartId } from "./ids";

/** part id to its component, one entry for every id in PARTS */
export const FRAME_PARTS = {
  "header-rest": shellHeader.HeaderRest,
  "header-scrolled": shellHeader.HeaderScrolled,
  "header-onblue": shellHeader.HeaderOnBlue,
  "header-clear-top": shellHeader.HeaderClearTop,
  "header-clear-held": shellHeader.HeaderClearHeld,
  "header-phone": shellHeader.HeaderPhone,
  "menu-open": shellHeader.MenuOpen,
  language: shellFoot.LanguagePart,
  footer: shellFoot.FooterPart,
  "back-to-top": shellFoot.BackToTopPart,
  "back-to-top-phone": shellFoot.BackToTopPhonePart,
  "scroll-cue": shellFoot.ScrollCuePart,
  "scroll-cue-away": shellFoot.ScrollCueAwayPart,
  "carousel-phone": CarouselPhone,
  "terminal-phone": TerminalPhone,
  "accordion-phone": AccordionPhone,
  "button-group": ButtonGroupPart,
  "section-jobs": SectionJobs,
  "section-faq": SectionFaq,
  "layout-closing": LayoutClosing,
  "field-sizes": FieldSizesPart,
  "select-native": SelectNativePart,
  "radio-stack": RadioStackPart,
  "section-understands": SectionUnderstands,
  "scroll-set-piece": ScrollSetPiece,
  "hero-numbers": HeroNumbersPart,
  "avatar-group": AvatarGroupPart,
  "section-head": SectionHeadPart,
  "toast-stack": ToastStackPart,
  "dialog-auto": DialogAutoPart,
  "hero-container": HeroContainerPart,
  "hero-full": HeroFullPart,
  players: PlayersPart,
} satisfies Record<PartId, ComponentType>;
