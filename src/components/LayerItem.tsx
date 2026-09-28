import React from "react";
import { useLayersSelector } from "../store/layersStore";
import { useLayerActions } from "../hooks/useLayerActions";
import type { LayerId } from "../types";

interface LayerItemProps {
  layerId: LayerId;
}

function LayerItemImpl({ layerId }: LayerItemProps) {
  const layer = useLayersSelector((state) => state[layerId]);
  const { toggleLayer, setOpacity } = useLayerActions();

  return (
    <li className="layer-item">
      <div className="layer-item__row">
        <label className="layer-item__toggle">
          <input
            type="checkbox"
            checked={layer.enabled}
            onChange={(event) => toggleLayer(layerId, event.target.checked)}
          />
          <span>{layer.name}</span>
        </label>
      </div>

      <div className="layer-item__row">
        <input
          className="layer-item__opacity"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={layer.opacity}
          disabled={!layer.enabled}
          onChange={(event) => setOpacity(layerId, Number(event.target.value))}
          aria-label={`Прозрачность слоя ${layer.name}`}
        />
        <span className="layer-item__opacity-value">{Math.round(layer.opacity * 100)}%</span>
      </div>
    </li>
  );
}

export const LayerItem = React.memo(LayerItemImpl);
