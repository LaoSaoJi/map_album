import type { ProvinceFocusLabelPlacement } from "@/lib/map-geometry";

export const puzzleRegionShapes = [
  { name: "东北", points: "540,120 705,95 740,170 660,228 550,190" },
  { name: "华北", points: "438,175 550,162 590,212 542,272 420,243" },
  { name: "西北", points: "280,168 448,140 427,266 280,290 228,217" },
  { name: "西南", points: "275,292 432,273 420,420 307,448 235,358" },
  { name: "华中", points: "430,272 542,275 565,357 468,397 402,358" },
  { name: "华东", points: "542,225 635,248 640,370 563,357" },
  { name: "华南", points: "466,397 562,357 632,428 517,488 422,450" }
];

export const provinceFocusLabelPlacements: Record<
  string,
  ProvinceFocusLabelPlacement
> = {
  xian: { dx: 4.6, dy: -4.7, textAnchor: "start" },
  baoji: { dx: -6.2, dy: -4.9, textAnchor: "end" }
};
