// components/camera/WallBoundary.js
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WallBoundary({ controlsRef, widthFromCentre }) {
	useFrame(({ camera }) => {
		if (!controlsRef.current) return;

		// Set camera limits based on wall positions
		const minX = -widthFromCentre + 5; // left wall (slightly inside to avoid clipping)
		const maxX = widthFromCentre - 5; // right wall
		const maxZ = 70; // back wall is at z = -23, so camera should not go beyond z = -23
		const minZ = -20; //front wall

		camera.position.x = THREE.MathUtils.clamp(camera.position.x, minX, maxX);
		camera.position.z = THREE.MathUtils.clamp(camera.position.z, minZ, maxZ);

		// Optionally clamp the controls target too, to prevent orbiting past walls
		if (controlsRef.current.target) {
			controlsRef.current.target.x = THREE.MathUtils.clamp(
				controlsRef.current.target.x,
				minX,
				maxX
			);
			controlsRef.current.target.z = THREE.MathUtils.clamp(
				controlsRef.current.target.z,
				minZ,
				maxZ
			);
		}

		controlsRef.current.update();
	});

	return null;
}
