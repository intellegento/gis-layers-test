import { useCallback, useRef } from "react";
import { useLayersStore } from "../store/layersStore";
import { fetchLayerData } from "../api/mockLayerApi";
import type { LayerId } from "../types";

/**
 * Encapsulates every state transition for layers: toggling, changing
 * opacity, loading data and retrying after an error.
 *
 * Race conditions (fast on/off/on toggling, or hammering retry) are guarded
 * on two independent levels, because relying on either alone has a gap:
 *
 * 1. AbortController — cancels the in-flight mock request itself, so a
 *    superseded request actually stops "in flight" instead of just having
 *    its result ignored.
 * 2. A per-layer sequence number kept in a ref (outside React state, so
 *    bumping it never triggers a render) — guards against the response of
 *    an aborted/overtaken request still applying its result if it happens
 *    to settle before the abort is observed.
 *
 * `store.get(layerId)` is read fresh at the moment each async step settles
 * rather than captured from a render closure, so a merge always starts from
 * the latest committed state instead of a possibly-stale snapshot.
 */
export function useLayerActions() {
  const store = useLayersStore();
  const controllers = useRef(new Map<LayerId, AbortController>());
  const sequence = useRef(new Map<LayerId, number>());

  const bumpSequence = useCallback((layerId: LayerId): number => {
    const next = (sequence.current.get(layerId) ?? 0) + 1;
    sequence.current.set(layerId, next);
    return next;
  }, []);

  const loadLayer = useCallback(
    (layerId: LayerId) => {
      controllers.current.get(layerId)?.abort();
      const controller = new AbortController();
      controllers.current.set(layerId, controller);
      const requestSeq = bumpSequence(layerId);

      const current = store.get(layerId);
      store.dispatch(layerId, { ...current, status: "loading", error: undefined });

      fetchLayerData(layerId, controller.signal)
        .then(() => {
          if (sequence.current.get(layerId) !== requestSeq) return; // superseded
          const latest = store.get(layerId);
          store.dispatch(layerId, { ...latest, status: "success", error: undefined });
        })
        .catch((err: unknown) => {
          const wasAborted = err instanceof DOMException && err.name === "AbortError";
          if (wasAborted) return; // cancelled deliberately, nothing to show the user
          if (sequence.current.get(layerId) !== requestSeq) return; // superseded

          const latest = store.get(layerId);
          store.dispatch(layerId, {
            ...latest,
            status: "error",
            error: err instanceof Error ? err.message : "Неизвестная ошибка",
          });
        });
    },
    [store, bumpSequence]
  );

  const toggleLayer = useCallback(
    (layerId: LayerId, enabled: boolean) => {
      const current = store.get(layerId);
      store.dispatch(layerId, { ...current, enabled });

      if (enabled) {
        loadLayer(layerId);
        return;
      }

      // Turning a layer off invalidates any request still in flight for it.
      controllers.current.get(layerId)?.abort();
      bumpSequence(layerId);
      const latest = store.get(layerId);
      store.dispatch(layerId, { ...latest, status: "idle", error: undefined });
    },
    [store, loadLayer, bumpSequence]
  );

  const setOpacity = useCallback(
    (layerId: LayerId, opacity: number) => {
      const current = store.get(layerId);
      store.dispatch(layerId, { ...current, opacity });
    },
    [store]
  );

  const retryLayer = useCallback(
    (layerId: LayerId) => {
      loadLayer(layerId);
    },
    [loadLayer]
  );

  return { toggleLayer, setOpacity, retryLayer };
}
