import { Axis, Color3, DirectionalLight, FreeCamera, FreeCameraGamepadInput, MeshBuilder, PhysicsImpostor, Scene, Vector3, VirtualJoysticksCamera, WebXRState } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Materials/Node/Blocks";
import WebXRPolyfill from "webxr-polyfill";
import isMobile from "is-mobile";
import {
  ButtonToPush,
  movementButton,
  simulateKeyPress,
  simulateKeyRelease,
} from "../utilities";
import * as BABYLONGUI from "@babylonjs/gui";
import globals, { cameraLevelPosition } from "@utils/globals";
import { enableXrControls } from "./xrHelpers";
import { useStore } from "@store";
const { isDebug } = globals;

const cameraStart = new Vector3(...cameraLevelPosition[0]);

export const endAllMovement = (canvas) => {
  simulateKeyRelease(ButtonToPush["Right"], canvas);
  simulateKeyRelease(ButtonToPush["Left"], canvas);
  simulateKeyRelease(ButtonToPush["Forward"], canvas);
  simulateKeyRelease(ButtonToPush["Backward"], canvas);
};

const xrPolyfillPromise = new Promise<void>((resolve) => {
  if (navigator.xr) {
    // WebXR is supported, no need to load the polyfill
    return resolve();
  }

  // Create a new instance of the WebXRPolyfill
  const polyfill = new WebXRPolyfill();

  // Check if the polyfill has a 'onload' event or a similar event for readiness
  if (polyfill.onload) {
    polyfill.onload = () => {
      resolve();
    };
  } else {
    // If 'onload' is not available, consider using a delay as a workaround
    setTimeout(() => {
      resolve();
    }, 1000); // Adjust the delay as needed
  }
});

const getMovementKeys = (scene, camera) => {
  const upButton = movementButton({
    scene,
    camera,
    direction: "Forward",
    text: "",
  });
  const leftButton = movementButton({
    scene,
    camera,
    direction: "Left",
    text: "",
  });
  const downButton = movementButton({
    scene,
    camera,
    direction: "Backward",
    text: "",
  });
  const rightButton = movementButton({
    scene,
    camera,
    direction: "Right",
    text: "",
  });

  return { upButton, leftButton, downButton, rightButton };
};

export const desktopCamera = (scene: any) => {
  let camera = scene.activeCamera
    ? scene.activeCamera
    : new FreeCamera("FreeCamera", cameraStart, scene);
  if (isDebug) {
    (window as any).camera = camera;
  }
  camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
  camera.keysUp.push(ButtonToPush.Forward);
  camera.keysDown.push(ButtonToPush.Backward);
  camera.keysRight.push(ButtonToPush.Right);
  camera.keysLeft.push(ButtonToPush.Left);
  return camera;
};

export const mobileCamWithSwipe = (scene) => {
  let startingPoint = null;
  let camera = scene.activeCamera
    ? scene.activeCamera
    : new FreeCamera("FreeCamera", cameraStart, scene);
  const canvas = scene.getEngine().getRenderingCanvas();
  camera.attachControl(canvas, true);
  camera.keysUp.push(ButtonToPush.Forward);
  camera.keysDown.push(ButtonToPush.Backward);
  camera.keysRight.push(ButtonToPush.Right);
  camera.keysLeft.push(ButtonToPush.Left);

  canvas.addEventListener("click", function (event) {
    simulateKeyPress(ButtonToPush["Forward"], canvas);
    setTimeout(() => endTouch(), 500);
  });

  canvas.addEventListener("touchstart", function (event) {
    if (event.touches.length === 1) {
      // Store the starting point of the swipe
      startingPoint = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  });

  // Listen for touchmove event on the canvas
  canvas.addEventListener("touchmove", function (event) {
    if (startingPoint) {
      // Prevent scrolling while swiping
      event.preventDefault();

      // Calculate the horizontal and vertical distances between the start and current points
      var deltaX = event.touches[0].clientX - startingPoint.x;
      var deltaY = event.touches[0].clientY - startingPoint.y;

      // Determine the direction of the swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          // Right swipe
          simulateKeyPress(ButtonToPush["Right"], canvas);
        } else {
          // Left swipe
          simulateKeyPress(ButtonToPush["Left"], canvas);
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          // Downward swipe
          simulateKeyPress(ButtonToPush["Backward"], canvas);
        } else {
          // Upward swipe
          simulateKeyPress(ButtonToPush["Forward"], canvas);
        }
      }
    }
    setTimeout(() => endTouch(), 50);
  });

  const endTouch = () => {
    startingPoint = null;
    endAllMovement(canvas);
  };

  // Listen for touchend event on the canvas
  canvas.addEventListener("touchend", function (event) {
    // Reset the starting point when the touch ends
    endTouch();
  });
  camera = oldSchoolCamera(scene);
  return camera;
};

export const oldSchoolCamera = (scene) => {
  let camera = scene.activeCamera
    ? scene.activeCamera
    : new FreeCamera("FreeCamera", cameraStart, scene);
  camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
  camera.keysUp.push(87);
  camera.keysDown.push(83);
  camera.keysRight.push(68);
  camera.keysLeft.push(65);
  const guiTexture = BABYLONGUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  const panel = new BABYLONGUI.StackPanel();
  panel.width = "162.5px";
  panel.height = "105px";
  panel.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  panel.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  panel.isVertical = true;
  panel.paddingLeft = "40px";
  guiTexture.addControl(panel);
  const topRow = new BABYLONGUI.StackPanel();
  topRow.width = "40px";
  topRow.height = "45px";
  topRow.isVertical = false;
  topRow.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const bottomRow = new BABYLONGUI.StackPanel();
  bottomRow.width = "100%";
  bottomRow.height = "45px";
  bottomRow.isVertical = false;
  bottomRow.horizontalAlignment =
    BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const { upButton, leftButton, downButton, rightButton } = getMovementKeys(
    scene,
    camera,
  );
  topRow.addControl(upButton);
  bottomRow.addControl(leftButton);
  bottomRow.addControl(downButton);
  bottomRow.addControl(rightButton);
  topRow.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  panel.addControl(topRow);
  panel.addControl(bottomRow);
  addCameraPhysics(camera, scene);
  return camera;
};

export const getCamera = (scene: any, type = "default") => {
  let camera;
  switch (type) {
    case "desktopCamera":
      camera = desktopCamera(scene);
      break;
    case "mobileCamWithSwipe":
      camera = mobileCamWithSwipe(scene);
      break;
    case "oldSchool":
      camera = oldSchoolCamera(scene);
      break;
    default:
      camera = new VirtualJoysticksCamera(
        "FreeCamera",
        cameraStart,
        scene,
      );
      camera.speed = 2.5;
      const canvas = scene.getEngine().getRenderingCanvas();
      camera.attachControl(canvas, true);
      break;
  }
  return camera;
};

const setMeshSphere = (camera, scene) => {
  const cameraCollisionMesh: any = MeshBuilder.CreateSphere(
    "cameraCollisionMesh",
    { diameter: 3 },
    scene,
  );
  cameraCollisionMesh.isVisible = false; // Make the collision mesh invisible
  cameraCollisionMesh.checkCollisions = true;
  cameraCollisionMesh.tag = "saved";
  cameraCollisionMesh.cameraCollider = true;
  cameraCollisionMesh.physicsImpostor = new PhysicsImpostor(
    cameraCollisionMesh,
    PhysicsImpostor.SphereImpostor,
    { mass: 0.1, restitution: 0.1 },
  );
  cameraCollisionMesh.setParent(camera);
  cameraCollisionMesh.position = new Vector3(0, 0, 2.5);
  cameraCollisionMesh.applyGravity = true;
};

const addCameraPhysics = (camera, scene) => {
  // physics
  if (!camera._children) {
    // setMeshSphere(camera, scene)
  }

  scene.collisionsEnabled = true;
  camera.checkCollisions = true;
  camera.applyGravity = true;
  scene.gravity = new Vector3(0, -1, 0);
  camera.ellipsoid = new Vector3(1.5, 5, 1.5);
  // physics
  const light: any = new DirectionalLight(
    "DirectionalLight",
    new Vector3(1, 0, 1),
    scene,
  );
  // Set the light's intensity
  light.intensity = 0.5;
  light.diffuse = new Color3(0.49, 0.02, 0.33);
  light.specular = new Color3(1, 0, 0.83);
  scene.registerBeforeRender(function () {
    //console.log('cameraCollisionMesh.position', camera._children[0].getAbsolutePosition())
    light.position = camera.position; // You can adjust the scale factor as needed
    //cameraCollisionMesh.position = camera.position;
    light.direction = camera.getDirection(Axis.Z);
  });

  // Create a fog effect
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.002; // Adjust fog density as needed
  // Enable depth of field
  camera.useDepthOfField = true;
  // Set depth of field parameters
  camera.focalLength = 10; // Adjust focal length as needed
  camera.fStop = 1.4; // Adjust fStop as needed
};

export const mobileVRCameraResponsiveFreeCam = async (
  scene: any,
  camera: any,
  setEnableRoot: any,
  cameraType: any = {
    desktop: "desktopCamera",
    mobile:
      window.innerHeight > window.innerWidth
        ? "mobileCamWithSwipe"
        : "virtualJoystick",
  },
) => {
  const isDeviceMobile = isMobile();

  if (!camera || (!scene.activeCamera && scene)) {
    if (!isDeviceMobile) {
      camera = getCamera(scene, cameraType.desktop);
    } else {
      camera = getCamera(scene, cameraType.mobile);
    }
    camera.inputs.add(new FreeCameraGamepadInput());
    camera.inputs.addGamepad();
    await xrPolyfillPromise;
    const vrHelper = await scene.createDefaultXRExperienceAsync({
      createDeviceOrientationCamera: false,
    });
    vrHelper.baseExperience.onStateChangedObservable.add((state) => {
      switch (state) {
        case WebXRState.IN_XR:
          // XR is initialized and already submitted one frame
          setEnableRoot(false);
          break;
        case WebXRState.ENTERING_XR:
          break;
        case WebXRState.EXITING_XR:
          // xr exit request was made. not yet done.
          break;
        case WebXRState.NOT_IN_XR:
          // self explanatory - either out or not yet in XR
          break;
        default:
          break;
      }
    });

    const vrCamera = vrHelper.baseExperience.camera;
    // debugger
    vrCamera.checkCollisions = true;
    vrCamera.applyGravity = true;
    vrCamera.ellipsoid = new Vector3(1.5, 1.5, 1.5);
    (camera as any).inputs.attached.gamepad.gamepadAngularSensibility = 250;
    enableXrControls(scene, vrHelper);
    addCameraPhysics(camera, scene);
  }
};
