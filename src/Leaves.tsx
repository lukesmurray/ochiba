import { Instance, Instances, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo, useRef, useState } from "react";
import { DoubleSide, Vector3, Vector3Tuple } from "three";

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
  color: "#ff8f00",
  metalness: { value: 0, min: 0, max: 1, step: 0.001 },
  displacementBias: { value: 0, min: 0, max: 1, step: 0.001 },
  displacementScale: { value: 0.03, min: 0, max: 1, step: 0.001 },
  roughness: { value: 1, min: 0, max: 1, step: 0.001 },
  wireframe: false,
  segments: { value: 1, min: 1, max: 512, step: 1 },
  numInstances: { value: 100, min: 1, max: 1000, step: 1 },
  alphaTest: { value: 0.3, min: 0, max: 1, step: 0.001 },
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
        toneMapped={false}
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
          // eslint-disable-next-line react/no-array-index-key
          <Leaf key={idx} />
        ))}
    </Instances>
  );
}

function Leaf() {
  const { windSpeed } = useControls("wind", {
    windSpeed: { value: 1.5, min: 0, max: 10, step: 0.001 },
  });
  const camera = useThree((s) => s.camera);
  const instanceRef = useRef<any>();

  // initial position on edge of fustrum
  const initialLeft = useMemo(() => Math.random(), []);
  const initialTop = useMemo(() => -1 + Math.random() * 0.2, []);
  const initialDepth = useMemo(() => 0.975 + Math.random() * 0.02, []);
  const initialPosition = useMemo<Vector3>(
    () =>
      new Vector3(
        -1 + 2 * initialLeft,
        1 - 2 * initialTop,
        initialDepth
      ).unproject(camera),
    [camera, initialDepth, initialLeft, initialTop]
  );
  const initialRotation = useMemo<Vector3Tuple>(() => {
    return [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ];
  }, []);
  const initialVelocity = useMemo<Vector3Tuple>(
    () => [
      (Math.random() + 0.1) * windSpeed,
      Math.random() - 0.5,
      Math.random() - 0.5,
    ],
    [windSpeed]
  );
  const [velocity, setVelocity] = useState<Vector3Tuple>(initialVelocity);

  useFrame((scene, delta) => {
    const { current: instance } = instanceRef;
    if (!instance) {
      return;
    }

    const { position, rotation } = instance;

    position.set(
      position.x + velocity[0] * delta,
      position.y + velocity[1] * delta,
      position.z + velocity[2] * delta
    );

    rotation.set(
      rotation.x + delta * 0.5,
      rotation.y + delta * 0.5,
      rotation.z
    );

    const cameraPosition = position.clone().project(camera);

    const epsilon = 0.2;

    if (
      cameraPosition.z > 1 + epsilon ||
      cameraPosition.z < -1 - epsilon ||
      cameraPosition.y > 1 + epsilon ||
      cameraPosition.y < -1 - epsilon ||
      cameraPosition.x > 1 + epsilon ||
      cameraPosition.x < -1 - epsilon
    ) {
      const newPosition = new Vector3(
        -1 + 2 * initialLeft,
        1.1,
        initialDepth
      ).unproject(camera);
      position.set(newPosition.x, newPosition.y, newPosition.z);
      setVelocity(initialVelocity);
    } else {
      setVelocity([velocity[0], velocity[1] - 0.01, velocity[2]]);
    }
  });

  return (
    <Instance
      ref={instanceRef}
      position={initialPosition}
      rotation={initialRotation}
    />
  );
}
