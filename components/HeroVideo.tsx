"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState("/hero1.mp4");

  useEffect(() => {
    function updateSrc() {
      setSrc(window.innerWidth < 500 ? "/hero2.mp4" : "/hero1.mp4");
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
