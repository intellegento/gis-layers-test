import React from "react";
import { useLayersSelector } from "../store/layersStore";
import type { LayersState } from "../types";

interface Summary {
  total: number;
  enabled: number;
  loading: number;
  error: number;
}

function computeSummary(state: LayersState): Summary {
  const layers = Object.values(state);
  return {
    total: layers.length,
    enabled: layers.filter((l) => l.enabled).length,
    loading: layers.filter((l) => l.status === "loading").length,
    error: layers.filter((l) => l.status === "error").length,
  };
}

/**
 * Demonstrates Vedro's generic `useSelector`: it derives a value from the
 * *whole* store rather than one key, which `store.on(key, cb)` cannot do.
 * That whole-state scan is fine here because it only re-renders this one
 * summary line (via the selector's JSON.stringify equality check), not the
 * 100+ individual layer rows below it.
 */
function LayersSummaryImpl() {
  const summary = useLayersSelector(computeSummary);

  return (
    <p className="layers-summary">
      Активно: {summary.enabled} / {summary.total}
      {summary.loading > 0 && <> · загружается: {summary.loading}</>}
      {summary.error > 0 && <> · с ошибкой: {summary.error}</>}
    </p>
  );
}

export const LayersSummary = React.memo(LayersSummaryImpl);
