import type { CityAlbum } from "@/data/mock-data";
import type { ChinaLocation } from "@/hooks/use-map-explorer";
import {
  getSafeLabelLayout,
  type ProvinceFocusLabelPlacement,
  type ViewBoxRect
} from "@/lib/map-geometry";

type ProvinceFocusOverlayProps = {
  activeCityId: string;
  focusedLabelCityId: string | null;
  focusedProvince: ChinaLocation | null;
  focusedProvinceCities: CityAlbum[];
  focusedProvinceName: string;
  focusedProvinceViewBox: string;
  focusedProvinceViewBoxRect: ViewBoxRect;
  labelPlacements: Record<string, ProvinceFocusLabelPlacement>;
  mapMode: "puzzle" | "china";
  onCitySelect: (cityId: string) => void;
  onClose: () => void;
};

export function ProvinceFocusOverlay({
  activeCityId,
  focusedLabelCityId,
  focusedProvince,
  focusedProvinceCities,
  focusedProvinceName,
  focusedProvinceViewBox,
  focusedProvinceViewBoxRect,
  labelPlacements,
  mapMode,
  onCitySelect,
  onClose
}: ProvinceFocusOverlayProps) {
  if (!(mapMode === "china" && focusedProvince)) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#112b1b]/25 px-3 backdrop-blur-[1.2px]">
      <section
        className="animate-rise w-full max-w-[560px] rounded-2xl border border-white/55 bg-[#f6ffe8]/95 p-4 shadow-card"
        onClick={(event) => event.stopPropagation()}
        onContextMenu={(event) => {
          event.preventDefault();
          onClose();
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
            const isActive = city.id === activeCityId;
            const showLabel = focusedLabelCityId === city.id;
            const labelPlacement = labelPlacements[city.id] ?? {
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
                  onClick={() => onCitySelect(city.id)}
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
  );
}
