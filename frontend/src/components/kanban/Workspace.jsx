import { useState } from "react";
import {
  useGetBoardById,
  useUpdateBoard,
  useDeleteBoard,
} from "../../hooks/useBoards";
import { useUIStore } from "../../store/useUIStore";
import Column from "./Column";
import { Plus, Trash2, Edit2, Check, X, Layout } from "lucide-react";
import TaskDetailModal from "../modals/TaskDetailModel";
import { DragDropContext } from "@hello-pangea/dnd";

export default function Workspace() {
  const { selectedBoardId, setSelectedBoardId, openModal } = useUIStore();
  const { data: board, isLoading, error } = useGetBoardById(selectedBoardId);
  const { mutate: updateBoard } = useUpdateBoard();
  const { mutate: deleteBoard } = useDeleteBoard();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!selectedBoardId) return null;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        Loading board workspace...
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-red-400">
        <p>Failed to load board details.</p>
      </div>
    );
  }

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log(result);
    // if dropped outside any droppable area --> do nothing
    if (!destination) {
      return;
    }
    // if dropped in the same area do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    console.log("Drag finished:", { source, destination, draggableId });
    // TODO: Dispatch state update or API call here
  };

  const handleStartEdit = () => {
    setTitle(board.title);
    setDescription(board.description || "");
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateBoard(
      { boardId: board._id, title, description },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleDeleteBoard = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this board? All lists and tasks inside will be removed.",
      )
    ) {
      deleteBoard(board._id, {
        onSuccess: () => setSelectedBoardId(null),
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full flex-col">
        {/* Board Header Metadata & Controls */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-base font-bold text-white focus:border-indigo-500 focus:outline-none"
              />
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add board description..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  <Check className="h-4 w-4" /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                    <Layout className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {board.title}
                  </h2>
                </div>
                {board.description && (
                  <p className="mt-1.5 text-sm text-slate-400">
                    {board.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Board
                </button>
                <button
                  onClick={handleDeleteBoard}
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Horizontal Columns Canvas */}
        <div className="flex flex-1 gap-6 overflow-x-auto pb-4">
          {board?.lists?.map((list) => (
            <Column key={list._id} list={list} boardId={board._id} />
          ))}

          {/* Add New Column Trigger Card */}
          <div className="flex h-full w-80 shrink-0 flex-col">
            <button
              onClick={() => openModal("CREATE_LIST")}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-sm font-medium text-slate-400 transition hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:text-indigo-300"
            >
              <Plus className="h-4 w-4" />
              <span>Add another column</span>
            </button>
          </div>
        </div>
        <TaskDetailModal board={board} lists={board.lists} />
      </div>
    </DragDropContext>
  );
}
