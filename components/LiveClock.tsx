"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setTime(formatted);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs tracking-widest text-white/70">
      LAGOS: {time}
    </span>
  );
}
