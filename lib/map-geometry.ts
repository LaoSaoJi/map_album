export type ProvinceBBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type ProvinceFocusLabelPlacement = {
  dx: number;
  dy: number;
  textAnchor: "start" | "middle" | "end";
};

export type ViewBoxRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function parseProvincePath(path: string): Array<[number, number]> {
  const tokens = path.match(/[mz]|-?\d*\.?\d+/gi) ?? [];
  const points: Array<[number, number]> = [];

  let cursorX = 0;
  let cursorY = 0;
  let index = 0;

  while (index < tokens.length) {
    const command = tokens[index++];
    if (command?.toLowerCase() !== "m") {
      continue;
    }

    if (index + 1 >= tokens.length) {
      break;
    }

    cursorX += Number(tokens[index++]);
    cursorY += Number(tokens[index++]);
    points.push([cursorX, cursorY]);

    while (index + 1 < tokens.length && !/[mz]/i.test(tokens[index] ?? "")) {
      cursorX += Number(tokens[index++]);
      cursorY += Number(tokens[index++]);
      points.push([cursorX, cursorY]);
    }
  }

  return points;
}

export function getProvinceBBox(path: string): ProvinceBBox | null {
  const points = parseProvincePath(path);
  if (points.length === 0) {
    return null;
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return { minX, minY, maxX, maxY };
}

export function buildFocusedViewBox(
  bbox: ProvinceBBox,
  mapWidth: number,
  mapHeight: number,
  padding = 12
) {
  const minX = Math.max(0, bbox.minX - padding);
  const minY = Math.max(0, bbox.minY - padding);
  const maxX = Math.min(mapWidth, bbox.maxX + padding);
  const maxY = Math.min(mapHeight, bbox.maxY + padding);

  return `${minX} ${minY} ${Math.max(1, maxX - minX)} ${Math.max(1, maxY - minY)}`;
}

export function parseViewBox(
  viewBox: string,
  defaultWidth: number,
  defaultHeight: number
): ViewBoxRect {
  const [x = 0, y = 0, width = defaultWidth, height = defaultHeight] = viewBox
    .split(" ")
    .map(Number);
  return { x, y, width, height };
}

export function getSafeLabelLayout(
  cityName: string,
  cityX: number,
  cityY: number,
  placement: ProvinceFocusLabelPlacement,
  viewBox: ViewBoxRect
) {
  const estimatedTextWidth = Math.max(10, cityName.length * 7.2);
  const estimatedTextHeight = 7.2;
  const padding = 3;
  const minX = viewBox.x + padding;
  const maxX = viewBox.x + viewBox.width - padding;
  const minY = viewBox.y + estimatedTextHeight + padding;
  const maxY = viewBox.y + viewBox.height - padding;

  let x = cityX + placement.dx;
  let y = cityY + placement.dy;
  let textAnchor = placement.textAnchor;

  if (textAnchor === "start" && x + estimatedTextWidth > maxX) {
    textAnchor = "end";
    x = cityX - Math.abs(placement.dx);
  }

  if (textAnchor === "end" && x - estimatedTextWidth < minX) {
    textAnchor = "start";
    x = cityX + Math.abs(placement.dx);
  }

  if (textAnchor === "start") {
    x = Math.max(minX, Math.min(x, maxX - estimatedTextWidth));
  } else if (textAnchor === "end") {
    x = Math.max(minX + estimatedTextWidth, Math.min(x, maxX));
  } else {
    x = Math.max(
      minX + estimatedTextWidth / 2,
      Math.min(x, maxX - estimatedTextWidth / 2)
    );
  }

  y = Math.max(minY, Math.min(y, maxY));

  return { x, y, textAnchor };
}
