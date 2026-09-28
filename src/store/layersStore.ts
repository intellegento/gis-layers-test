import { createVedro } from "vedro";
import type { LayersState } from "../types";

/**
 * createVedro's own default state is left empty on purpose: the real
 * initial state is built from the layer config in App and supplied through
 * <LayersProvider state={...}>.
 */
export const {
  Provider: LayersProvider,
  useStore: useLayersStore,
  useSelector: useLayersSelector,
} = createVedro<LayersState>({});
