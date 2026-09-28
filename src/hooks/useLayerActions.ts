import { useCallback } from "react";
import { useLayersStore } from "../store/layersStore";
import type { LayerId } from "../types";

export function useLayerActions() {
  const store = useLayersStore();

  const toggleLayer = useCallback(
    (layerId: LayerId, enabled: boolean) => {
      const current = store.get(layerId);
      store.dispatch(layerId, { ...current, enabled });
    },
    [store]
  );

  const setOpacity = useCallback(
    (layerId: LayerId, opacity: number) => {
      const current = store.get(layerId);
      store.dispatch(layerId, { ...current, opacity });
    },
    [store]
  );

  return { toggleLayer, setOpacity };
}
