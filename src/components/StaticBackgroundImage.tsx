"use client";

import React from "react";

interface StaticBackgroundImageProps {
  src: string;
  alt?: string;
  overlayOpacity?: string;
}

export function StaticBackgroundImage({
  src,
  alt = "Fondo",
  overlayOpacity = "bg-black/20",
}: StaticBackgroundImageProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#08090a]"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Subtle overlay to keep image bright and vivid while maintaining good text readability */}
      <div className={`absolute inset-0 ${overlayOpacity} pointer-events-none`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
}
