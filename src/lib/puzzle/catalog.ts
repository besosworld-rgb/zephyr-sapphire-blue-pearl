export type CutId = 12 | 24 | 48;

export type Cut = {
  id: CutId;
  cols: number;
  rows: number;
  label: string;
  note: string;
};

export type Work = {
  id: string;
  title: string;
  caption: string;
  credit: string;
  src: string;
};

export const CUTS: Cut[] = [
  { id: 12, cols: 4, rows: 3, label: "Sketch", note: "Twelve pieces" },
  { id: 24, cols: 6, rows: 4, label: "Study", note: "Twenty-four pieces" },
  { id: 48, cols: 8, rows: 6, label: "Sitting", note: "Forty-eight pieces" },
];

export const WORKS: Work[] = [
  {
    id: "toast",
    title: "The Toast",
    caption: "A terrace dinner catching the last of the light.",
    credit: "Salon sitting",
    src: "/puzzles/toast.jpg",
  },
  {
    id: "harbor",
    title: "Night Harbor",
    caption: "Lanterns laid on still water, after the boats come in.",
    credit: "Salon sitting",
    src: "/puzzles/harbor.jpg",
  },
  {
    id: "orangerie",
    title: "Glasshouse",
    caption: "Citrus and iron, kept under a weather of panes.",
    credit: "Salon sitting",
    src: "/puzzles/orangerie.jpg",
  },
  {
    id: "alpine",
    title: "First Light",
    caption: "A high lake before the wind finds it.",
    credit: "Salon sitting",
    src: "/puzzles/alpine.jpg",
  },
  {
    id: "library",
    title: "The Stacks",
    caption: "A room built to hold quiet, and the dust of reading.",
    credit: "Salon sitting",
    src: "/puzzles/library.jpg",
  },
  {
    id: "kites",
    title: "Late Bloom",
    caption: "A low sun on the bulbs, row after row.",
    credit: "Salon sitting",
    src: "/puzzles/kites.jpg",
  },
];

export const CUSTOM_WORK: Work = {
  id: "custom",
  title: "Your sitting",
  caption: "A picture you brought to the table.",
  credit: "Private",
  src: "",
};

export function getWork(id: string): Work | undefined {
  if (id === "custom") return CUSTOM_WORK;
  return WORKS.find((w) => w.id === id);
}

export function getCut(id: number): Cut {
  return CUTS.find((c) => c.id === id) ?? CUTS[1];
}
