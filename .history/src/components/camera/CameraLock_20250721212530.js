import { useFrame } from "@react-three/fiber";

export default function CameraLock({ controlsRef, activeView }) {
	useFrame(() => {
		const controls = controlsRef.current;
		if (!controls) return;

		const isLockedView = activeView !== "overview";

		// Disable pan/rotate in locked views
		controls.enablePan = !isLockedView;
		controls.enableRotate = !isLockedView;

		// Set zoom limits based on view
		if (isLockedView) {
			switch (activeView) {
				case "monitor":
					controls.minDistance = 7.3;
					controls.maxDistance = 7.3;
					break;
				case "clipboard":
					controls.minDistance = 3.5;
					controls.maxDistance = 3.5;
					break;
				case "tablet":
					controls.minDistance = 11.5;
					controls.maxDistance = 11.5;
					break;
				default:
					controls.minDistance = 0;
					controls.maxDistance = 5.5;
			}
		} else {
			// Overview default
			controls.minDistance = 1;
			controls.maxDistance = 60;
		}

		controls.update();
	});

	return null;
}
