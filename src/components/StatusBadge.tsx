import React from "react";
import type { LayerStatus } from "../types";

const LABELS: Record<LayerStatus, string> = {
  idle: "Выключен",
  loading: "Загрузка…",
  success: "Загружено",
  error: "Ошибка",
};

interface StatusBadgeProps {
  status: LayerStatus;
}

function StatusBadgeImpl({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{LABELS[status]}</span>;
}

export const StatusBadge = React.memo(StatusBadgeImpl);
