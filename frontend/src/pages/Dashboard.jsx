import { useEffect } from "react";
import Sidebar from "../components/layouts/SideBar";
import Navbar from "../components/layouts/Navbar";
import { useGetBoards } from "../hooks/useBoards";
import { useUIStore } from "../store/useUIStore";
import ModalManager from "../components/modals/ModalManager";
import Workspace from "../components/kanban/Workspace.jsx";

export default function Dashboard() {
  const { data: boards } = useGetBoards();
  const { selectedBoardId, setSelectedBoardId } = useUIStore();

  // Auto-select the first board if none selected
  useEffect(() => {
    if (boards && boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0]._id);
    }
  }, [boards, selectedBoardId, setSelectedBoardId]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6">
          {selectedBoardId ? (
            <Workspace />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-medium text-slate-300">
                No board selected
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Create a new board from the sidebar to get started.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals Container */}
      <ModalManager />
    </div>
  );
}
