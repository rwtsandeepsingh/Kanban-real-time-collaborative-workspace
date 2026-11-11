import { create } from "zustand";
export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  activeModal: null, // e.g., 'CREATE_BOARD', 'CREATE_CARD'
  selectedBoardId: null,
  activeCardId: null,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (modalName) => set({ activeModal: modalName }),
  closeModal: () => set({ activeModal: null }),
  setSelectedBoardId: (id) => set({ selectedBoardId: id }),
  setActiveCardId: (id) => set({ setActiveCardId: id }),
}));
