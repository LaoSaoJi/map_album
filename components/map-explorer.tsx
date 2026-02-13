"use client";

import chinaMap from "@svg-maps/china";
import Image from "next/image";
import { useMemo, useState } from "react";
import { cityAlbums } from "@/data/mock-data";

type MapMode = "puzzle" | "china";

type ProvinceBBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

type ChinaLocation = {
  id: string;
  name: string;
  path: string;
};

type ProvinceFocusLabelPlacement = {
  dx: number;
  dy: number;
  textAnchor: "start" | "middle" | "end";
};

type ViewBoxRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const puzzleRegionShapes = [
  { name: "东北", points: "540,120 705,95 740,170 660,228 550,190" },
  { name: "华北", points: "438,175 550,162 590,212 542,272 420,243" },
  { name: "西北", points: "280,168 448,140 427,266 280,290 228,217" },
  { name: "西南", points: "275,292 432,273 420,420 307,448 235,358" },
  { name: "华中", points: "430,272 542,275 565,357 468,397 402,358" },
  { name: "华东", points: "542,225 635,248 640,370 563,357" },
  { name: "华南", points: "466,397 562,357 632,428 517,488 422,450" }
];

const provinceFocusLabelPlacements: Record<string, ProvinceFocusLabelPlacement> = {
  xian: { dx: 4.6, dy: -4.7, textAnchor: "start" },
  baoji: { dx: -6.2, dy: -4.9, textAnchor: "end" }
};

const viewBoxParts = chinaMap.viewBox.split(" ").map(Number);
const CHINA_MAP_WIDTH = viewBoxParts[2] ?? 774;
const CHINA_MAP_HEIGHT = viewBoxParts[3] ?? 569;
const chinaLocations = chinaMap.locations as ChinaLocation[];

function parseProvincePath(path: string): Array<[number, number]> {
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

function getProvinceBBox(path: string): ProvinceBBox | null {
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

function buildFocusedViewBox(bbox: ProvinceBBox, padding = 12) {
  const minX = Math.max(0, bbox.minX - padding);
  const minY = Math.max(0, bbox.minY - padding);
  const maxX = Math.min(CHINA_MAP_WIDTH, bbox.maxX + padding);
  const maxY = Math.min(CHINA_MAP_HEIGHT, bbox.maxY + padding);

  return `${minX} ${minY} ${Math.max(1, maxX - minX)} ${Math.max(1, maxY - minY)}`;
}

function parseViewBox(viewBox: string): ViewBoxRect {
  const [x = 0, y = 0, width = CHINA_MAP_WIDTH, height = CHINA_MAP_HEIGHT] = viewBox
    .split(" ")
    .map(Number);
  return { x, y, width, height };
}

function getSafeLabelLayout(
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

export function MapExplorer() {
  const [activeCityId, setActiveCityId] = useState("shanghai");
  const [mapMode, setMapMode] = useState<MapMode>("puzzle");
  const [focusedProvinceId, setFocusedProvinceId] = useState<string | null>(null);
  const [focusedLabelCityId, setFocusedLabelCityId] = useState<string | null>(null);

  const activeCity =
    cityAlbums.find((city) => city.id === activeCityId) ?? cityAlbums[0];

  const activeProvinceId = activeCity.provinceId;
  const highlightedProvinceId = focusedProvinceId ?? activeProvinceId;

  const totalCount = useMemo(
    () => cityAlbums.reduce((sum, city) => sum + city.photoCount, 0),
    []
  );

  const provincePhotoCount = useMemo(() => {
    const countMap: Record<string, number> = {};
    for (const city of cityAlbums) {
      countMap[city.provinceId] = (countMap[city.provinceId] ?? 0) + city.photoCount;
    }
    return countMap;
  }, []);

  const provinceNameMap = useMemo(() => {
    const nameMap: Record<string, string> = {};
    for (const city of cityAlbums) {
      nameMap[city.provinceId] = city.provinceName;
    }
    return nameMap;
  }, []);

  const municipalities = useMemo(
    () => cityAlbums.filter((city) => city.isMunicipality),
    []
  );

  const provinceBBoxes = useMemo(() => {
    const bboxMap: Record<string, ProvinceBBox> = {};
    for (const province of chinaLocations) {
      const bbox = getProvinceBBox(province.path);
      if (bbox) {
        bboxMap[province.id] = bbox;
      }
    }
    return bboxMap;
  }, []);

  const focusedProvince = useMemo(
    () => chinaLocations.find((location) => location.id === focusedProvinceId) ?? null,
    [focusedProvinceId]
  );

  const focusedProvinceCities = useMemo(() => {
    if (!focusedProvinceId) {
      return [];
    }
    return cityAlbums.filter(
      (city) => city.provinceId === focusedProvinceId && city.photoCount > 0
    );
  }, [focusedProvinceId]);

  const focusedProvinceName =
    (focusedProvinceId ? provinceNameMap[focusedProvinceId] : undefined) ??
    focusedProvince?.name ??
    "省份";

  const focusedProvinceViewBox =
    focusedProvinceId && provinceBBoxes[focusedProvinceId]
      ? buildFocusedViewBox(provinceBBoxes[focusedProvinceId])
      : chinaMap.viewBox;
  const focusedProvinceViewBoxRect = parseViewBox(focusedProvinceViewBox);

  const selectCity = (cityId: string) => {
    const city = cityAlbums.find((item) => item.id === cityId);
    if (!city) {
      return;
    }

    setActiveCityId(cityId);

    if (mapMode === "puzzle") {
      setMapMode("china");
    }

    setFocusedLabelCityId(null);

    if (city.isMunicipality) {
      setFocusedProvinceId(null);
    } else {
      setFocusedProvinceId(city.provinceId);
    }
  };

  const mapDescription =
    mapMode === "puzzle"
      ? "先从拼图视角进入，再切到正式中国地图完成地点选择。"
      : focusedProvinceId
        ? "当前是省份放大视图，可查看省内有照片的城市。"
        : "当前是全国省份视图，省份亮暗代表是否有照片。";

  return (
    <main className="mx-auto min-h-screen max-w-[1280px] px-4 pb-8 pt-6 md:px-8">
      <section className="animate-rise rounded-[30px] border border-white/60 bg-white/65 p-4 shadow-card backdrop-blur md:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-moss/70">
              Geo Indexed Album
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">地图相册</h1>
            <p className="mt-2 text-sm text-ink/80 md:text-base">{mapDescription}</p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-moss/90 px-4 py-3 text-cloud">
            <span className="rounded-full bg-citrus px-3 py-1 text-xs font-semibold text-ink">
              {totalCount}
            </span>
            <span className="text-sm">总照片数</span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <section className="rounded-[26px] border border-moss/20 bg-[#f2fae2] p-4 md:p-6">
            <div
              className="relative overflow-hidden rounded-3xl border border-moss/20 bg-gradient-to-b from-[#c2e795] to-[#9fd079] p-2 md:p-5"
              onClick={() => {
                if (mapMode === "puzzle") {
                  setMapMode("china");
                  setFocusedProvinceId(null);
                  setFocusedLabelCityId(null);
                }
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                if (mapMode === "china" && focusedProvinceId) {
                  setFocusedProvinceId(null);
                  setFocusedLabelCityId(null);
                  return;
                }
                if (mapMode === "china") {
                  setMapMode("puzzle");
                  setFocusedLabelCityId(null);
                }
              }}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full bg-[linear-gradient(transparent_34px,#2a644322_35px),linear-gradient(90deg,transparent_34px,#2a644322_35px)] bg-[size:36px_36px]" />
              </div>

              <div className="relative h-[380px] md:h-[520px]">
                <svg
                  viewBox="180 70 620 470"
                  className={`absolute inset-0 h-full w-full transition-all duration-500 ${
                    mapMode === "puzzle"
                      ? "scale-100 opacity-100"
                      : "scale-[1.03] opacity-0 pointer-events-none"
                  }`}
                  role="img"
                  aria-label="中国地图拼图视图"
                >
                  {puzzleRegionShapes.map((region, idx) => (
                    <polygon
                      key={region.name}
                      points={region.points}
                      className="fill-[#7db35f] stroke-[#2f654d] stroke-2"
                      style={{
                        opacity: 0.72 + idx * 0.03,
                        filter: "drop-shadow(0 8px 15px rgba(24, 58, 39, 0.2))"
                      }}
                    />
                  ))}

                  {cityAlbums.map((city) => {
                    const isActive = city.id === activeCity.id;
                    return (
                      <g key={city.id}>
                        <circle
                          cx={`${city.x}%`}
                          cy={`${city.y}%`}
                          r={isActive ? 10 : 7}
                          className="cursor-pointer fill-[#f9fff4] stroke-[#0d3c2e]"
                          strokeWidth={isActive ? 4 : 3}
                          onClick={(event) => {
                            event.stopPropagation();
                            selectCity(city.id);
                          }}
                        />
                        <text
                          x={`${city.x + 1.2}%`}
                          y={`${city.y - 1.5}%`}
                          className="select-none fill-[#112f22] text-[20px] font-bold"
                        >
                          {city.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <svg
                  viewBox={chinaMap.viewBox}
                  className={`absolute inset-0 h-full w-full transition-all duration-500 ${
                    mapMode === "china"
                      ? "scale-100 opacity-100"
                      : "scale-[0.97] opacity-0 pointer-events-none"
                  }`}
                  role="img"
                  aria-label="中国地图正式视图"
                >
                  {chinaLocations.map((location) => {
                      const isHighlighted = location.id === highlightedProvinceId;
                      const photoCount = provincePhotoCount[location.id] ?? 0;
                      const hasPhotos = photoCount > 0;

                      let fillColor = "#97a79e";
                      if (hasPhotos) {
                        fillColor = "#86c86f";
                      }
                      if (isHighlighted) {
                        fillColor = hasPhotos ? "#d4ff7a" : "#ccd4cf";
                      }

                      return (
                        <path
                          key={location.id}
                          d={location.path}
                          className={`cursor-pointer transition-all duration-300 ${
                            isHighlighted ? "province-active-float" : ""
                          }`}
                          stroke={isHighlighted ? "#123f30" : "#2f654d"}
                          strokeWidth={isHighlighted ? 2.2 : 1.2}
                          fill={fillColor}
                          opacity={hasPhotos ? 0.93 : 0.72}
                          onClick={(event) => {
                            event.stopPropagation();
                            setFocusedProvinceId(location.id);
                            setFocusedLabelCityId(null);
                          }}
                        >
                          <title>{`${provinceNameMap[location.id] ?? location.name} · ${photoCount} photos`}</title>
                        </path>
                      );
                    })}

                  {municipalities.map((city) => {
                    const isActive = city.id === activeCity.id;
                    return (
                      <g key={city.id}>
                        <circle
                          cx={city.focusX}
                          cy={city.focusY}
                          r={isActive ? 10 : 7}
                          className="cursor-pointer fill-[#fcfff4] stroke-[#0e3d2d]"
                          strokeWidth={isActive ? 4 : 2.8}
                          onClick={(event) => {
                            event.stopPropagation();
                            selectCity(city.id);
                          }}
                        />
                        <text
                          x={city.focusX + 8}
                          y={city.focusY - 9}
                          className="select-none fill-[#112f22] text-[18px] font-semibold"
                        >
                          {city.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {mapMode === "china" && focusedProvince && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#112b1b]/25 px-3 backdrop-blur-[1.2px]">
                  <section
                    className="animate-rise w-full max-w-[560px] rounded-2xl border border-white/55 bg-[#f6ffe8]/95 p-4 shadow-card"
                    onClick={(event) => event.stopPropagation()}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setFocusedProvinceId(null);
                      setFocusedLabelCityId(null);
                    }}
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-moss/70">
                          Province Focus
                        </p>
                        <h3 className="text-lg font-bold text-ink">{focusedProvinceName}</h3>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-ink/80">
                        {focusedProvinceCities.length} 个有照片的城市
                      </span>
                    </div>

                    <svg
                      viewBox={focusedProvinceViewBox}
                      className="h-[250px] w-full rounded-xl border border-moss/15 bg-[#e9f8d7] md:h-[320px]"
                      role="img"
                      aria-label={`${focusedProvinceName}放大地图`}
                    >
                      <path
                        d={focusedProvince.path}
                        fill="#d4ff7a"
                        stroke="#134231"
                        strokeWidth={1.15}
                        opacity={0.98}
                      />

                      {focusedProvinceCities.map((city) => {
                        const isActive = city.id === activeCity.id;
                        const showLabel = focusedLabelCityId === city.id;
                        const labelPlacement = provinceFocusLabelPlacements[city.id] ?? {
                          dx: 3.2,
                          dy: -3.3,
                          textAnchor: "start" as const
                        };
                        const safeLabelLayout = getSafeLabelLayout(
                          city.name,
                          city.focusX,
                          city.focusY,
                          labelPlacement,
                          focusedProvinceViewBoxRect
                        );
                        return (
                          <g key={city.id}>
                            <circle
                              cx={city.focusX}
                              cy={city.focusY}
                              r={isActive ? 3.6 : 2.4}
                              className="cursor-pointer fill-[#f8fff0] stroke-[#113b2d]"
                              strokeWidth={isActive ? 1.5 : 1}
                              onClick={() => {
                                setActiveCityId(city.id);
                                setFocusedLabelCityId(city.id);
                              }}
                            />
                            {showLabel ? (
                              <text
                                x={safeLabelLayout.x}
                                y={safeLabelLayout.y}
                                textAnchor={safeLabelLayout.textAnchor}
                                className="select-none fill-[#143326] text-[7px] font-semibold"
                              >
                                {city.name}
                              </text>
                            ) : null}
                          </g>
                        );
                      })}
                    </svg>

                    <p className="mt-2 text-xs text-ink/70">
                      右键关闭省份放大视图，继续在全国图选择其他省份。
                    </p>
                  </section>
                </div>
              )}

              <div className="relative z-10 mt-2 text-xs text-ink/75">
                {mapMode === "puzzle"
                  ? "左键单击地图区域，切换到真实中国地图。"
                  : focusedProvinceId
                    ? "省份已放大：点击圆点显示城市标签。"
                    : "全国图中只显示直辖市城市点；点击任意省份可放大查看。"}
              </div>

              <div className="relative z-10 mt-2 flex items-center gap-3 text-[11px] text-ink/70">
                <span className="inline-flex items-center gap-1">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#86c86f]" />有照片省份
                </span>
                <span className="inline-flex items-center gap-1">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#97a79e]" />无照片省份
                </span>
              </div>

              <div className="relative z-10 mt-3 flex flex-wrap gap-2 text-xs text-ink/80">
                {cityAlbums.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      selectCity(city.id);
                    }}
                    className={`rounded-full px-4 py-2 transition ${
                      activeCity.id === city.id
                        ? "bg-ink text-cloud"
                        : "bg-white/70 hover:bg-white"
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[26px] border border-moss/20 bg-[#fbfff2] p-4 md:p-5">
            <div className="mb-4 overflow-hidden rounded-2xl">
              <Image
                src={activeCity.cover}
                alt={activeCity.name}
                width={900}
                height={420}
                className="h-[170px] w-full object-cover"
              />
            </div>

            <div className="mb-4 flex items-end justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-moss/70">
                  {activeCity.englishName}
                </p>
                <h2 className="text-2xl font-bold">{activeCity.name}</h2>
              </div>
              <span className="rounded-full bg-citrus px-3 py-1 text-xs font-semibold text-ink">
                {activeCity.photoCount} photos
              </span>
            </div>

            <div className="mb-3 rounded-xl bg-moss/10 px-3 py-2 text-xs text-ink/75">
              {activeCity.provinceName} / 城市相册
            </div>

            <div className="grid max-h-[460px] grid-cols-2 gap-3 overflow-auto pr-1">
              {activeCity.photos.map((photo, index) => (
                <article
                  key={photo.id}
                  className="animate-rise overflow-hidden rounded-2xl border border-moss/10 bg-white"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    width={700}
                    height={500}
                    className="h-28 w-full object-cover"
                  />
                  <div className="space-y-1 p-3">
                    <h3 className="text-sm font-semibold">{photo.title}</h3>
                    <p className="text-xs text-ink/60">{photo.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
