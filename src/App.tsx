import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { sRGBEncoding } from "three";
import { Leaves } from "./Leaves";
import { SkyBackground } from "./SkyBackground";

function App() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} />
      <OrbitControls makeDefault target={[0, 5, 0]} />

      <SkyBackground />
      <Environment
        files="/assets/hdr/autumn_forest_04_1k.hdr"
        encoding={sRGBEncoding}
      />

      <Leaves leafTextureIndex={0} position-x={-4} />
      <Leaves leafTextureIndex={1} position-x={-3} />
      <Leaves leafTextureIndex={2} position-x={-2} />
      <Leaves leafTextureIndex={3} position-x={-1} />
      <Leaves leafTextureIndex={4} position-x={0} />
      <Leaves leafTextureIndex={5} position-x={1} />
      <Leaves leafTextureIndex={6} position-x={2} />
      <Leaves leafTextureIndex={7} position-x={3} />

      <Perf position="bottom-right" />
    </Canvas>
  );
}

export default App;
