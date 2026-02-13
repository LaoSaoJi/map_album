"use client";

import chinaMap from "@svg-maps/china";
import Image from "next/image";
import { useMemo, useState } from "react";
import { cityAlbums } from "@/data/mock-data";

type MapMode = "puzzle" | "focus";

const puzzleRegionShapes = [
  { name: "东北", points: "540,120 705,95 740,170 660,228 550,190" },
  { name: "华北", points: "438,175 550,162 590,212 542,272 420,243" },
  { name: "西北", points: "280,168 448,140 427,266 280,290 228,217" },
  { name: "西南", points: "275,292 432,273 420,420 307,448 235,358" },
  { name: "华中", points: "430,272 542,275 565,357 468,397 402,358" },
  { name: "华东", points: "542,225 635,248 640,370 563,357" },
  { name: "华南", points: "466,397 562,357 632,428 517,488 422,450" }
];

const MAP_WIDTH = 774;
const MAP_HEIGHT = 569;

const cityProvinceMap: Record<string, string> = {
  shanghai: "shanghai",
  beijing: "beijing",
  guangzhou: "guangdong",
  chengdu: "sichuan",
  xian: "shaanxi"
};

function toMapPoint(percentX: number, percentY: number) {
  return {
    x: (percentX / 100) * MAP_WIDTH,
    y: (percentY / 100) * MAP_HEIGHT
  };
}

export function MapExplorer() {
  const [activeCityId, setActiveCityId] = useState("shanghai");
  const [mapMode, setMapMode] = useState<MapMode>("puzzle");
  const activeCity =
    cityAlbums.find((city) => city.id === activeCityId) ?? cityAlbums[0];
  const activeProvinceId = cityProvinceMap[activeCity.id];

  const totalCount = useMemo(
    () => cityAlbums.reduce((sum, city) => sum + city.photoCount, 0),
    []
  );

  const selectCity = (cityId: string) => {
    setActiveCityId(cityId);
    if (mapMode === "puzzle") {
      setMapMode("focus");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1280px] px-4 pb-8 pt-6 md:px-8">
      <section className="animate-rise rounded-[30px] border border-white/60 bg-white/65 p-4 shadow-card backdrop-blur md:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-moss/70">
              Geo Indexed Album
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">地图相册</h1>
            <p className="mt-2 text-sm text-ink/80 md:text-base">
              {mapMode === "puzzle"
                ? "先从拼图视角进入，再切到正式中国地图完成地点选择。"
                : "你正在正式地图视图，点击城市查看这个位置下的照片。"}
            </p>
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
                  setMapMode("focus");
                }
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                if (mapMode === "focus") {
                  setMapMode("puzzle");
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
                    mapMode === "focus"
                      ? "scale-100 opacity-100"
                      : "scale-[0.97] opacity-0 pointer-events-none"
                  }`}
                  role="img"
                  aria-label="中国地图正式视图"
                >
                  {chinaMap.locations.map(
                    (location: (typeof chinaMap.locations)[number]) => {
                    const isActiveProvince = location.id === activeProvinceId;
                    return (
                      <path
                        key={location.id}
                        d={location.path}
                        className="stroke-[#2f654d] transition-all duration-300"
                        strokeWidth={1.35}
                        fill={isActiveProvince ? "#b5e873" : "#84b965"}
                        opacity={isActiveProvince ? 0.98 : 0.86}
                      />
                    );
                  }
                  )}

                  {cityAlbums.map((city) => {
                    const isActive = city.id === activeCity.id;
                    return (
                      <g key={city.id}>
                        <circle
                          cx={city.focusX}
                          cy={city.focusY}
                          r={isActive ? 10 : 6.5}
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

              <div className="relative z-10 mt-2 text-xs text-ink/75">
                {mapMode === "puzzle"
                  ? "左键单击地图区域，切换到真实中国地图。"
                  : "左键选城市，右键返回拼图视图。"}
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
