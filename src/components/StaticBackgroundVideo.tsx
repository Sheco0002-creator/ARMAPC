"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface StaticBackgroundVideoProps {
  src: string;
  overlayOpacity?: string;
  showGradient?: boolean;
  crossfadeDuration?: number; // Duración de la transición en segundos
}

type CrossfadePhase =
  | "A_ACTIVE"     // Video A de fondo al 100% (z-10), Video B en espera oculta (z-0, op-0)
  | "FADING_TO_B"  // Video A fijo al 100% (z-10), Video B fundiéndose encima a 100% (z-20)
  | "B_ACTIVE"     // Video B de fondo al 100% (z-10), Video A en espera oculta (z-0, op-0)
  | "FADING_TO_A"; // Video B fijo al 100% (z-10), Video A fundiéndose encima a 100% (z-20)

export function StaticBackgroundVideo({
  src,
  overlayOpacity = "bg-black/30",
  showGradient = false,
  crossfadeDuration = 1.5,
}: StaticBackgroundVideoProps) {
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);

  const [phase, setPhase] = useState<CrossfadePhase>("A_ACTIVE");
  const isTransitioningRef = useRef(false);

  // Asegura propiedades de autoplay mudo exigidas por navegadores
  const setupVideo = (video: HTMLVideoElement | null) => {
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
  };

  useEffect(() => {
    const videoA = videoRefA.current;
    const videoB = videoRefB.current;

    setupVideo(videoA);
    setupVideo(videoB);

    if (videoA) {
      videoA.play().catch(() => {
        if (videoA) {
          videoA.muted = true;
          videoA.play().catch(() => {});
        }
      });
    }
  }, [src]);

  // Ejecución de la transición cruzada sin oscurecimiento
  const triggerCrossfade = useCallback(
    (target: "B" | "A") => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const incoming = target === "B" ? videoRefB.current : videoRefA.current;
      const outgoing = target === "B" ? videoRefA.current : videoRefB.current;

      if (!incoming) {
        isTransitioningRef.current = false;
        return;
      }

      setupVideo(incoming);
      incoming.currentTime = 0;

      incoming
        .play()
        .then(() => {
          // Iniciamos la fase donde el entrante se funde POR ENCIMA del actual (que sigue al 100%)
          setPhase(target === "B" ? "FADING_TO_B" : "FADING_TO_A");

          setTimeout(() => {
            // Cuando el video entrante llega al 100%, toma la base y el saliente pasa a espera
            setPhase(target === "B" ? "B_ACTIVE" : "A_ACTIVE");
            if (outgoing) {
              outgoing.pause();
              outgoing.currentTime = 0;
            }
            isTransitioningRef.current = false;
          }, crossfadeDuration * 1000 + 100);
        })
        .catch(() => {
          isTransitioningRef.current = false;
        });
    },
    [crossfadeDuration]
  );

  // Monitoreo del video activo para disparar el bucle justo antes de terminar
  const handleTimeUpdate = (player: "A" | "B") => {
    if (isTransitioningRef.current) return;

    if (player === "A" && phase === "A_ACTIVE") {
      const v = videoRefA.current;
      if (!v || !v.duration || isNaN(v.duration)) return;
      if (v.duration - v.currentTime <= crossfadeDuration + 0.2) {
        triggerCrossfade("B");
      }
    } else if (player === "B" && phase === "B_ACTIVE") {
      const v = videoRefB.current;
      if (!v || !v.duration || isNaN(v.duration)) return;
      if (v.duration - v.currentTime <= crossfadeDuration + 0.2) {
        triggerCrossfade("A");
      }
    }
  };

  const handleEnded = (player: "A" | "B") => {
    if (player === "A" && phase === "A_ACTIVE") {
      triggerCrossfade("B");
    } else if (player === "B" && phase === "B_ACTIVE") {
      triggerCrossfade("A");
    }
  };

  // Cálculo de opacidades y z-index:
  // - El video base SIEMPRE está al 100% de opacidad en zIndex 10.
  // - El video entrante se anima de 0 a 1 en zIndex 20 (por encima).
  // - De esta forma NUNCA se transparenta el contenedor negro del fondo.
  const isAFadingIn = phase === "FADING_TO_A";
  const isBFadingIn = phase === "FADING_TO_B";
  const isAActive = phase === "A_ACTIVE" || phase === "FADING_TO_B";
  const isBActive = phase === "B_ACTIVE" || phase === "FADING_TO_A";

  const styleA: React.CSSProperties = {
    opacity: isAActive || isAFadingIn ? 1 : 0,
    zIndex: isAFadingIn ? 20 : isAActive ? 10 : 0,
    transition: `opacity ${crossfadeDuration}s ease-in-out`,
  };

  const styleB: React.CSSProperties = {
    opacity: isBActive || isBFadingIn ? 1 : 0,
    zIndex: isBFadingIn ? 20 : isBActive ? 10 : 0,
    transition: `opacity ${crossfadeDuration}s ease-in-out`,
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#08090a] print:hidden"
    >
      {/* Reproductor A */}
      <video
        ref={videoRefA}
        muted
        playsInline
        preload="auto"
        src={src}
        onTimeUpdate={() => handleTimeUpdate("A")}
        onEnded={() => handleEnded("A")}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={styleA}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Reproductor B */}
      <video
        ref={videoRefB}
        muted
        playsInline
        preload="auto"
        src={src}
        onTimeUpdate={() => handleTimeUpdate("B")}
        onEnded={() => handleEnded("B")}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={styleB}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Velo oscuro uniforme al 30% */}
      <div className={`absolute inset-0 ${overlayOpacity} pointer-events-none z-30`} />

      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none z-30" />
      )}
    </div>
  );
}
