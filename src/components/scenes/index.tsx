import { BabylonBase, SceneBabylon } from "@babylon";
import { DynamicTerrain, useScene } from "react-babylonjs";
import {
  Vector3,
  Color3,
  Color4,
  StandardMaterial as StandardMaterialJ,
} from "@babylonjs/core";
import { useEffect } from "react";

const xSize = 500;
const zSize = 500;
const subSize = 100;

const getMapData = () => {
  let mapSubX = xSize;
  let mapSubZ = zSize;

  // map creation
  let mapData = new Float32Array(mapSubX * mapSubZ * 3);
  for (var l = 0; l < mapSubZ; l++) {
    for (var w = 0; w < mapSubX; w++) {
      mapData[3 * (l * mapSubX + w)] = (w - mapSubX * 0.5) * 2.0;
      mapData[3 * (l * mapSubX + w) + 1] =
        (w / (l + 1)) * Math.sin((l + 1) / 2) * Math.cos(w / 2) * 2.0;
      mapData[3 * (l * mapSubX + w) + 2] = (l - mapSubZ * 0.5) * 2.0;
    }
  }
  return mapData;
};

const BabylonJSScene:any = (props:any) => {
    const scene = useScene();
    scene?.onBeforeRenderObservable.add(() => {
        (scene.activeCamera! as any).rotation.z = (scene.activeCamera! as any).rotation.x = (scene.activeCamera! as any).rotation.y = 0; 
        (scene.activeCamera! as any).target._z = scene.activeCamera!.position.z += 0.5; // Adjust the speed as needed
    });
    const DTerrain: any = DynamicTerrain;
    return (
        <DTerrain
        name="ContinuousTerrain"
        mapData={getMapData()}
        mapSubX={xSize}
        mapSubZ={zSize}
        terrainSub={subSize}
        position={new Vector3(0, 0, 0)}
      >
        <standardMaterial
          name="terrain-material"
          diffuseColor={Color3.Green()}
          assignTo="mesh.material"
          wireframe={true}
        />
      </DTerrain>
    )
}

const BaseScene: any = (props: any): any => {
  return (
    <BabylonBase>
      <SceneBabylon freeCamera>
        <BabylonJSScene />
      </SceneBabylon>
    </BabylonBase>
  );
};

export default BaseScene;
