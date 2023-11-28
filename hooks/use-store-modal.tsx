import { create } from "zustand";

type useStoreModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useStoreModalStore = create<useStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
