import { useState, useEffect } from "react";

export const useOrigin = () => {
  // state for the origin of the app
  const [mounted, setMounted] = useState(false);

  // We need to wait for the window object to be available
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "";

  return origin;
};
