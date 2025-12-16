import type { GetUsersResponse } from "../../utils/type";
import api from "../axiosInstance";

type GetUsersParams = {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
};

export const getAllUsers = async (
  params?: GetUsersParams
): Promise<GetUsersResponse> => {
  const { data } = await api.get<GetUsersResponse>("/utilisateur", {
    params
  });

  return data;
};
export const updateUserRole = async (
  userId: string,
  role: string
): Promise<void> => {
  await api.put(`/utilisateur/${userId}/role`, { role });
};