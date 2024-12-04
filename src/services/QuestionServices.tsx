import { NewQuestionData, Question, ValidationResponse } from "../@types/question";
import { UserSkillLevelResponse } from "../@types/userSkill";
import api from "./Api";


export const getQuestionsBySkillId = async (skillId: number): Promise<Question[]> => {
    try {
        const response = await api.get(`/questions/skill/${skillId}`);
        return response.data
    } catch (error) {
        console.error('Erro ao buscar questões:', error);
        throw new Error('Erro ao buscar questões.');
    }
};

export const getQuestionById = async (questionId: number) => {
  const response = await api.get(`/questions/list/${questionId}`);
  return response.data
};

export const getValidAnswer = async (questionId: number, selectedAnswer: string): Promise<ValidationResponse | null> => {
  try {
    const response = await api.post<ValidationResponse>(`/questions/${questionId}/validate`, {
      answer: selectedAnswer,
    });

    console.log('Resultado da validação:', response.data);
    return response.data;
  } catch (error) {

    console.error('Erro na validação da resposta:', error);
    return null;
  }
};

export const getUserSkillLevel = async (skillId: number): Promise<UserSkillLevelResponse> => {
  try {
    const response = await api.get(`/questions/user-skill/${skillId}`);
    console.log('Resposta do Backend:', response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter nível do usuário:", error);
    throw new Error("Não foi possível obter o nível e a pontuação.");
  }
};

export const deleteQuestion = async (questionId: number): Promise<void> => {
  try {
    await api.delete(`/questions/${questionId}`);
  } catch (error) {
    console.error("Erro ao excluir a questão:", error);
    throw new Error("Erro ao excluir a questão.");
  }
};

export const updateQuestion = async (
  questionId: number,
  updatedData: Partial<Question>
): Promise<Question> => {
  try {
    const response = await api.put(`/questions/${questionId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Erro ao editar a questão:", error);
    throw new Error("Erro ao editar a questão.");
  }
};

export async function createQuestion(skillId: number, newQuestionData: Omit<NewQuestionData, 'skillId'>): Promise<Question> {
  try {
    const response = await api.post<Question>(`/questions/${skillId}`, {
      ...newQuestionData,
      skillId
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar questão:', error);
    throw new Error('Erro ao criar a questão.');
  }
}