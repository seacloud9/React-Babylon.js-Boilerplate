import { useEffect, useRef } from "react";
import { useScene } from "react-babylonjs";
import * as BABYLONGUI from "@babylonjs/gui";
import { useStore } from "@store";

// Renamed the custom hook to useCustomFrame
export const useFrame = (callback) => {
  const scene = useScene();
  let time = 0;

  useEffect(() => {
    const onBeforeRender = (scene) => {
      if (scene !== null) {
        time += scene.getEngine().getDeltaTime();
        callback();
      }
    };

    const onBeforeRenderObserver =
      scene.onBeforeRenderObservable.add(onBeforeRender);

    return () => {
      // Cleanup the observer when the component unmounts
      scene.onBeforeRenderObservable.remove(onBeforeRenderObserver);
    };
  }, [scene, callback]);

  return { scene, time };
};
