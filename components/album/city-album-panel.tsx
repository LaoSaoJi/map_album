import Image from "next/image";
import type { CityAlbum } from "@/data/mock-data";

type CityAlbumPanelProps = {
  activeCity: CityAlbum;
};

export function CityAlbumPanel({ activeCity }: CityAlbumPanelProps) {
  return (
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
  );
}
