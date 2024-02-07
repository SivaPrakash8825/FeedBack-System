export interface QuestionDb {
  id: number;
  question: string;
  type: string;
}

export interface Question {
  question: string;
  options: string[];
  type: string;
}
