import { useUser, useLogout } from "../../hooks/useAuth";
import { useGetBoardById } from "../../hooks/useBoards";
import { useUIStore } from "../../store/useUIStore";
import { LogOut, User, Plus } from "lucide-react";

export default function Navbar() {
  const { data: user } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { selectedBoardId, openModal } = useUIStore();

  const { data: currentBoard } = useGetBoardById(selectedBoardId);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-6 text-slate-100">
      {/* Active Board Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-white">
          {currentBoard?.title || "Select or Create a Board"}
        </h1>
      </div>

      {/* Actions & User Profile */}
      <div className="flex items-center gap-4">
        {selectedBoardId && (
          <button
            onClick={() => openModal("CREATE_LIST")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Column</span>
          </button>
        )}

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-indigo-400 border border-slate-700">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="ml-2 rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 transition hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
