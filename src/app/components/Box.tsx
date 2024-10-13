import * as THREE from "three";
import React, { useRef, useState } from "react";
import { ThreeElements, useThree } from "@react-three/fiber";
import { useGesture } from "react-use-gesture";
import { useSpring, a } from "@react-spring/three";

function Box(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));
  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) =>
      set({
        position: [x / aspect, -y / aspect, 0],
        rotation: [y / aspect, x / aspect, 0],
      }),
    onHover: ({ hovering }) =>
      set({ scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1] }),
  });

  // useFrame((state, delta) => (ref.current.rotation.x += delta));
  return (
    <a.mesh
      {...spring}
      {...bind()}
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </a.mesh>
  );
}
