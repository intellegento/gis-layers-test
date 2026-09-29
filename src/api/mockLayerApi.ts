import type { LayerId } from "../types";

const MIN_DELAY_MS = 500;
const MAX_DELAY_MS = 1600;
const FAILURE_RATE = 0.3;

function randomDelay(): number {
  return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
}

/**
 * Simulates fetching data for a map layer from a backend/tile service.
 * Resolves on success, rejects with a regular Error on a simulated server
 * failure, and rejects with a DOMException("AbortError") when `signal` is
 * aborted — mirroring the real behaviour of `fetch`, so calling code can
 * tell "server said no" apart from "we cancelled it" and react accordingly.
 */
export function fetchLayerData(layerId: LayerId, signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = window.setTimeout(() => {
      cleanup();
      if (Math.random() < FAILURE_RATE) {
        reject(new Error(`Не удалось загрузить слой «${layerId}»`));
      } else {
        resolve();
      }
    }, randomDelay());

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    function cleanup() {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onAbort);
    }

    signal?.addEventListener("abort", onAbort);
  });
}
