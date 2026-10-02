"use client";

// The build-time line map (spec-lines.ts) handed down the guide page, and the spec head's identity chip that
// reads it. One chip per spec: the export (or a labelled point inside the file) and where it lives,
// "TileFloor · tiles/TileFloor.tsx:21". A press copies the import line, or the file's path for a source that
// names no export, and the chip's name says which. The line comes from the map, the export's own line or the
// line an `at` needle is written on, so the chip follows the file and no number is typed by hand. Only a
// source its section builds in code (a line it finds itself at build) carries a line the map cannot hold.
import { createContext, useContext, type ReactNode } from "react";
import { Chip } from "./Chip";
import { importLine, shortFile, sourceFile, sourceKey, type SpecSource } from "./spec-source";

const Lines = createContext<Readonly<Record<string, number>>>({});

export function ExportLines({ lines, children }: { lines: Readonly<Record<string, number>>; children: ReactNode }) {
  return <Lines.Provider value={lines}>{children}</Lines.Provider>;
}

export function IdentityChip({ source }: { source: SpecSource }) {
  const line = useContext(Lines)[sourceKey(source)] ?? source.line;
  const where = line === undefined ? shortFile(source) : `${shortFile(source)}:${line}`;
  const named = source.name ?? source.label;
  const copy = importLine(source);
  const label = copy
    ? `Copy the import of ${source.name}, ${where}`
    : `Copy the path of ${named ? `${named}, ` : ""}${where}`;
  return (
    <Chip value={copy ?? sourceFile(source)} label={label}>
      {named ? `${named} · ${where}` : where}
    </Chip>
  );
}
