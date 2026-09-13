"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

const MAIN_IMAGE_SIZES = "(min-width: 900px) 45vw, 100vw";

// El componente client solo recibe URLs ya resueltas (`urlForImage` vive en
// el server: arrastra el cliente de Sanity, que a su vez lee el token de
// lectura). Pasarle la referencia de imagen en vez de la URL terminaria
// empaquetando ese cliente -y el secreto- en el bundle del navegador.
export type GalleryImage = {
  key: string;
  mainSrc: string;
  thumbSrc: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
  badge?: ReactNode;
};

export function ProductGallery({
  images,
  productName,
  badge,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-[100px]">
      {badge}
      <div className="thumb-surface relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md border border-line">
        {selectedImage ? (
          <Image
            src={selectedImage.mainSrc}
            alt={productName}
            fill
            sizes={MAIN_IMAGE_SIZES}
            priority
            className="object-contain"
          />
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="flex gap-[10px]">
          {images.map((image, index) => (
            <button
              key={image.key}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ver foto ${index + 1} de ${productName}`}
              aria-pressed={index === selectedIndex}
              className={`thumb-surface relative h-20 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-colors ${
                index === selectedIndex
                  ? "border-[1.5px] border-brand-gold"
                  : "border-line"
              }`}
            >
              <Image
                src={image.thumbSrc}
                alt=""
                fill
                sizes="64px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
