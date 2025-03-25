import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";

import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  deleteTask,
  updateTask,
}) => {
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative border-2 border-rose-500"
        ref={setNodeRef}
        style={style}
      />
    );
  }

  if (editMode) {
    return (
      <div
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
      >
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="enter your task"
          onBlur={toggleEditMode}
          onKeyDown={(ev: KeyboardEvent<HTMLTextAreaElement>) => {
            if (ev.key === "Enter" && !ev.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(ev: ChangeEvent<HTMLTextAreaElement>) => {
            updateTask(task.id, ev.target.value);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={toggleEditMode}
      {...attributes}
      {...listeners}
      style={style}
      ref={setNodeRef}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-auto whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
