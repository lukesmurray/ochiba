import { Sky } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { MathUtils, Vector3 } from "three";

export function SkyBackground() {
  const {
    turbidity,
    rayleigh,
    mieCoefficient,
    mieDirectionalG,
    elevation,
    azimuth,
    exposure,
    distance,
    lightColor,
    lightIntensity,
  } = useControls("sky", {
    turbidity: { value: 2.6, min: 1, max: 20, step: 0.1 },
    rayleigh: { value: 4, min: 0, max: 4, step: 0.001 },
    mieCoefficient: { value: 0.01, min: 0, max: 0.1, step: 0.001 },
    mieDirectionalG: { value: 0.3, min: 0, max: 1, step: 0.001 },
    elevation: { value: 3.5, min: 0, max: 90, step: 0.001 },
    azimuth: { value: 60.4, min: -180, max: 180, step: 0.1 },
    exposure: { value: 0.6, min: 0, max: 1, step: 0.001 },
    distance: { value: 400000, min: 0, max: 1000000, step: 1 },
    lightColor: "#ffbf00",
    lightIntensity: { value: 0.25, min: 0, max: 2, step: 0.001 },
  });

  const phi = MathUtils.degToRad(90 - elevation);
  const theta = MathUtils.degToRad(azimuth);
  const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);

  useFrame(({ gl }) => {
    // eslint-disable-next-line no-param-reassign
    gl.toneMappingExposure = exposure;
  });

  return (
    <>
      <Sky
        distance={distance}
        sunPosition={sunPosition}
        mieCoefficient={mieCoefficient}
        mieDirectionalG={mieDirectionalG}
        rayleigh={rayleigh}
        turbidity={turbidity}
      />
      {/* directional light from same direction as the sun */}
      <directionalLight
        position={sunPosition}
        color={lightColor}
        intensity={lightIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
    </>
  );
}
