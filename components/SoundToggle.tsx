"use client";

import { useRef, useState } from "react";

export function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/ambient.mp3" loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause ambient sound" : "Play ambient sound"}
       className="relative flex h-10 w-20 items-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        <span
          className={`absolute flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ease-out ${
            playing ? "translate-x-10" : "translate-x-0"
          }`}
        >
          {playing ? (
            <svg width="13" height="13" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="0.5" width="2.5" height="9" fill="black" />
              <rect x="6" y="0.5" width="2.5" height="9" fill="black" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 10 10" fill="none">
              <path d="M1 0.5L9 5L1 9.5V0.5Z" fill="black" />
            </svg>
          )}
        </span>
      </button>
    </>
  );
}