import * as BABYLONGUI from "@babylonjs/gui";
import * as BABYLON from "@babylonjs/core";
import { cameraLevelPosition } from "@utils/globals";
import { useFrame } from "@hooks";
import { isMobile, isPortraitMode, proximitySensor } from "@utils";

export const ButtonToPush = {
  Forward: 87,
  Left: 65,
  Backward: 83,
  Right: 68,
};

export const simulateKeyPress = (keyCode, id) => {
  var event = new KeyboardEvent("keydown", {
    key: String.fromCharCode(keyCode),
    code: "Key" + String.fromCharCode(keyCode),
    keyCode: keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true,
  });

  id.dispatchEvent(event);
};

// Function to simulate a key release event
export const simulateKeyRelease = (keyCode, id) => {
  var event = new KeyboardEvent("keyup", {
    key: String.fromCharCode(keyCode),
    code: "Key" + String.fromCharCode(keyCode),
    keyCode: keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true,
  });
  id.dispatchEvent(event);
};

export const movementButton = ({ scene, camera, direction, text }) => {
  let buttonPressed = false;
  const buttonOBJ = BABYLONGUI.Button.CreateImageOnlyButton("", text);
  buttonOBJ.width = "40px";
  buttonOBJ.height = "40px";
  buttonOBJ.paddingLeft = "2.5px";
  buttonOBJ.paddingRight = "2.5px";
  buttonOBJ.cornerRadius = 5;
  buttonOBJ.color = "white";
  buttonOBJ.background = "transparent";

  const canvas = scene.getEngine().getRenderingCanvas();
  buttonOBJ.onPointerDownObservable.add(function () {
    buttonPressed = true;
    simulateKeyPress(ButtonToPush[direction], canvas);
  });
  buttonOBJ.onPointerUpObservable.add(function () {
    buttonPressed = false;
    simulateKeyRelease(ButtonToPush[direction], canvas);
  });
  return buttonOBJ;
};

export const interactableVideoPlane = (
  scene: any,
  thumb: string = "path_to_still_image.jpg",
  vid: string = "path_to_video.mp4",
  width: number = 16,
  height: number = 9,
): any => {
  const plane = BABYLON.MeshBuilder.CreatePlane(
    "plane",
    { width: width, height: height },
    scene,
  );
  const material = new BABYLON.StandardMaterial("planeMaterial", scene);
  // Create a video texture
  const videoTexture = new BABYLON.VideoTexture("videoTexture", vid, scene);
  videoTexture.video.autoplay = false;
  videoTexture.video.loop = true;
  material.diffuseTexture = videoTexture;
  plane.material = material;
  scene.onPointerObservable.add(function (evt) {
    if (evt.pickInfo.pickedMesh === plane) {
      if (videoTexture.video.paused) {
        videoTexture.video.play();
      } else {
        videoTexture.video.pause();
      }
      console.log(videoTexture.video.paused ? "paused" : "playing");
    }
  }, BABYLON.PointerEventTypes.POINTERPICK);
  return plane;
};

export const levelKey = (
  scene: any,
  width: number = 16,
  height: number = 9,
  keyTexture: any,
  mapW: any,
  mapH: any,
  i: any,
  j: any,
  unitsize: number,
  particleTexture: any,
  store: any,
): any => {
  const planeKey = BABYLON.MeshBuilder.CreatePlane(
    "key",
    { width: width, height: height },
    scene,
  );

  const material = new BABYLON.StandardMaterial("keyMat", scene);
  // Create a video texture
  const texture = keyTexture;
  texture.hasAlpha = true;
  texture.uScale = 1; // Adjust the texture tiling
  texture.vScale = 1;
  texture.uRotationCenter = 0.5; // Center the rotation around U-axis
  texture.vRotationCenter = 0.5; // Center the rotation around V-axis
  material.diffuseTexture = texture;
  material.backFaceCulling = false;
  planeKey.material = material;
  planeKey.position.x = (i - mapW / 2) * unitsize;
  planeKey.position.z = (j - mapH / 2) * unitsize;
  scene.onPointerObservable.add(function (evt) {
    if (proximitySensor(scene.activeCamera, planeKey.position, 40)) {
      console.log("Camera is close to the target position.");
      if (evt.pickInfo.pickedMesh === planeKey) {
        const pickedMesh = evt.pickInfo.pickedMesh;

        // Bounce Animation
        const bounceAnimation = new BABYLON.Animation(
          "bounceAnimation",
          "position.y",
          60, // Frames per second
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
        );

        // Define keyframes for the bounce animation
        const bounceKeys = [
          {
            frame: 0,
            value: pickedMesh.position.y,
          },
          {
            frame: 30,
            value: pickedMesh.position.y + 1.0, // Bounce up by 1 unit
          },
          {
            frame: 60,
            value: pickedMesh.position.y, // Back to original position
          },
        ];

        bounceAnimation.setKeys(bounceKeys);

        // Fade Out Animation
        const fadeOutAnimation = new BABYLON.Animation(
          "fadeOutAnimation",
          "material.alpha",
          60, // Frames per second
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        );

        // Define keyframes for the fade out animation
        const fadeOutKeys = [
          {
            frame: 0,
            value: 1, // Fully opaque
          },
          {
            frame: 120, // Adjust duration as needed
            value: 0, // Fully transparent
          },
        ];

        fadeOutAnimation.setKeys(fadeOutKeys);

        // Add animations to the picked mesh
        pickedMesh.animations.push(bounceAnimation);

        // Run the animations
        const scene = pickedMesh.getScene();
        scene.beginAnimation(pickedMesh, 0, 60, false, 1, () => {
          pickedMesh.isVisible = false;
        });

        const particleSystem = new BABYLON.ParticleSystem(
          "particles",
          2000,
          scene,
        );
        //Texture of each particle
        particleSystem.particleTexture = particleTexture;
        // Position where the particles are emiited from
        particleSystem.emitter = new BABYLON.Vector3(
          (i - mapW / 2) * unitsize,
          0,
          (j - mapH / 2) * unitsize,
        );
        particleSystem.start();
        particleSystem.targetStopDuration = 5;
        store.setGameData({ key: true });
      }
    } else {
      console.log("Camera is not close to the target position.");
    }
  }, BABYLON.PointerEventTypes.POINTERPICK);
  return planeKey;
};

export const levelUp = (
  store: any,
  scene: any,
  level: number = 1,
  enableCover: any,
) => {
  enableCover(true);
  store.setGameData({ level: level, key: false });
  store.setRenderPixi(true);
  store.setEnableRoot(false);
  const activeCamera = scene.activeCamera;
  activeCamera.position = new BABYLON.Vector3(...cameraLevelPosition[level]);
};

export const postPixi = (setRenderPixi) => {
  setTimeout(() => {
    setRenderPixi(false);
    enableVRIcon();
  }, 1000);
};

export const createSpriteFromCanvas: any = (
  imageName: string,
  sourceImage: any,
  xOffset: number,
  yOffset: number,
  width: number,
  height: number,
) => {
  const canvas: any = document.createElement(`canvas`);
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.drawImage(sourceImage, -xOffset, -yOffset);
  return canvas.toDataURL();
};

export const createAssets = (
  name: string,
  imageUrl: string,
  scene: any,
  callBack: any,
) => {
  const assetManager = new BABYLON.AssetsManager(scene);
  const imageFileTask = assetManager.addImageTask(
    `${name}-ImageTask`,
    imageUrl,
  );
  imageFileTask.onSuccess = (task) => {
    const loadedFullImage = task.image;
    loadedFullImage.crossOrigin = "anonymous";
    callBack(loadedFullImage);
  };
  assetManager.loadAsync();
};

interface ModelOptions {
  path: string;
  name: string;
  filename: string;
  scaling?: number;
  rotation: BABYLON.Quaternion;
  position?: BABYLON.Vector3;
  callback?: (meshes: BABYLON.AbstractMesh[]) => void;
}

const defaultOptions: ModelOptions = {
  name: "",
  path: "/model/",
  filename: "model.glb",
  scaling: 0.1,
  rotation: new BABYLON.Quaternion(),
  position: new BABYLON.Vector3(0, 0, 0),
};

export const importGLBAsync = async (
  scene: BABYLON.Scene,
  options: ModelOptions,
) => {
  const { name, path, filename, scaling, position, rotation } = options;
  const model: any = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    path,
    filename,
    scene,
  );
  let parentMesh: any = false;
  if (model.meshes.length > 0) {
    parentMesh = model.meshes[0];
    parentMesh.name = name;
    // Apply scaling and position to the parent mesh

    if (rotation) {
      parentMesh.rotation = rotation;
    }

    if (scaling) {
      parentMesh.scaling = new BABYLON.Vector3(scaling, scaling, scaling);
    }

    if (position) {
      parentMesh.position = position;
    }

    // Make imported meshes children of the parent mesh
    model.tag = "saved";
    model.meshes.forEach((mesh: any) => {
      mesh.tag = "saved";
      //console.log('mesh', mesh.tag, mesh)
      //mesh.setParent(parentMesh);
    });
  }
  return model;
};
export const importGLBModelAsync = (
  scene: BABYLON.Scene,
  options: ModelOptions,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const { name, path, filename, scaling, position } = options;
    BABYLON.SceneLoader.ImportMesh("", path, filename, scene, (meshes) => {
      let parentMesh: any = false;
      if (meshes.length > 0) {
        parentMesh = new BABYLON.Mesh(name, scene);
        // Apply scaling and position to the parent mesh

        if (scaling) {
          parentMesh.scaling = scaling;
        }
        if (position) {
          parentMesh.position = position;
        }

        // Make imported meshes children of the parent mesh
        meshes.forEach((mesh) => {
          mesh.setParent(parentMesh);
        });

        resolve(parentMesh);
      } else {
        reject(new Error("Failed to load GLB model."));
      }
    });
  });
};

export const moveCloserToTarget = (
  mesh: any,
  target: BABYLON.Vector3,
  speed: number,
  deltaTime: number,
) => {
  const direction = target.subtract(mesh.position);
  const distance = direction.length();

  if (distance > 0) {
    const moveAmount = speed * deltaTime;
    //debugger
    if (moveAmount >= distance) {
      // If the remaining distance is less than the moveAmount, set the position to the target
      mesh.position.copyFrom(target);
    } else {
      // Move the mesh closer to the target by a fraction of the remaining distance
      direction.normalize();
      direction.scaleInPlace(moveAmount);
      mesh.position.addInPlace(direction);
    }
  }
};

export const enableVRIcon = (displayType = "block") => {
  const vrIcon: any = document.querySelectorAll(".babylonVRicon")[0];
  if (vrIcon) {
    displayType = isMobile() && isPortraitMode() ? "none" : displayType;
    vrIcon.style.display = displayType;
  } else {
    //xr-button-overlay
    const xrIcon: any = document.querySelectorAll(".xr-button-overlay")[0];
    if (xrIcon) {
      const overlayBtn = `<button class="babylonVRicon" title="immersive-vr - local-floor" style="display: block;"></button>`;
      xrIcon.innerHTML = overlayBtn;
    }
  }
};

export const getItemFromArray = (
  itemToFetchValue: any,
  itemToFetchKey: string,
  ArrayOfItems: any[],
): any => {
  return ArrayOfItems.filter(
    (item) => item[itemToFetchKey] === itemToFetchValue,
  );
};
