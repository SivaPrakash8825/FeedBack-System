import { create } from "zustand";
import { UserDetails } from "../../types";

interface useUserType {
  userDetails: UserDetails | null;
  setUserDetails: (userDetails: UserDetails) => void;
}

const useUserDetails = create<useUserType>()((set) => ({
  userDetails: null,
  setUserDetails: (userDetails: UserDetails) => set({ userDetails }),
}));

export default useUserDetails;
