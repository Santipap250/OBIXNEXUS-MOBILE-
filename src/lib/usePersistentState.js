import { useState, useEffect } from "react";
import { storage } from "./storage.js";

// Drop-in replacement for useState that reads its initial value from
// local storage and writes every update back. Used for anything that
// should survive a page refresh (fleet, pilot profile, language, etc.)
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => storage.get(key, initialValue));

  useEffect(() => {
    storage.set(key, value);
  }, [key, value]);

  return [value, setValue];
}
