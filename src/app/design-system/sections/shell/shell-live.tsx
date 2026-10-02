"use client";

// Client leaves for the shell sections' Do and Don't panels: an icon is a component, and a component
// cannot cross from a server section into a client IconButton as a prop.
import { ArrowUp, Menu } from "lucide-react";
import { IconButton, type IconButtonProps } from "@/components/design-system/IconButton";

export function MenuButtonSpecimen({ size }: { size: IconButtonProps["size"] }) {
  return <IconButton icon={Menu} label="Open menu" size={size} />;
}

export function BackButtonSpecimen({ variant }: { variant: IconButtonProps["variant"] }) {
  return <IconButton icon={ArrowUp} label="Back to top" variant={variant} size="lg" />;
}
