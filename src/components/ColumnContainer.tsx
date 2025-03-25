import { KeyboardEvent, useMemo, useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  deleteTask,
  updateTask,
  tasks,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const taskIds = useMemo(() => {
    return tasks.map(task => task.id)
  }, [tasks])

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // When drag the element, it will appear outside the body with DragOverlay (see in KanbanBoard)
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-60 border-2 border-rose-500"
      ></div>
    );
  }

  return (
    <div
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ref={setNodeRef}
      style={style}
    >
      {/* Column title */}
      <div className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
        <div
          {...attributes}
          {...listeners}
          onClick={() => setEditMode(true)}
          className="flex gap-2 items-center flex-grow"
        >
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              onChange={(e) => updateColumn(column.id, e.target.value)}
            />
          )}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
          onClick={() => deleteColumn(column.id)}
        >
          <TrashIcon />
        </button>
      </div>
      {/* Column tasks container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon /> Add task
      </button>
    </div>
  );
};

export default ColumnContainer;
