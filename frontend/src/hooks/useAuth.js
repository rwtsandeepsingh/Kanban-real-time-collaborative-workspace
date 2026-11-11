import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../api/Axios";
// 1. Fetch current logged-in user
export const useUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await API.get("/auth/me");
        return res.data.user;
      } catch (err) {
        return null; // Return null on 401 Unauthorized
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// 2. Login Mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await API.post("/auth/login", { email, password });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
};

// 3. Register Mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const res = await API.post("/auth/signup", { name, email, password });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
};

// 4. Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await API.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.clear(); // Clear all board caches on logout
    },
  });
};
