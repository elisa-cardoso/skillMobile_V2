import { Category } from "../@types/category";
import { Skills } from "../@types/skills";
import api from "./Api";


export async function getSkillsByCategory(id: number): Promise<Skills[]> {
  const response = await api.get<Skills[]>(`/skill/by-category/${id}`);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar categorias: " + error);
    }
  }