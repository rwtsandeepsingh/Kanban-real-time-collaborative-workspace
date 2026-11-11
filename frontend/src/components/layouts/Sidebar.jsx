import { useGetBoards } from "../../hooks/useBoards";
import { useUIStore } from "../../store/useUIStore";
import { Layout, Plus, PanelLeftClose, PanelLeft, Kanban } from "lucide-react";

export default function Sidebar() {
  const { data: boards, isLoading } = useGetBoards();
  const {
    isSidebarOpen,
    toggleSidebar,
    selectedBoardId,
    setSelectedBoardId,
    openModal,
  } = useUIStore();

  if (!isSidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 shadow-xl transition hover:bg-slate-800 hover:text-white"
        title="Open Sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </button>
    );
  }

  return (
    <aside className="relative flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Kanban className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-wide text-white">KanbanFlow</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          title="Collapse Sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      {/* Boards Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>All Boards ({boards?.length || 0})</span>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-xl bg-slate-900"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {console.log(boards)}
            {boards?.map((board) => {
              const isActive = selectedBoardId === board._id;
              return (
                <button
                  key={board._id}
                  onClick={() => setSelectedBoardId(board._id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <Layout className="h-4 w-4 shrink-0" />
                  <span className="truncate">{board.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* New Board Action Footer */}
      <div className="border-t border-slate-800/80 p-3">
        <button
          onClick={() => openModal("CREATE_BOARD")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 bg-slate-900/50 py-2.5 text-sm font-medium text-indigo-400 transition hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:text-indigo-300"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Board</span>
        </button>
      </div>
    </aside>
  );
}
