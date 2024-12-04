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

  export const updateSkillDifficulty = async (skillId: number, difficultyRating: string) => {
    try {
      const response = await api.put(`/user_skills/difficulty/${skillId}`, {
        difficultyRating: difficultyRating,
      });
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização:', error);
      throw new Error('Não foi possível atualizar a dificuldade. Tente novamente.');
    }
  };

  export const createUserSkillAssociation = async (skillId: number, level: number, difficultyRating: string) => {
    try {
      const response = await api.post("/user_skills", {
        skillId: skillId,
        level: level,
        difficultyRating: difficultyRating,
      });
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de criação:', error);
      throw new Error('Não foi possível criar a associação. Tente novamente.');
    }
  };