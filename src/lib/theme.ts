import { useEffect, useState } from "react";

export function useTheme() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);
  const toggle = () => {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("nexus-theme", next ? "light" : "dark");
    setLight(next);
  };
  return { light, toggle };
}
