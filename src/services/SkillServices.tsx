import { CreateSkillType, PaginatedSkills, Skills, UpdateSkillType } from "../@types/skills";
import api from "./Api";

export async function getSkills(): Promise<Skills[]> {
  const response = await api.get<Skills[]>("/skill");
  return response.data;
}

export async function getSkillsByTitle(title: string): Promise<Skills[]> {
  const response = await api.get<Skills[]>(`/skill/search?title=${title}`);
  return response.data;
}

export async function getSkillsByTitleAndCategory(
  categoryId: number | null,
  title: string | null,
  page: number = 1, 
  size: number = 10,
  sortDirection: string = "ASC"
): Promise<PaginatedSkills> {
  const response = await api.get(`/skill/search`, {
    params: {
      categoryId,
      title,
      page,
      size,
      sortDirection
    }
  });
  return response.data;
}

export async function getSkillById(id: number): Promise<Skills> {
  const response = await api.get(`/skill/${id}`);
  return response.data;
}

export async function deleteSkill(id: number): Promise<void> {
  await api.delete(`/skill/${id}`);
}

export async function updateSkill(id: number, data: UpdateSkillType): Promise<void> {
  try {
    await api.put(`/skill/${id}`, data);
    console.log("Skill atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar a habilidade:", error);
    throw new Error("Erro ao atualizar a habilidade");
  }
}

export const createSkill = async (data: CreateSkillType) => {
  try {
    const response = await api.post("/skill", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar skill:", error);
    throw new Error("Erro ao criar skill");
  }
};