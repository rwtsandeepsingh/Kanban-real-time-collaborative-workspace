import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../api/axios";

// ----------------------------------------------------------------------
// BOARD HOOKS
// ----------------------------------------------------------------------

// 1. Fetch all boards for the authenticated user
export const useGetBoards = () => {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const res = await API.get("/boards");
      console.log(res.data);
      return res.data.myBoards;
    },
  });
};

// 2. Fetch a single board by ID (including populated lists and cards)
export const useGetBoardById = (boardId) => {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: async () => {
      if (!boardId) return null;
      const res = await API.get(`/boards/${boardId}`);
      return res.data.board;
    },
    enabled: !!boardId, // Only fetch when boardId is available
  });
};

// 3. Create a new board
export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, description }) => {
      const res = await API.post("/boards/create-new-board", {
        title,
        description,
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate boards list cache so UI updates immediately
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};

// 4. Update board details (e.g., rename board)
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, title, description }) => {
      const res = await API.put(`/boards/${boardId}`, { title, description });
      console.log(res.data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
};

// 5. Delete a board
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (boardId) => {
      const res = await API.delete(`/boards/${boardId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};

// ----------------------------------------------------------------------
// LIST HOOKS
// ----------------------------------------------------------------------

// 6. Create a new List in a Board
export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, title }) => {
      const res = await API.post(`/boards/${boardId}/lists`, {
        title,
        boardId,
      });
      console.log(res.data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      // Refresh active board cache to render the new column immediately
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
};

// 7. Update List Title
export const useUpdateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, listId, title }) => {
      const res = await API.put(`/boards/${boardId}/lists/${listId}`, {
        title,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
};

// 8. Delete List
export const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, listId }) => {
      const res = await API.delete(`/boards/${boardId}/lists/${listId}`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
};
