import { UserSkill } from "../@types/userSkill";
import api from "./Api";

export const getAssociation = async (): Promise<UserSkill[]> => {
    try {
      const response = await api.get("/user_skills");
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Erro desconhecido");
    }
  };

  export const deleteAssociation = async (id: number) => {
    try {
      await api.delete(`/user_skills/${id}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Erro desconhecido");
    }
  };

  export async function toggleFavorite(id: number): Promise<UserSkill> {
    const response = await api.patch(`/user_skills/toggle/${id}`);
    return response.data as UserSkill;
  }