import type { CityAlbum } from "@/data/mock-data";
import { puzzleRegionShapes } from "@/components/map/constants";

type PuzzleMapProps = {
  activeCityId: string;
  cityAlbums: CityAlbum[];
  mapMode: "puzzle" | "china";
  onSelectCity: (cityId: string) => void;
};

export function PuzzleMap({
  activeCityId,
  cityAlbums,
  mapMode,
  onSelectCity
}: PuzzleMapProps) {
  return (
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
        const isActive = city.id === activeCityId;
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
                onSelectCity(city.id);
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
  );
}
