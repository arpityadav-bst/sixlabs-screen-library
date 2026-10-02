"use client";

// The badge's count form pinned to an icon button. A client leaf, because the icon is a component and a
// server file cannot hand one to a client part.
import { Bell, MessageSquare } from "lucide-react";
import { Badge } from "@/components/design-system/Badge";
import { IconButton } from "@/components/design-system/IconButton";
import { StatusDot } from "@/components/design-system/StatusDot";

export function CountOnButtons() {
  return (
    <>
      <span className="ds-a-count inline-flex">
        <IconButton icon={Bell} label="Notifications" variant="outline" badge={<Badge count={3} pinned label="3 new" />} />
      </span>
      <IconButton icon={MessageSquare} label="Messages" variant="outline" badge={<Badge count={120} pinned label="120 new" />} />
      <IconButton icon={Bell} label="Alerts, live" variant="outline" badge={<StatusDot size={8} tone="live" className="absolute -right-0.5 -top-0.5" />} />
    </>
  );
}
