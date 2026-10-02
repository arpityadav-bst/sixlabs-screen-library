// /design-system/frame/<part>: one part on a bare page, for an iframe in the guide. Every part in PARTS
// is prerendered and any other name is a 404 (dynamicParams false). Params arrive as a Promise (Next 16).
import { notFound } from "next/navigation";
import { FRAME_PARTS, PARTS, isPart } from "../_parts";

export const dynamicParams = false;

export function generateStaticParams() {
  return PARTS.map((part) => ({ part }));
}

export default async function FramePage({ params }: { params: Promise<{ part: string }> }) {
  const { part } = await params;
  if (!isPart(part)) notFound();
  const Part = FRAME_PARTS[part];
  return <Part />;
}
