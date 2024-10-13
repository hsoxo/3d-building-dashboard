import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

const Box = ({
  id,
  name,
  handleBuildingClick,
  position,
  size,
}: {
  id: string;
  name: string;
  handleBuildingClick: (buildingId: string) => void;
  position: [number, number, number];
  size: [number, number, number];
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      onClick={() => handleBuildingClick(id)}
      position={position}
      onPointerOver={() => setHovered(true)} // Change cursor to pointer when hovering
      onPointerOut={() => setHovered(false)} // Revert to default when leaving
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={hovered ? "orange" : "gray"}
        transparent={true} // Enable transparency
        opacity={0.5} // Set opacity level (0.0 = fully transparent, 1.0 = fully opaque)
        side={2} // Apply to both sides of the geometry (DoubleSide: THREE.DoubleSide)
      />
      <Html center distanceFactor={5}>
        <div className="label">{name}</div>
      </Html>
    </mesh>
  );
};

function CameraRig({
  position: [x, y, z],
  isTopView,
  controlsRef,
  buttonClicked,
}: {
  position: [number, number, number];
  isTopView: boolean;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  buttonClicked: string;
}) {
  const { camera } = useThree(); // Access the camera object

  useEffect(() => {
    console.log("CameraRig useEffect", buttonClicked);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);

    if (isTopView) {
      camera.rotation.z = Math.PI / 2;
    }
    controlsRef.current?.update();
  }, [camera, controlsRef, isTopView, x, y, z, buttonClicked]);

  return null;
}

function Warehouse() {
  const [position, setPosition] = useState<[number, number, number]>([5, 5, 5]);
  const [isTopView, setIsTopView] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(v4());

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const setTopView = () => {
    setPosition([0, 10, 0]);
    setIsTopView(true);
    setButtonClicked(v4());
  };

  const set45DegreeView = () => {
    setPosition([5, 5, 5]);
    setIsTopView(false);
    setButtonClicked(v4());
  };

  const handleBuildingClick = (buildingId: string) => {
    setSelectedBuilding(buildingId);
  };

  return (
    <>
      <div
        className={`w-full h-screen ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <Canvas
          onPointerMissed={() => setSelectedBuilding(null)}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <axesHelper args={[5]} />

          <CameraRig
            position={position}
            isTopView={isTopView}
            controlsRef={controlsRef}
            buttonClicked={buttonClicked}
          />
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />

          {/* Layout of Buildings */}
          <group>
            <Box
              id="Building 1"
              name="Building 1"
              handleBuildingClick={handleBuildingClick}
              position={[-2, 0, 2]}
              size={[1, 1, 3]}
            />
            <Box
              id="Building 2"
              name="Building 2"
              handleBuildingClick={handleBuildingClick}
              position={[0, 0, 2]}
              size={[1, 1, 3]}
            />
            <Box
              id="Building 3"
              name="Building 3"
              handleBuildingClick={handleBuildingClick}
              position={[2, 0, 0]}
              size={[1, 1, 7]}
            />

            <Box
              id="Building 4"
              name="Building 4"
              handleBuildingClick={handleBuildingClick}
              position={[-2, 0, -2]}
              size={[1, 1, 3]}
            />
            <Box
              id="Building 5"
              name="Building 5"
              handleBuildingClick={handleBuildingClick}
              position={[0, 0, -2]}
              size={[1, 1, 3]}
            />
          </group>
          <OrbitControls
            ref={controlsRef}
            target={[0, 0, 0]}
            maxPolarAngle={isTopView ? 0 : Math.PI}
            minPolarAngle={isTopView ? 0 : 0}
            enabled={!isTopView}
            onStart={() => setIsTopView(false)}
          />
        </Canvas>
      </div>

      <div className="fixed top-2 right-2 flex gap-2">
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={setTopView}
        >
          Top View
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={set45DegreeView}
        >
          45° View
        </button>
      </div>

      <div
        className={`fixed top-2 left-2 transform bg-white w-96 p-6 rounded-lg shadow-lg transition-transform duration-500 ease-in-out ${
          selectedBuilding ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {selectedBuilding ? (
          <>
            <h3>{selectedBuilding}</h3>
            <p>Some data related to {selectedBuilding}</p>
            <button onClick={() => setSelectedBuilding(null)}>Close</button>
          </>
        ) : null}
      </div>
    </>
  );
}

export default Warehouse;
