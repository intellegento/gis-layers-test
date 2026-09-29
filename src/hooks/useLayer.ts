import { useEffect, useState } from "react";
import { useLayersStore } from "../store/layersStore";
import type { LayerId, LayerState } from "../types";

/**
 * Subscribes a component to exactly one layer.
 *
 * Vedro's built-in `useSelector` listens to a single "@state" event that
 * fires on *every* dispatch anywhere in the store, and only re-renders the
 * component when `JSON.stringify(selection)` changes. That is fine for a
 * handful of layers, but with 100+ independent `LayerItem`s it means every
 * opacity drag re-runs and re-serializes N selectors per frame just to find
 * the one that actually changed.
 *
 * Vedro's `Vedro#on(key, cb)` (the mechanism the library uses internally to
 * back `dispatch(key, value)`) instead notifies only the subscribers of that
 * one key. Using it directly turns a per-dispatch cost of O(number of
 * layers) into O(1), which is what makes this panel scale from 5 to 100+
 * layers without dropped frames.
 */
export function useLayer(layerId: LayerId): LayerState {
  const store = useLayersStore();
  const [layer, setLayer] = useState<LayerState>(() => store.get(layerId));

  useEffect(() => {
    // store.on() calls back synchronously with the current value on
    // subscribe, so this also re-syncs state if layerId changes.
    return store.on(layerId, (value) => setLayer(value));
  }, [store, layerId]);

  return layer;
}
