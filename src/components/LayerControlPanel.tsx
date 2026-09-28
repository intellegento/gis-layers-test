import React from "react";
import { LayerItem } from "./LayerItem";
import type { LayerId } from "../types";

interface LayerControlPanelProps {
  layerIds: LayerId[];
}

function LayerControlPanelImpl({ layerIds }: LayerControlPanelProps) {
  return (
    <section className="layer-control-panel">
      <ul className="layer-control-panel__list">
        {layerIds.map((id) => (
          <LayerItem key={id} layerId={id} />
        ))}
      </ul>
    </section>
  );
}

export const LayerControlPanel = React.memo(LayerControlPanelImpl);
