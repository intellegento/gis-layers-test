import { useCallback } from "react";
import { useLayersStore } from "../store/layersStore";
import { fetchLayerData } from "../api/mockLayerApi";
import type { LayerId } from "../types";

export function useLayerActions() {
  const store = useLayersStore();

  const loadLayer = useCallback(
    (layerId: LayerId) => {
      const current = store.get(layerId);
      store.dispatch(layerId, { ...current, status: "loading", error: undefined });

      fetchLayerData(layerId)
        .then(() => {
          const latest = store.get(layerId);
          store.dispatch(layerId, { ...latest, status: "success", error: undefined });
        })
        .catch((err: unknown) => {
          const latest = store.get(layerId);
          store.dispatch(layerId, {
            ...latest,
            status: "error",
            error: err instanceof Error ? err.message : "Неизвестная ошибка",
          });
        });
    },
    [store]
  );

  const toggleLayer = useCallback(
    (layerId: LayerId, enabled: boolean) => {
      const current = store.get(layerId);
      store.dispatch(layerId, { ...current, enabled });

      if (enabled) {
        loadLayer(layerId);
      } else {
        const latest = store.get(layerId);
        store.dispatch(layerId, { ...latest, status: "idle", error: undefined });
      }
    },
    [store, loadLayer]
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
