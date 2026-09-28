export type LayerId = string;

export type LayerStatus = "idle" | "loading" | "success" | "error";

export interface LayerDefinition {
  id: LayerId;
  name: string;
}

export interface LayerState {
  id: LayerId;
  name: string;
  enabled: boolean;
  /** 0..1 */
  opacity: number;
  status: LayerStatus;
  error?: string;
}

/**
 * The whole store is a flat dictionary keyed by layer id rather than an
 * array. Vedro dispatches by top-level key ("dispatch(layerId, value)"),
 * so keeping layers normalized this way means updating one layer is an O(1)
 * key write instead of an array scan + copy, which matters once there are
 * 100+ layers.
 */
export type LayersState = Record<LayerId, LayerState>;
