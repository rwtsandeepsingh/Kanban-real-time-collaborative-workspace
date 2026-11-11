import { useState } from "react";
import TaskCard from "./TaskCard";
import { useCreateCard } from "../../hooks/useCards";
import { useDeleteList } from "../../hooks/useBoards";
import { Plus, Trash2, X } from "lucide-react";

export default function Column({ list, boardId }) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState("");

  const { mutate: createCard, isPending } = useCreateCard();
  const { mutate: deleteList } = useDeleteList();

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;

    createCard(
      { boardId, listId: list._id, title: cardTitle },
      {
        onSuccess: () => {
          setCardTitle("");
          setIsAddingCard(false);
        },
      },
    );
  };

  return (
    <div className="flex h-full w-80 shrink-0 flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-sm">
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-200">{list.title}</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400">
            {list.cards?.length || 0}
          </span>
        </div>
        <button
          onClick={() => deleteList({ boardId, listId: list._id })}
          className="text-slate-500 hover:text-red-400"
          title="Delete list"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Task Cards Stack (Scrollable) */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {list.cards && list.cards.length > 0 ? (
          list.cards.map((card) => (
            <TaskCard key={card._id} card={card} boardId={boardId} />
          ))
        ) : (
          <div className="py-4 text-center text-xs text-slate-500">
            No tasks yet. Add one below!
          </div>
        )}
      </div>

      {/* Add Card Form or Button */}
      <div className="mt-4 border-t border-slate-800/60 pt-3">
        {isAddingCard ? (
          <form onSubmit={handleAddCard} className="space-y-2">
            <input
              type="text"
              autoFocus
              placeholder="Enter card title..."
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Add Card"}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
}
