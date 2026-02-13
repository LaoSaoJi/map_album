"use client";

import chinaMap from "@svg-maps/china";
import { cityAlbums } from "@/data/mock-data";
import { CityAlbumPanel } from "@/components/album/city-album-panel";
import { provinceFocusLabelPlacements } from "@/components/map/constants";
import { ChinaMap } from "@/components/map/china-map";
import { ProvinceFocusOverlay } from "@/components/map/province-focus-overlay";
import { PuzzleMap } from "@/components/map/puzzle-map";
import { useMapExplorer } from "@/hooks/use-map-explorer";

export function MapExplorer() {
  const {
    activeCity,
    activeCityId,
    chinaLocations,
    focusedLabelCityId,
    focusedProvince,
    focusedProvinceCities,
    focusedProvinceId,
    focusedProvinceName,
    focusedProvinceViewBox,
    focusedProvinceViewBoxRect,
    highlightedProvinceId,
    mapDescription,
    mapMode,
    municipalities,
    provinceNameMap,
    provincePhotoCount,
    selectCity,
    setActiveCityId,
    setFocusedLabelCityId,
    setFocusedProvinceId,
    setMapMode,
    totalCount
  } = useMapExplorer();

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
                <PuzzleMap
                  activeCityId={activeCityId}
                  cityAlbums={cityAlbums}
                  mapMode={mapMode}
                  onSelectCity={selectCity}
                />

                <ChinaMap
                  activeCityId={activeCityId}
                  chinaLocations={chinaLocations}
                  highlightedProvinceId={highlightedProvinceId}
                  mapMode={mapMode}
                  municipalities={municipalities}
                  provinceNameMap={provinceNameMap}
                  provincePhotoCount={provincePhotoCount}
                  viewBox={chinaMap.viewBox}
                  onProvinceSelect={(provinceId) => {
                    setFocusedProvinceId(provinceId);
                    setFocusedLabelCityId(null);
                  }}
                  onSelectCity={selectCity}
                />
              </div>

              <ProvinceFocusOverlay
                activeCityId={activeCityId}
                focusedLabelCityId={focusedLabelCityId}
                focusedProvince={focusedProvince}
                focusedProvinceCities={focusedProvinceCities}
                focusedProvinceName={focusedProvinceName}
                focusedProvinceViewBox={focusedProvinceViewBox}
                focusedProvinceViewBoxRect={focusedProvinceViewBoxRect}
                labelPlacements={provinceFocusLabelPlacements}
                mapMode={mapMode}
                onCitySelect={(cityId) => {
                  setActiveCityId(cityId);
                  setFocusedLabelCityId(cityId);
                }}
                onClose={() => {
                  setFocusedProvinceId(null);
                  setFocusedLabelCityId(null);
                }}
              />

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

          <CityAlbumPanel activeCity={activeCity} />
        </div>
      </section>
    </main>
  );
}
