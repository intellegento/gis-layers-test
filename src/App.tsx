import { useMemo } from "react";
import { LayersProvider } from "./store/layersStore";
import { LayerControlPanel } from "./components/LayerControlPanel";
import { LAYERS } from "./config/layers";
import type { LayersState } from "./types";

function buildInitialState(): LayersState {
  return LAYERS.reduce<LayersState>((state, def) => {
    state[def.id] = {
      id: def.id,
      name: def.name,
      enabled: false,
      opacity: 1,
      status: "idle",
    };
    return state;
  }, {});
}

const LAYER_IDS = LAYERS.map((layer) => layer.id);

export function App() {
  const initialState = useMemo(buildInitialState, []);

  return (
    <div className="app">
      <h1>Управление картографическими слоями</h1>
      <LayersProvider state={initialState}>
        <LayerControlPanel layerIds={LAYER_IDS} />
      </LayersProvider>
    </div>
  );
}
