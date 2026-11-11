import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../api/axios";

// 1. Create a new task card inside a list
export const useCreateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, listId, title, description, priority }) => {
      const res = await API.post(`/boards/${boardId}/lists/${listId}/cards`, {
        title,
        description,
        priority,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      // Refresh the active board cache to render the new card instantly
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
};

// 2. Update an existing task card
export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      boardId,
      cardId,
      title,
      description,
      status,
      priority,
    }) => {
      const res = await API.put(`/boards/${boardId}/cards/${cardId}`, {
        title,
        description,
        status,
        priority,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
};

// 3. Delete a task card
export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, cardId }) => {
      const res = await API.delete(`/boards/${boardId}/cards/${cardId}`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
};
