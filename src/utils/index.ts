import { Camera, Vector3 } from "@babylonjs/core";
import {isDebug} from "./globals";

const minMobileWidth = 700;

export const isHighDensity = () => {
  return (
    (window.matchMedia &&
      (window.matchMedia(
        "only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)",
      ).matches ||
        window.matchMedia(
          "only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)",
        ).matches)) ||
    (window.devicePixelRatio && window.devicePixelRatio > 1.3)
  );
};

export const isRetina = () => {
  return (
    ((window.matchMedia &&
      (window.matchMedia(
        "only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)",
      ).matches ||
        window.matchMedia(
          "only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)",
        ).matches)) ||
      (window.devicePixelRatio && window.devicePixelRatio >= 2)) &&
    /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
  );
};

export const isMobile = () => window.innerWidth < minMobileWidth;
export const isPortraitMode = () => {
  return window.matchMedia("(orientation: portrait)").matches;
};
export const randomItem = (items: any) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const getCarouselStartEdge = (index: number = 1, store: any) =>
  store.currentIndex - index < 0
    ? store.cameraViews.length - index
    : store.currentIndex - index;
export const getCarouselEndEdge = (index: number = 1, store: any) =>
  store.currentIndex + index < store.cameraViews.length
    ? store.currentIndex + index
    : Math.abs(store.cameraViews.length - (store.currentIndex + index));

export const handleEvent = (
  eventType: string,
  key: string,
  callback: () => void,
) => {
  const eventHandler = (event: any | any) => {
    if (
      (event instanceof KeyboardEvent && event.key === key) ||
      (typeof TouchEvent !== "undefined" &&
        event instanceof TouchEvent &&
        event.type === eventType)
    ) {
      callback();
    }
  };
  document.addEventListener(eventType, eventHandler);
  document.addEventListener("keydown", eventHandler);

  return () => {
    document.removeEventListener(eventType, eventHandler);
    document.removeEventListener("keydown", eventHandler);
  };
};

export const tryDangerous = (codeToRun, name = "animation") => {
  try {
    codeToRun();
  } catch (e) {
    console.log("error", name);
  }
};

(window as any).gsapTweens = [];
export const gsapTween = (codeToRun): any => {
  const tween = codeToRun();
  (window as any).gsapTweens.push(tween);
};

export const proximitySensor = (
  camera: Camera,
  targetPosition: Vector3,
  thresholdDistance: number,
): boolean => {
  // Calculate the distance between the camera position and the target position
  const distance = Vector3.Distance(camera.position, targetPosition);
  if (isDebug) {
    console.log("proximitySensor", distance);
  }
  // Check if the distance is less than or equal to the threshold distance
  return isDebug ? true : distance <= thresholdDistance;
};
