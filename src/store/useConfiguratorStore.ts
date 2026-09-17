import { create } from "zustand";
import componentsData from "@/data/components.json";

export type TierType = "entrada" | "media" | "alta" | "extrema";
export type AutoCycleMode = "tier" | "component" | "paused";

export interface ConfiguratorState {
  selectedTier: TierType;
  activeHardwareIndex: number;
  activePeripheralIndex: number;
  autoCycleMode: AutoCycleMode;
  pauseExpiresAt: number | null;
  customBuild: Record<string, string>;

  // Actions
  selectTier: (tier: TierType, fromUserClick?: boolean) => void;
  selectHardwareChapter: (index: number, fromUserClick?: boolean) => void;
  selectPeripheralChapter: (index: number, fromUserClick?: boolean) => void;
  tickTierCycle: () => void;
  tickComponentCycle: (totalChapters: number) => void;
  tickPeripheralCycle: (totalPeripherals: number) => void;
  resumeAutoCycle: () => void;
  setCustomComponent: (category: string, itemId: string) => void;
  loadPreset: (tier: TierType) => void;
  clearCustomBuild: () => void;
}

const TIER_ORDER: TierType[] = ["entrada", "media", "alta", "extrema"];

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  selectedTier: "media",
  activeHardwareIndex: 0,
  activePeripheralIndex: 0,
  autoCycleMode: "tier", // Starts auto-cycling through the 4 tiers
  pauseExpiresAt: null,
  customBuild: componentsData.tiers.find((t) => t.id === "media")?.components || {},

  selectTier: (tier: TierType, fromUserClick = true) => {
    const target = componentsData.tiers.find((t) => t.id === tier);
    if (fromUserClick) {
      // User clicked a tier: stop tier cycling, switch to component cycling (01 to 05)
      set({
        selectedTier: tier,
        autoCycleMode: "component",
        activeHardwareIndex: 0,
        activePeripheralIndex: 0,
        pauseExpiresAt: null,
        customBuild: target ? { ...target.components } : {},
      });
    } else {
      // Automatic tick
      set({ selectedTier: tier });
    }
  },

  selectHardwareChapter: (index: number, fromUserClick = true) => {
    if (fromUserClick) {
      // User clicked a specific component: stop all cycling and give at least 5 mins (300,000 ms) to read
      const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
      set({
        activeHardwareIndex: index,
        autoCycleMode: "paused",
        pauseExpiresAt: fiveMinutesFromNow,
      });
    } else {
      set({ activeHardwareIndex: index });
    }
  },

  selectPeripheralChapter: (index: number, fromUserClick = true) => {
    if (fromUserClick) {
      // User clicked a specific peripheral: pause cycling and give 5 mins reading mode
      const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
      set({
        activePeripheralIndex: index,
        autoCycleMode: "paused",
        pauseExpiresAt: fiveMinutesFromNow,
      });
    } else {
      set({ activePeripheralIndex: index });
    }
  },

  tickTierCycle: () => {
    const { autoCycleMode, selectedTier } = get();
    if (autoCycleMode !== "tier") return;
    const currentIndex = TIER_ORDER.indexOf(selectedTier);
    const nextTier = TIER_ORDER[(currentIndex + 1) % TIER_ORDER.length];
    set({ selectedTier: nextTier });
  },

  tickComponentCycle: (totalChapters: number) => {
    const { autoCycleMode, activeHardwareIndex, pauseExpiresAt } = get();
    if (autoCycleMode === "paused") {
      // Check if 5 minutes have elapsed
      if (pauseExpiresAt && Date.now() >= pauseExpiresAt) {
        set({ autoCycleMode: "component", pauseExpiresAt: null });
      }
      return;
    }
    if (autoCycleMode !== "component") return;

    const nextIndex = (activeHardwareIndex + 1) % totalChapters;
    set({ activeHardwareIndex: nextIndex });
  },

  tickPeripheralCycle: (totalPeripherals: number) => {
    const { autoCycleMode, activePeripheralIndex, pauseExpiresAt } = get();
    if (autoCycleMode === "paused") {
      // Check if 5 minutes have elapsed
      if (pauseExpiresAt && Date.now() >= pauseExpiresAt) {
        set({ autoCycleMode: "component", pauseExpiresAt: null });
      }
      return;
    }
    if (autoCycleMode !== "component") return;

    const nextIndex = (activePeripheralIndex + 1) % totalPeripherals;
    set({ activePeripheralIndex: nextIndex });
  },

  resumeAutoCycle: () => {
    set({ autoCycleMode: "tier", pauseExpiresAt: null });
  },

  setCustomComponent: (category: string, itemId: string) => {
    set((state) => ({
      customBuild: {
        ...state.customBuild,
        [category]: itemId,
      },
    }));
  },

  loadPreset: (tier: TierType) => {
    const target = componentsData.tiers.find((t) => t.id === tier);
    set({
      selectedTier: tier,
      customBuild: target ? { ...target.components } : {},
    });
  },

  clearCustomBuild: () => {
    set({ customBuild: {} });
  },
}));
