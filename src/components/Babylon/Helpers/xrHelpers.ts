/* eslint-disable no-loop-func */
import {
  ButtonToPush,
  simulateKeyPress,
  simulateKeyRelease,
} from "../utilities";
import { endAllMovement } from "./Cameras";
import { EventState, Quaternion, Vector3 } from "@babylonjs/core";
export const enableXrControls = (scene, xr) => {
  /*
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
          case PointerEventTypes.POINTERDOWN:
            console.log("POINTER DOWN");
            break;
          case PointerEventTypes.POINTERUP:
            console.log("POINTER UP");
            break;
          case PointerEventTypes.POINTERMOVE:
            console.log("POINTER MOVE");
            break;
          case PointerEventTypes.POINTERWHEEL:
            console.log("POINTER WHEEL");
            break;
          case PointerEventTypes.POINTERPICK:
            console.log("POINTER PICK");
            break;
          case PointerEventTypes.POINTERTAP:
            console.log("POINTER TAP");
            break;
          case PointerEventTypes.POINTERDOUBLETAP:
            console.log("POINTER DOUBLE-TAP");
            break;
        }
        */
  document.addEventListener("keydown", async (event) => {
    // Check if the pressed key is the "Escape" key (key code 27)
    if (event.keyCode === 27) {
      // Manually exit VR mode
      if (scene.activeCamera.id === "webxr") {
        await xr.baseExperience.exitXRAsync();
      } else {
        //console.log('The scene is not in VR mode.');
      }
    }
  });
  //debugger;
  //xr.input.xrCamera.collisionsEnabled = true;
  /*
  xr.input.xrCamera.physicsImpostor = new PhysicsImpostor(
    xr.input.xrCamera,
    PhysicsImpostor.SphereImpostor, // Adjust to match your avatar's shape
    { mass: 1, restitution: 0, friction: 1 },
    scene
  );
  */

  xr.input.xrCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);
  xr.input.xrCamera.keysUp.push(ButtonToPush.Forward);
  xr.input.xrCamera.keysDown.push(ButtonToPush.Backward);
  xr.input.xrCamera.keysRight.push(ButtonToPush.Right);
  xr.input.xrCamera.keysLeft.push(ButtonToPush.Left);

  xr.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      if (motionController.handness === "left") {
        const xr_ids = motionController.getComponentIds();
        let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
        triggerComponent.onButtonStateChangedObservable.add(() => {
          if (triggerComponent.pressed) {
            console.log("xr-standard-trigger left");
          } else {
            console.log("xr-standard-trigger left out");
          }
        });
        let squeezeComponent = motionController.getComponent(xr_ids[1]); //xr-standard-squeeze
        squeezeComponent.onButtonStateChangedObservable.add(() => {
          if (squeezeComponent.pressed) {
            console.log("xr-standard-squeeze left");
          } else {
            console.log("xr-standard-squeeze left out");
          }
        });
        let thumbstickComponent = motionController.getComponent(xr_ids[2]); //xr-standard-thumbstick
        thumbstickComponent.onButtonStateChangedObservable.add(() => {
          if (thumbstickComponent.pressed) {
            console.log("xr-standard-thumbstick left");
          } else {
            console.log("xr-standard-thumbstick left out");
          }

          let axes = thumbstickComponent.axes;
          console.log("xr-standard-thumbstick axes", axes);
        });
        thumbstickComponent.onAxisValueChangedObservable.add((axes) => {
          //https://playground.babylonjs.com/#INBVUY#87
          //inactivate camera rotation : not working so far

          /*
                         let rotationValue = 0;
                         const matrix = new Matrix();
                         let deviceRotationQuaternion = webXRInput.xrCamera.getDirection(Axis.Z).toQuaternion(); // webXRInput.xrCamera.rotationQuaternion;
                         var angle = rotationValue * (Math.PI / 8);
                         var quaternion = Quaternion.RotationAxis(Axis.Y, angle);
                         const move = new Vector3(0,0,0);
                         deviceRotationQuaternion = deviceRotationQuaternion.multiply(quaternion);
                         Matrix.FromQuaternionToRef(deviceRotationQuaternion, matrix);
                         const addPos = Vector3.TransformCoordinates(move, matrix);
                         addPos.y = 0;
     
                         webXRInput.xrCamera.position = webXRInput.xrCamera.position.add(addPos);
                        // webXRInput.xrCamera.rotationQuaternion = Quaternion.Identity();
                         
                         //webXRInput.xrCamera.rotation = new Vector3(0,0,0);
                         */
          //Box_Left_ThumbStick is moving according to stick axes but camera rotation is also changing..
          // Box_Left_ThumbStick.position.x += (axes.x)/100;
          //  Box_Left_ThumbStick.position.y -= (axes.y)/100;
          // console.log(values.x, values.y);
          console.log("xr-standard-thumbstick axes", axes.x, axes.y);
        });

        let xbuttonComponent = motionController.getComponent(xr_ids[3]); //x-button
        xbuttonComponent.onButtonStateChangedObservable.add(() => {
          if (xbuttonComponent.pressed) {
            console.log("x-button left");
          } else {
            console.log("x-button left out");
          }
        });
        let ybuttonComponent = motionController.getComponent(xr_ids[4]); //y-button
        ybuttonComponent.onButtonStateChangedObservable.add(() => {
          if (ybuttonComponent.pressed) {
            console.log("y-button left");
          } else {
            console.log("y-button left out");
          }
        });
      }
      if (motionController.handness === "right") {
        const xr_ids = motionController.getComponentIds();
        let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
        triggerComponent.onButtonStateChangedObservable.add(() => {
          if (triggerComponent.pressed) {
            console.log("xr-standard-trigger right");
          } else {
            console.log("xr-standard-trigger right out");
          }
        });
        let squeezeComponent = motionController.getComponent(xr_ids[1]); //xr-standard-squeeze
        squeezeComponent.onButtonStateChangedObservable.add(() => {
          if (squeezeComponent.pressed) {
            console.log("xr-standard-squeeze right");
          } else {
            console.log("xr-standard-squeeze right out");
          }
        });
        let thumbstickComponent = motionController.getComponent(xr_ids[2]); //xr-standard-thumbstick
        thumbstickComponent.onButtonStateChangedObservable.add(() => {
          if (thumbstickComponent.pressed) {
            console.log("xr-standard-thumbstick right");
          } else {
            console.log("xr-standard-thumbstick out right");
          }
        });
        thumbstickComponent.onAxisValueChangedObservable.add((axes) => {
          //Box_Right_ThumbStick is moving according to stick axes but camera rotation is also changing..
          // Box_Right_ThumbStick.position.x += (axes.x)/100;
          // Box_Right_ThumbStick.position.y += (axes.y)/100;
          console.log(axes.x, axes.y);
        });

        let abuttonComponent = motionController.getComponent(xr_ids[3]); //a-button
        abuttonComponent.onButtonStateChangedObservable.add(() => {
          if (abuttonComponent.pressed) {
            console.log("Right_AButton");
          } else {
            console.log("Right_AButton out");
          }
        });
        let bbuttonComponent = motionController.getComponent(xr_ids[4]); //b-button
        bbuttonComponent.onButtonStateChangedObservable.add(() => {
          if (bbuttonComponent.pressed) {
            console.log("b-button");
          } else {
            console.log("b-button out");
          }
        });
      }
    });

    // });
  });

  let rotationValue = 0;
  let direction = "";
  let moveDirection = new Vector3(0, 0, 0);
  const acceleration = 0.02; // Adjust the acceleration rate
  const maxSpeed = 0.5; // Adjust the maximum speed
  xr.input.onControllerAddedObservable.add((controller) => {
    const moveSpeed = 0.7;
    controller.onMotionControllerInitObservable.add((controller) => {
      if (controller.handness == "left") {
        let ids = controller.getComponentIds();
        for (let i = 0; i < ids.length; i++) {
          let component = controller.getComponent(ids[i]);
          switch (ids[i]) {
            case "xr-standard-thumbstick":
              component.onAxisValueChangedObservable.add(function (
                eventData: { x: number; y: number },
                _: EventState,
              ) {
                const { x, y } = eventData;

                // Determine the direction based on thumbstick values

                if (Math.abs(x) > Math.abs(y)) {
                  if (x > 0) {
                    direction = "Right";
                  } else {
                    direction = "Left";
                  }
                } else {
                  if (y > 0) {
                    direction = "Backward";
                  } else {
                    direction = "Forward";
                  }
                }

                if (Math.abs(x) < 0.2 && Math.abs(y) < 0.2) {
                  endAllMovement(scene.getEngine().getRenderingCanvas());
                  direction = "";
                }

                console.log(`Thumbstick direction: ${direction}`);

                // Update the camera's velocity gradually
                moveDirection = new Vector3(
                  x * moveSpeed * acceleration,
                  0,
                  -y * moveSpeed * acceleration,
                );

                // Limit the speed to the maximum
                if (moveDirection.length() > maxSpeed) {
                  moveDirection.normalize().scaleInPlace(maxSpeed);
                }
              });
              break;
          }
        }
      } else if (controller.handness == "right") {
        let ids = controller.getComponentIds();
        for (let i = 0; i < ids.length; i++) {
          let component = controller.getComponent(ids[i]);
          switch (ids[i]) {
            case "xr-standard-thumbstick":
              var isHorizontalRotate = false;

              // https://github.com/BabylonJS/js/blob/6a6a5cfc2354fff165d9bae083185ef602440625/src/XR/features/WebXRControllerTeleportation.ts#L573-L576
              // eslint-disable-next-line no-loop-func
              component.onAxisValueChangedObservable.add(function (
                eventData: { x: number; y: number },
                _: EventState,
              ) {
                const { x } = eventData;

                if (isHorizontalRotate && Math.abs(x) > 0.8) {
                  isHorizontalRotate = false;

                  var rotationAngle = Math.PI / 8;
                  if (x <= 0) {
                    rotationAngle = -rotationAngle;
                    rotationValue--;
                  } else {
                    rotationValue++;
                  }

                  const eulerAngles = Quaternion.FromEulerAngles(
                    0,
                    rotationAngle,
                    0,
                  );
                  xr.input.xrCamera.rotationQuaternion.multiplyInPlace(
                    eulerAngles,
                  );
                } else if (Math.abs(x) < 0.8) {
                  isHorizontalRotate = true;
                }
              });
              break;
          }
        }
      }
    });
  });
  scene.onBeforeRenderObservable.add(() => {
    //xr.input.xrCamera.position.addInPlace(moveDirection);
    simulateKeyPress(
      ButtonToPush[direction],
      scene.getEngine().getRenderingCanvas(),
    );
  });
};
