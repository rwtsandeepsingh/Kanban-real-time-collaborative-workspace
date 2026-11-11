import { useDeleteCard } from "../../hooks/useCards";
import { Trash2 } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";

export default function TaskCard({ card, boardId }) {
  const { mutate: deleteCard } = useDeleteCard();
  const setActiveCardId = useUIStore((state) => state.setActiveCardId);
  const priorityColors = {
    high: "bg-red-500/10 text-red-400 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  console.log("inside taskCard");
  console.log(card);
  console.log(boardId);
  return (
    <div
      onClick={() => setActiveCardId(card._id)}
      className="group relative cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm transition hover:border-slate-700 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-100">{card.title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening modal when clicking delete
            deleteCard({ boardId, cardId: card._id });
          }}
          className="text-slate-500 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
          title="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {card.description && (
        <p className="mt-2 line-clamp-2 text-xs text-slate-400">
          {card.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs">
        {card.priority && (
          <span
            className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
              priorityColors[card.priority] || priorityColors.medium
            }`}
          >
            {card.priority}
          </span>
        )}
      </div>
    </div>
  );
}
