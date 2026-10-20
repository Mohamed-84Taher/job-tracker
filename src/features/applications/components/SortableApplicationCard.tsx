import React from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import type { Application, Status } from "../types";
import { ApplicationCard } from "./ApplicationCard";

interface SortableApplicationCardProps {
  application: Application;
  index: number;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onMoveToStatus?: (id: string, newStatus: Status) => void;
}

export const SortableApplicationCard: React.FC<SortableApplicationCardProps> = ({
  application,
  index,
  onEdit,
  onDelete,
  onMoveToStatus,
}) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: application.id,
    index,
    group: application.status,
    data: {
      application,
    },
  });

  return (
    <div ref={ref} className="touch-manipulation transition-opacity">
      <ApplicationCard
        application={application}
        onEdit={onEdit}
        onDelete={onDelete}
        onMoveToStatus={onMoveToStatus}
        isDragging={isDragging}
        dragHandleRef={handleRef as (element: HTMLDivElement | null) => void}
      />
    </div>
  );
};
