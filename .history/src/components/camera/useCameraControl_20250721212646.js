import { useState, useMemo } from "react";
import * as THREE from "three";

export default function useCameraControl() {
	const [activeView, setActiveView] = useState("overview");

	const views = useMemo(
		() => ({
			overview: {
				position: new THREE.Vector3(-6.5, 21.5, -1),
				target: new THREE.Vector3(-3, 14.7, -12),
			},
			monitor: {
				position: new THREE.Vector3(-0.5, 11, -12),
				target: new THREE.Vector3(-0.5, 10, -19),
			},
			clipboard: {
				position: new THREE.Vector3(6.5, 10.5, -13.6),
				target: new THREE.Vector3(6.5, 7, -13.9),
			},
			tablet: {
				position: new THREE.Vector3(0, 11, -13.5),
				target: new THREE.Vector3(0.2, -8, -14.7),
			},
		}),
		[]
	);

	const goTo = (name) => {
		if (views[name]) setActiveView(name);
		else console.warn(`Unknown camera view: ${name}`);
	};

	return {
		position: views[activeView].position,
		target: views[activeView].target,
		activeView,
		goTo,
	};
}
