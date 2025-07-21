import { useThree, useFrame } from "@react-three/fiber";

export default function FloorBoundary({ controlsRef, floorHeight = 1 }) {
	const { camera } = useThree();

	useFrame(() => {
		if (!controlsRef.current) return;

		if (camera.position.y < floorHeight) {
			camera.position.y = floorHeight;
			controlsRef.current.update();
		}

		if (controlsRef.current.target.y < floorHeight) {
			controlsRef.current.target.y = floorHeight;
			controlsRef.current.update();
		}
	});

	return null;
}
