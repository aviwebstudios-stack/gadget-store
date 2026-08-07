"use client";

import { useEffect, useRef, useState } from "react";

const HERO1_URL =
  "https://res.cloudinary.com/hsdynx3p/video/upload/v1786140927/hero1-compressed.mp4";
const HERO2_URL =
  "https://res.cloudinary.com/hsdynx3p/video/upload/v1786140926/hero2-compressed.mp4";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState(HERO1_URL);

  useEffect(() => {
    function updateSrc() {
      setSrc(window.innerWidth < 500 ? HERO2_URL : HERO1_URL);
    }
    updateSrc();
    window.addEventListener("resize", updateSrc);
    return () => window.removeEventListener("resize", updateSrc);
  }, []);

  // reload the video element whenever the source actually changes
  useEffect(() => {
    videoRef.current?.load();
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
