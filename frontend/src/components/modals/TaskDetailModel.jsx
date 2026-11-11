import { useState } from "react";
import { useUIStore } from "../../store/useUIStore";
import { useUpdateCard } from "../../hooks/useCards";
import { X, CheckSquare } from "lucide-react";

export default function TaskDetailModal({ board, lists }) {
  const { activeCardId, setActiveCardId } = useUIStore();
  const { mutate: updateCard, isPending } = useUpdateCard();

  // Find the active card
  const activeCard = lists
    ?.flatMap((list) => list.cards || [])
    .find((card) => card._id === activeCardId);

  // Initialize state directly once on mount — no useEffect required!
  const [title, setTitle] = useState(activeCard?.title || "");
  const [description, setDescription] = useState(activeCard?.description || "");
  const [priority, setPriority] = useState(activeCard?.priority || "medium");

  if (!activeCardId || !activeCard || !board) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateCard(
      {
        boardId: board._id,
        cardId: activeCardId,
        title,
        description,
        priority,
      },
      {
        onSuccess: () => setActiveCardId(null),
      },
    );
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <CheckSquare className="h-5 w-5 text-indigo-400" />
            <span>Edit Task Details</span>
          </div>
          <button
            onClick={() => setActiveCardId(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed task description..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveCardId(null)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
