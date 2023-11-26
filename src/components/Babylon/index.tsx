import React, { useCallback, useState, useEffect, useRef } from "react";
import { Vector2, Vector3, Color3, ArcRotateCamera } from "@babylonjs/core";
import { Engine, Scene, useScene } from "react-babylonjs";
import globals from "@utils/globals";
import { Inspector } from "@babylonjs/inspector";
const { isDebug } = globals;

let customProceduralTexture = null;
let time = 0;
let engine;

interface ArcCameraAtomProps {
  name: string;
  target: Vector3;
  alpha: number;
  beta: number;
  radius: number;
  lowerRadiusLimit?: number;
  disableZoom: boolean;
}

export const ArcCameraAtom = (props: ArcCameraAtomProps) => {
  const { radius, lowerRadiusLimit, name, target, alpha, beta, disableZoom } =
    props;
  const cameraRef = useRef<ArcRotateCamera>(null);
  let _radius = radius ? radius : 32;
  let _lowerRadiusLimit = lowerRadiusLimit ? lowerRadiusLimit : 0;
  const _name = name ? name : "ArcCameraAtom";
  const _target = target ? target : new Vector3(0, 1.0, 1.0);
  const _alpha = 1.7;
  const _beta = 1.4;
  if (disableZoom) {
    _lowerRadiusLimit = _radius;
  }

  React.useEffect(() => {
    if (cameraRef.current && disableZoom) {
      cameraRef.current.inputs.removeByType("ArcRotateCameraMouseWheelInput");
      cameraRef.current.inputs.removeByType("ArcRotateCameraPointersInput");
    }
  }, []);

  return (
    <arcRotateCamera
      ref={cameraRef}
      name={_name}
      target={_target}
      alpha={_alpha}
      beta={_beta}
      radius={_radius}
      lowerRadiusLimit={_lowerRadiusLimit}
    />
  );
};

export const SceneBabylon = (props: any) => {
  const [hasInit, setHasInit] = useState(false);
  const scene = useScene();
  useEffect(() => {
    if (!scene) return;
    if (isDebug && !hasInit) {    
      (window as any).scene = scene;
      Inspector.Show(scene, {
        embedMode: false,
      });
      (window as any).inspector = Inspector
      setHasInit(true)
    }
  }, [hasInit, scene])
  

  return (
    <>
      {props.freeCamera && (
        <freeCamera
          name="camera1"
          position={new Vector3(-50, 5, -10)}
          setTarget={[new Vector3(-50, 5, 1.0)]}
        />
      )}
      {!props.freeCamera && <ArcCameraAtom {...props} />}
      <pointLight
        name="light2"
        position={new Vector3(0, 2, 0)}
        diffuse={Color3.FromHexString("#72CDFF")}
        specular={Color3.FromHexString("#FF00D5")}
      />
      <hemisphericLight
        name="light1"
        intensity={0.7}
        direction={Vector3.Up()}
        diffuse={Color3.FromHexString("#ffffff")}
        groundColor={Color3.FromHexString("#7528FB")}
      />
      {props.children}
    </>
  );
};

export const BabylonBase = (props: any) => {
  const [hasInit, setInit] = useState(false);
  const scene = useScene();
  const engineRef: any | undefined = useCallback((component: any) => {
    engine = component;
    setInit(true);
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", width: '100vw', height: '100vh' }}>
      <Engine
        //createEngine={(<canvas />) as any}
        antialias
        adaptToDeviceRatio
        canvasId="babylonJS"
      >
        <Scene>{props.children}</Scene>
      </Engine>
    </div>
  );
};
