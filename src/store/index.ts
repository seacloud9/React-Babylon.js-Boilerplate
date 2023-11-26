import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { AppSlice, createAppSlice, InitialState } from "./AppSlice";
export const localStorageKey = "sc9App";

if (!localStorage.getItem(localStorageKey)) {
  localStorage.setItem(localStorageKey, JSON.stringify(InitialState) as any);
}

export const useStore = create<AppSlice>()(
  subscribeWithSelector((...a) => ({
    ...createAppSlice(...a),
  })),
);
