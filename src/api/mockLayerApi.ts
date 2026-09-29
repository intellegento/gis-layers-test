import type { LayerId } from "../types";

const MIN_DELAY_MS = 500;
const MAX_DELAY_MS = 1600;
const FAILURE_RATE = 0.3;

/** Simulates fetching data for a map layer: random delay, ~30% failures. */
export function fetchLayerData(layerId: LayerId): Promise<void> {
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error(`Не удалось загрузить слой «${layerId}»`));
      } else {
        resolve();
      }
    }, delay);
  });
}
