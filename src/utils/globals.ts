import {
  importGLBAsync,
} from "@babylon/utilities";
import * as BABYLON from "@babylonjs/core";
// maxCount of all sprites
export const spriteSheetLength = 112;
// width of sprite sheet items
export const HORIZONTALWIDTH = 28;
const gameAPI: string | undefined = process.env.REACT_APP_GAME_API_ENDPOINT;
export const isDebug: boolean | undefined =
  process.env.REACT_APP_IS_DEBUG === "true" ? true : false;
const readScenes = "readScenes";

export const cameraLevelPosition: any = {
  0: [-170, -0.985, -130],
  1: [135, -3, 147],
};

const getModel = async (store, scene, item: any) => {
  let _model: any;
  try {
    _model = await importGLBAsync(scene, {
      name: item.name,
      path: `/models/`,
      filename: item.model,
      scaling: item.scale,
      rotation: new BABYLON.Quaternion(...item.rotation),
      position: new BABYLON.Vector3(...item.position),
    });
    store.setActiveModels(_model);
  } catch (e) {
    console.log("model import error: ", e);
  }
  return _model;
};
/*
const getAllGlbModels = (store: any, scene: any) => {
  modelsToLoad.map((item) => getModel(store, scene, item));
};
*/

const globalVars = {
  spriteSheetLength,
  isDebug,
  endpoints: {
    readScenes: gameAPI + readScenes,
  }
};

export default globalVars
