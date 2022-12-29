import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { sRGBEncoding } from "three";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import { useControls } from "leva";
import { Leaves } from "./Leaves";
import { SkyBackground } from "./SkyBackground";

function App() {
  const { bloomIntensity, bloomLuminanceThreshold } = useControls("bloom", {
    bloomIntensity: { value: 0.1, min: 0, max: 1, step: 0.001 },
    bloomLuminanceThreshold: { value: 0, min: 0, max: 1, step: 0.001 },
  });

  return (
    <Canvas>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 12]}
        rotation={[0, 0, 0]}
      />

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

      <ContactShadows
        position={[0, 0, 0]}
        width={20}
        height={20}
        opacity={1}
        scale={10}
        blur={0}
        far={10}
        resolution={1024}
        color="#000000"
      />

      <EffectComposer multisampling={4}>
        <Bloom
          mipmapBlur
          intensity={bloomIntensity}
          luminanceThreshold={bloomLuminanceThreshold}
        />
      </EffectComposer>

      <Perf position="bottom-right" />
      <Stats showPanel={0} />
    </Canvas>
  );
}

export default App;
