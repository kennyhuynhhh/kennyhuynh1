import { useThree, useFrame } from "@react-three/fiber";

export default function CeilingBoundary({ controlsRef, ceilingHeight }) {
	const { camera } = useThree();

	useFrame(() => {
		if (!controlsRef.current) return;

		if (camera.position.y > ceilingHeight) {
			camera.position.y = ceilingHeight;
			controlsRef.current.update();
		}

		if (controlsRef.current.target.y > ceilingHeight) {
			controlsRef.current.target.y = ceilingHeight;
			controlsRef.current.update();
		}
	});

	return null;
}
