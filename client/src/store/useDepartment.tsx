import { create } from "zustand";

interface DeptType {
  dept: string[];
  setDept: (dept: string[]) => void;
}

const useDepartment = create<DeptType>()((set) => ({
  dept: [],
  setDept: (dept) => set({ dept }),
}));

export default useDepartment;
