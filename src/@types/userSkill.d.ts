export interface UserSkillLevelResponse {
    level: number;
    score: number;
  }
  export interface UserSkill {
    id: number;
    skillId: number;
    skillName: string;
    level: number;
    score: number;
    image: string;
    description: string;
    favorite: boolean;
    difficultyRating: string;
  }