import { useState } from "react";
import { useUIStore } from "../../store/useUIStore";
import { useCreateBoard, useCreateList } from "../../hooks/useBoards";
import { X, Layout, Plus } from "lucide-react";

export default function ModalManager() {
  const { activeModal, closeModal, selectedBoardId } = useUIStore();

  const [boardTitle, setBoardTitle] = useState("");
  const [boardDesc, setBoardDesc] = useState("");
  const [listTitle, setListTitle] = useState("");

  const { mutate: createBoard, isPending: isCreatingBoard } = useCreateBoard();
  const { mutate: createList, isPending: isCreatingList } = useCreateList();

  if (!activeModal) return null;

  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (!boardTitle.trim()) return;

    createBoard(
      { title: boardTitle, description: boardDesc },
      {
        onSuccess: () => {
          setBoardTitle("");
          setBoardDesc("");
          closeModal();
        },
      },
    );
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!listTitle.trim() || !selectedBoardId) return;

    createList(
      { boardId: selectedBoardId, title: listTitle },
      {
        onSuccess: () => {
          setListTitle("");
          closeModal();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Create Board Modal */}
        {activeModal === "CREATE_BOARD" && (
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Layout className="h-5 w-5 text-indigo-400" />
                <span>Create New Board</span>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Board Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Launch Roadmap"
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Briefly describe the purpose of this board..."
                  value={boardDesc}
                  onChange={(e) => setBoardDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingBoard}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isCreatingBoard ? "Creating..." : "Create Board"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create List Modal */}
        {activeModal === "CREATE_LIST" && (
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Plus className="h-5 w-5 text-indigo-400" />
                <span>Add New List Column</span>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  List Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. In Progress, Review, Done"
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingList}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isCreatingList ? "Adding..." : "Add List"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
