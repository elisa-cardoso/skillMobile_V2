import { Skills } from "./skills";

export interface Question {
  id: number;
  skill: Skills;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}
export interface ValidationResponse {
  correct: boolean;
  score: number;
  level: number;
}

export interface NewQuestionData {
  skillId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}