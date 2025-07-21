import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function CameraLerp({
	controlsRef,
	cameraPos,
	target,
	isStarted,
	onTransitionComplete,
}) {
	const { camera } = useThree();
	const transitionComplete = useRef(false);

	// Reset lerp flag whenever cameraPos or target changes
	useEffect(() => {
		transitionComplete.current = false;
	}, [cameraPos, target]);

	useFrame(() => {
		if (!controlsRef.current || !cameraPos || !target) return;
		if (transitionComplete.current || !isStarted) return;

		const cameraDistance = camera.position.distanceTo(cameraPos);
		const targetDistance = controlsRef.current.target.distanceTo(target);

		if (cameraDistance < 0.2 && targetDistance < 0.2) {
			camera.position.copy(cameraPos);
			controlsRef.current.target.copy(target);
			controlsRef.current.update();
			transitionComplete.current = true;
			onTransitionComplete?.();
			return;
		}

		camera.position.lerp(cameraPos, 0.05);
		controlsRef.current.target.lerp(target, 0.05);
		controlsRef.current.update();
	});

	return null;
}
