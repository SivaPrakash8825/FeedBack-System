import { create } from "zustand";

export interface ToastProp {
  msg: string;
  variant: "error" | "success";
}

const TOAST_DURATION = 5000;

interface UseToastProps {
  toast: ToastProp;
  setToast: (toast: ToastProp) => void;
  showToast: boolean;
}

const useToast = create<UseToastProps>()((set) => ({
  toast: {
    msg: "",
    variant: "success",
  },
  showToast: false,
  setToast: ({ msg, variant }) =>
    set((state) => {
      let toastTimeout: any;
      if (state.showToast) {
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          set({ showToast: false });
          return clearTimeout(toastTimeout);
        }, TOAST_DURATION);
        return { toast: { msg, variant }, showToast: true };
      } else {
        toastTimeout = setTimeout(() => {
          set({ showToast: false });
          return clearTimeout(toastTimeout);
        }, TOAST_DURATION);
        return { toast: { msg, variant }, showToast: true };
      }
    }),
}));

export default useToast;
