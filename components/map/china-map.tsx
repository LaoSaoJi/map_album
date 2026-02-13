import type { CityAlbum } from "@/data/mock-data";
import type { ChinaLocation, MapMode } from "@/hooks/use-map-explorer";

type ChinaMapProps = {
  activeCityId: string;
  chinaLocations: ChinaLocation[];
  highlightedProvinceId: string;
  mapMode: MapMode;
  municipalities: CityAlbum[];
  provinceNameMap: Record<string, string>;
  provincePhotoCount: Record<string, number>;
  viewBox: string;
  onProvinceSelect: (provinceId: string) => void;
  onSelectCity: (cityId: string) => void;
};

export function ChinaMap({
  activeCityId,
  chinaLocations,
  highlightedProvinceId,
  mapMode,
  municipalities,
  provinceNameMap,
  provincePhotoCount,
  viewBox,
  onProvinceSelect,
  onSelectCity
}: ChinaMapProps) {
  return (
    <svg
      viewBox={viewBox}
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
              onProvinceSelect(location.id);
            }}
          >
            <title>{`${provinceNameMap[location.id] ?? location.name} · ${photoCount} photos`}</title>
          </path>
        );
      })}

      {municipalities.map((city) => {
        const isActive = city.id === activeCityId;
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
                onSelectCity(city.id);
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
  );
}
