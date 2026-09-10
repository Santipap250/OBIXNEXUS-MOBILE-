import { useEffect, useState } from "react";
import { loadDrones, saveDrones } from "./droneStorage.js";

/**
 * Drop-in replacement for the old `usePersistentState(STORAGE_KEYS.drones, ...)`
 * call in App.jsx. Behaves the same way from a component's point of view
 * (returns [drones, setDrones]) but reads/writes through the versioned,
 * migrating droneStorage module instead of the raw generic storage get/set.
 */
export function useDroneFleet(seedDrones) {
  const [drones, setDrones] = useState(() => loadDrones(seedDrones));

  useEffect(() => {
    saveDrones(drones);
  }, [drones]);

  return [drones, setDrones];
}
