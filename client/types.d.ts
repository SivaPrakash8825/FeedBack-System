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

export interface Course {
  "Academic yr"?: string;
  Dept?: string;
  "UG/PG"?: string;
  "Theory/Lab"?: string;
  Semester?: number;
  Section?: string;
  "Sub Code": string;
  "Sub Name": string;
  Staff: string;
  "StaffParent Dept"?: string;
  "Open Elective/Regular/Core Elective"?: string;
  "Sub Grouping"?: string;
}

export interface UserDetails {
  courses: Course[];
  username: string;
  academicyr: string;
  dept: string;
  degree: string;
  sem: number;
  section: string;
  year: string;
}

interface SubjectsWithName {
  name: string | undefined;
  subjects: Array<Course>;
}

interface SubjectsByType {
  [key: string]: SubjectsWithName;
}
