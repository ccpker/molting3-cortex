import { create } from "zustand";
import type { AppState, Module, View, ViewMode } from "@/types/module";

interface AppStore extends AppState {
  // 视图切换
  setViewMode: (mode: ViewMode) => void;
  setActiveBullet: (bullet: string | null) => void;
  setActiveModule: (id: string | null) => void;

  // 模块管理
  loadModules: (modules: Module[]) => void;
  loadViews: (views: View[]) => void;
  setBullets: (bullets: string[]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  viewMode: "dashboard",
  activeBullet: null,
  activeModule: null,
  modules: new Map(),
  views: new Map(),
  bullets: [],

  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveBullet: (bullet) => set({ activeBullet: bullet, viewMode: bullet ? "bullet" : "dashboard" }),
  setActiveModule: (id) => set({ activeModule: id }),

  loadModules: (modules) =>
    set((state) => {
      const next = new Map(state.modules);
      modules.forEach((m) => next.set(m.meta.id, m));
      return { modules: next };
    }),

  loadViews: (views) =>
    set((state) => {
      const next = new Map(state.views);
      views.forEach((v) => next.set(v.id, v));
      return { views: next };
    }),

  setBullets: (bullets) => set({ bullets }),
}));
