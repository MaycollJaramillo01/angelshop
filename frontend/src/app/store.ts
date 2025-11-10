import { create } from 'zustand';

interface ToastState {
  message: string | null;
  showMessage: (message: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  showMessage: (message) => set({ message }),
  clear: () => set({ message: null })
}));

interface RealtimeState {
  online: boolean;
  setOnline: (value: boolean) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  online: false,
  setOnline: (online) => set({ online })
}));
