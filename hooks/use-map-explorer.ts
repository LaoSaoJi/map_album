"use client";

import chinaMap from "@svg-maps/china";
import { useMemo, useState } from "react";
import { cityAlbums } from "@/data/mock-data";
import {
  buildFocusedViewBox,
  getProvinceBBox,
  parseViewBox,
  type ProvinceBBox
} from "@/lib/map-geometry";

export type MapMode = "puzzle" | "china";

export type ChinaLocation = {
  id: string;
  name: string;
  path: string;
};

const viewBoxParts = chinaMap.viewBox.split(" ").map(Number);
const CHINA_MAP_WIDTH = viewBoxParts[2] ?? 774;
const CHINA_MAP_HEIGHT = viewBoxParts[3] ?? 569;

const chinaLocations = chinaMap.locations as ChinaLocation[];

export function useMapExplorer() {
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
      ? buildFocusedViewBox(
          provinceBBoxes[focusedProvinceId],
          CHINA_MAP_WIDTH,
          CHINA_MAP_HEIGHT
        )
      : chinaMap.viewBox;

  const focusedProvinceViewBoxRect = parseViewBox(
    focusedProvinceViewBox,
    CHINA_MAP_WIDTH,
    CHINA_MAP_HEIGHT
  );

  const mapDescription =
    mapMode === "puzzle"
      ? "先从拼图视角进入，再切到正式中国地图完成地点选择。"
      : focusedProvinceId
        ? "当前是省份放大视图，可查看省内有照片的城市。"
        : "当前是全国省份视图，省份亮暗代表是否有照片。";

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

  return {
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
  };
}
