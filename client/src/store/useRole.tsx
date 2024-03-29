import { create } from "zustand";

interface RoleType {
  role: null | "admin" | "user";
  setRole: (role: null | "admin" | "user") => void;
}

const useRole = create<RoleType>()((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}));

export default useRole;
