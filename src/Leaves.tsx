import { Instance, Instances, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo, useState } from "react";
import { DoubleSide, Vector3Tuple } from "three";

const leafIdxToTextureCoords: Array<{
  offset: [number, number];
  repeat: [number, number];
}> = [
  {
    offset: [-0.04, 0],
    repeat: [0.25, 0.5],
  },
  {
    offset: [0.18, -0.01],
    repeat: [0.25, 0.5],
  },
  {
    offset: [0.46, -0.01],
    repeat: [0.25, 0.5],
  },
  {
    offset: [0.73, -0.01],
    repeat: [0.25, 0.5],
  },
  {
    offset: [-0.04, 0.51],
    repeat: [0.25, 0.5],
  },
  {
    offset: [0.22, 0.49],
    repeat: [0.25, 0.5],
  },
  {
    offset: [0.46, 0.48],
    repeat: [0.25, 0.5],
  },
  {
    offset: [0.73, 0.51],
    repeat: [0.25, 0.5],
  },
];

interface LeavesProps {
  leafTextureIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export const leavesControlsInitialValues = {
  color: "#ff0000",
  metalness: { value: 0, min: 0, max: 1, step: 0.001 },
  displacementBias: { value: 0, min: 0, max: 1, step: 0.001 },
  displacementScale: { value: 0.03, min: 0, max: 1, step: 0.001 },
  roughness: { value: 1, min: 0, max: 1, step: 0.001 },
  wireframe: false,
  segments: { value: 1, min: 1, max: 512, step: 1 },
  numInstances: { value: 100, min: 1, max: 1000, step: 1 },
  radius: { value: 10, min: 1, max: 100, step: 1 },
  alphaTest: { value: 0.5, min: 0, max: 1, step: 0.001 },
  envMapIntensity: { value: 1, min: 0, max: 10, step: 0.001 },
};

export function Leaves({ leafTextureIndex: leafIndex }: LeavesProps) {
  const {
    color,
    metalness,
    displacementBias,
    displacementScale,
    roughness,
    wireframe,
    segments,
    radius,
    numInstances,
    alphaTest,
    envMapIntensity,
  } = useControls("leaves", leavesControlsInitialValues);

  const { offset: textureOffset, repeat: textureRepeat } =
    leafIdxToTextureCoords[leafIndex];

  const textureLeafColor = useTexture(
    "/assets/textures/LeafSet021_1K-JPG/LeafSet021_1K_Color.jpg"
  );
  const textureLeafDisplacement = useTexture(
    "/assets/textures/LeafSet021_1K-JPG/LeafSet021_1K_Displacement.jpg"
  );
  const textureLeafNormal = useTexture(
    "/assets/textures/LeafSet021_1K-JPG/LeafSet021_1K_NormalGL.jpg"
  );
  const textureLeafOpacity = useTexture(
    "/assets/textures/LeafSet021_1K-JPG/LeafSet021_1K_Opacity.jpg"
  );

  const uvs = useMemo(() => {
    const result = new Float32Array((segments + 1) * (segments + 1) * 2);
    for (let s = 0; s < segments + 1; s += 1) {
      for (let t = 0; t < segments + 1; t += 1) {
        const u = s / segments;
        const v = 1 - t / segments;
        result[(s + t * (segments + 1)) * 2] =
          u * textureRepeat[0] + textureOffset[0];
        result[(s + t * (segments + 1)) * 2 + 1] =
          v * textureRepeat[1] + textureOffset[1];
      }
    }
    return result;
  }, [segments, textureOffset, textureRepeat]);

  return (
    <Instances>
      <planeGeometry args={[1, 1, segments, segments]}>
        <bufferAttribute
          attach="attributes-uv"
          count={uvs.length / 2}
          itemSize={2}
          array={uvs}
        />
      </planeGeometry>
      <meshStandardMaterial
        color={color}
        map={textureLeafColor}
        displacementMap={textureLeafDisplacement}
        displacementBias={displacementBias}
        displacementScale={displacementScale}
        normalMap={textureLeafNormal}
        alphaMap={textureLeafOpacity}
        roughness={roughness}
        metalness={metalness}
        side={DoubleSide}
        wireframe={wireframe}
        transparent
        alphaTest={alphaTest}
        envMapIntensity={envMapIntensity}
      />
      {Array(numInstances)
        .fill(null)
        .map((_, idx) => (
          <Leaf key={idx} radius={radius} />
        ))}
    </Instances>
  );
}

interface LeafProps {
  radius: number;
}

function Leaf({ radius }: LeafProps) {
  const [leafRadius] = useState(Math.random() * radius);
  const [y] = useState(Math.random() * radius);
  const [theta, setTheta] = useState(Math.random() * Math.PI * 2);
  const [rotation, setRotation] = useState<Vector3Tuple>(randomEuler());

  useFrame((state, delta) => {
    setTheta(theta + delta * 0.1);
    setRotation([rotation[0] + delta, rotation[1] + delta, rotation[2]]);
  });

  return (
    <Instance
      position={[Math.sin(theta) * leafRadius, y, Math.cos(theta) * leafRadius]}
      rotation={rotation}
    />
  );
}

const randomVec3 = (radius: number): Vector3Tuple => {
  return [
    (Math.random() - 0.5) * radius,
    (Math.random() - 0.5) * radius,
    (Math.random() - 0.5) * radius,
  ];
};

const randomEuler = (): Vector3Tuple => {
  return [
    (Math.random() - 0.5) * Math.PI,
    (Math.random() - 0.5) * Math.PI,
    (Math.random() - 0.5) * Math.PI,
  ];
};

// ideas
// - place them in a pile on the floor and have them jump
// - when they hit the floor, rotate them to be flat
