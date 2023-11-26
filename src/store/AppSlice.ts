import { StateCreator } from "zustand";
import { Camera, Games, Game, FPSprites, FPSprite } from "./MockStore";
import { localStorageKey } from "./index";
import serializeJavascript from "serialize-javascript";

export const InitialState = {
  currentIndex: 0,
  cameraViews: [],
};

export const createAppSlice: StateCreator<
  AppSlice,
  [["zustand/subscribeWithSelector", never]],
  []
> = (set, get) => {
  const storedState = JSON.parse(localStorage.getItem(localStorageKey) as any);

  const updateLocalStorage = (state: any) => {
    const stateWithoutFunctions = removeFunctions(state);
    const serializedState = serializeJavascript(stateWithoutFunctions);
    localStorage.setItem(
      localStorageKey,
      JSON.stringify(stateWithoutFunctions),
    );
  };

  const removeFunctions = (obj: any): any => {
    const newObj: any = {};
    for (let key in obj) {
      if (
        typeof obj[key] !== "function" &&
        key !== "fpModels" &&
        key !== "fpSprites" &&
        key !== "fpSprite"
      ) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  };

  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  const updateLocalStorageKey = (state: any) => {
    const storedState = JSON.parse(
      localStorage.getItem(localStorageKey) as any,
    );
    const newState = { ...storedState, ...state };
    localStorage.setItem(localStorageKey, JSON.stringify(newState));
  };

  const initialState = {
    ...InitialState,
    ...storedState,
  };

  return {
    ...initialState,
    next: () => {
      set((state) => {
        const nextIndex = (state.currentIndex + 1) % state.cameraViews.length;
        return { currentIndex: nextIndex };
      });
    },
    prev: () => {
      set((state) => {
        let prevIndex = state.currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = state.cameraViews.length - 1;
        }
        return { currentIndex: prevIndex };
      });
    },
    setCameraViews: (cameraViews: Camera[]) =>
      set((state) => ({ ...state, cameraViews })),
  }
};

export interface AppSlice {
  currentIndex: number;
  cameraViews:Camera[];
  setCameraViews: (cameraViews: Camera[]) => void;
}
