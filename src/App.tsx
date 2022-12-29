import { Stage, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Leaves } from "./Leaf";

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0.5, 8], fov: 35 }}>
      <Stage
        intensity={0.5}
        preset="rembrandt"
        adjustCamera={1.75}
        environment="city"
      >
        <Leaves leafTextureIndex={0} position-x={-4} />
        <Leaves leafTextureIndex={1} position-x={-3} />
        <Leaves leafTextureIndex={2} position-x={-2} />
        <Leaves leafTextureIndex={3} position-x={-1} />
        <Leaves leafTextureIndex={4} position-x={0} />
        <Leaves leafTextureIndex={5} position-x={1} />
        <Leaves leafTextureIndex={6} position-x={2} />
        <Leaves leafTextureIndex={7} position-x={3} />
      </Stage>

      <OrbitControls makeDefault />

      <Perf position="bottom-right" />
    </Canvas>
  );
}

export default App;
