import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Html, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import CameraLerp from "./components/camera/CameraLerp";
import FloorBoundary from "./components/camera/FloorBoundary";
import WallBoundary from "./components/camera/WallBoundary";
import CeilingBoundary from "./components/camera/CeilingBoundary";
import useCameraControl from "./components/camera/useCameraControl.js";
import CameraLock from "./components/camera/CameraLock.js";
import { color } from "three/tsl";

// 🧩 Scene loading and position extraction
const wall_colour = 0x111111;
function Scene({ onPositionsReady, hasClickedMonitor }) {
	const { scene } = useGLTF("/kenny_portfolio_copy (13).glb");
	const texture_monitor = useLoader(TextureLoader, "/portfolio2.png");
	texture_monitor.flipY = false;
	texture_monitor.wrapS = THREE.RepeatWrapping;
	texture_monitor.repeat.x = -1;
	texture_monitor.colorSpace = THREE.SRGBColorSpace;

	const texture_resume = useLoader(TextureLoader, "/resume12.png");
	texture_resume.flipY = false;
	texture_resume.wrapS = THREE.RepeatWrapping;
	texture_resume.repeat.x = 1;
	texture_resume.colorSpace = THREE.SRGBColorSpace;
	texture_resume.generateMipmaps = false;
	texture_resume.magFilter = THREE.LinearFilter;

	texture_resume.minFilter = THREE.LinearMipMapNearestFilter;
	texture_resume.anisotropy = 32;

	const texture_tablet = useLoader(TextureLoader, "/ipad.png");
	texture_tablet.flipY = true;
	texture_tablet.wrapS = THREE.RepeatWrapping;
	texture_tablet.repeat.x = 1;
	texture_tablet.colorSpace = THREE.SRGBColorSpace;
	texture_tablet.magFilter = THREE.LinearFilter;
	texture_tablet.minFilter = THREE.LinearMipMapLinearFilter;
	texture_tablet.anisotropy = 162;

	useEffect(() => {
		scene.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
				if (child.material) {
					child.material.side = THREE.DoubleSide;
					if (child.material.map) {
						child.material.transparent = true;
						child.material.alphaTest = 1;
					}
				}
			}
		});

		const sceneMain = scene.getObjectByName("scene_main");

		const lamp = sceneMain?.getObjectByName("lamp");
		const lightbulb = lamp?.getObjectByName("lamp_lightbulb");
		let lightbulbPos = null;
		if (lightbulb) {
			lightbulbPos = new THREE.Vector3();
			lightbulb.getWorldPosition(lightbulbPos);
			lightbulb.material = new THREE.MeshStandardMaterial({
				color: 0xfef6c9,
				emissive: 0xfef6c9,
				emissiveIntensity: 1.5,
			});
		}

		const table = sceneMain?.getObjectByName("table")?.getObjectByName("table");
		const tablePos = new THREE.Vector3();
		const titlePos = new THREE.Vector3();
		table?.getWorldPosition(tablePos);
		tablePos.add(new THREE.Vector3(0, 10, 0)); //

		const titleText = scene.getObjectByName("title_text");
		if (titleText) {
			titleText.material.color.set(0xffffff); // or use a CSS color like 'skyblue'
		}

		const monitor = sceneMain?.getObjectByName("monitor");
		const monitorScreen = monitor?.getObjectByName("monitor_screen");
		let monitorPos = null;
		let monitorRot = new THREE.Euler();
		if (monitorScreen) {
			monitorPos = new THREE.Vector3();
			monitorScreen.getWorldPosition(monitorPos);
			const monitorQuat = new THREE.Quaternion();
			monitorScreen.getWorldQuaternion(monitorQuat);
			monitorRot.setFromQuaternion(monitorQuat);
			const monitorForward = new THREE.Vector3(0, 0, 1);
			monitorForward.applyEuler(monitorRot);
			monitorForward.multiplyScalar(0.01);
			monitorPos.add(monitorForward);
			monitorScreen.material = new THREE.MeshStandardMaterial({
				map: texture_monitor,
				transparent: false,
				opacity: hasClickedMonitor ? 0 : 1,
				polygonOffset: true,
				polygonOffsetFactor: -1,
			});
		}

		// clipboard resume texture
		const clipboard = sceneMain?.getObjectByName("clipboard");
		const clipboardPaper = clipboard?.getObjectByName("clipboard_paper");
		let clipboardPos = null;
		let clipboardRot = new THREE.Euler();
		if (clipboardPaper) {
			clipboardPaper.material = new THREE.MeshBasicMaterial({
				map: texture_resume,
				transparent: false,
				polygonOffset: true,
				polygonOffsetFactor: -1,
			});
			clipboardPaper.rotation.x = Math.PI;
			clipboardPos = new THREE.Vector3();
			clipboardPaper.getWorldPosition(clipboardPos);
			const clipboardQuat = new THREE.Quaternion();
			clipboardPaper.getWorldQuaternion(clipboardQuat);
			clipboardRot.setFromQuaternion(clipboardQuat);
		}

		const tablet = sceneMain?.getObjectByName("tablet");
		const tabletScreen = tablet?.getObjectByName("tablet_screen");
		let tabletPos = null;
		let tabletRot = new THREE.Euler();
		if (tabletScreen) {
			tabletPos = new THREE.Vector3();
			tabletScreen.getWorldPosition(tabletPos);

			const tabletQuat = new THREE.Quaternion();
			tabletScreen.getWorldQuaternion(tabletQuat);
			tabletRot.setFromQuaternion(tabletQuat);

			const tabletForward = new THREE.Vector3(0, 0, 1);
			tabletForward.applyEuler(tabletRot);
			tabletForward.multiplyScalar(0.01);
			tabletPos.add(tabletForward);

			tabletScreen.material = new THREE.MeshBasicMaterial({
				map: texture_tablet,
				transparent: false,
				opacity: hasClickedMonitor ? 0 : 1,
				polygonOffset: true,
				polygonOffsetFactor: -1,
			});
		}

		const linkedinNote = scene
			.getObjectByName("scene_main")
			?.getObjectByName("sticky_note_board")
			?.getObjectByName("Notes")
			?.getObjectByName("board_kh_linkedin");
		let linkedinPos = null;
		let linkedinRot = new THREE.Euler();
		if (linkedinNote) {
			linkedinPos = new THREE.Vector3();
			linkedinNote.getWorldPosition(linkedinPos);

			const linkedinQuat = new THREE.Quaternion();
			linkedinNote.getWorldQuaternion(linkedinQuat);
			linkedinRot.setFromQuaternion(linkedinQuat);
		}

		const gmailNote = scene
			.getObjectByName("scene_main")
			?.getObjectByName("sticky_note_board")
			?.getObjectByName("Notes")
			?.getObjectByName("board_gmail_icon");
		let gmailPos = null;
		let gmailRot = new THREE.Euler();

		if (gmailNote) {
			gmailPos = new THREE.Vector3();
			gmailNote.getWorldPosition(gmailPos);

			const gmailQuat = new THREE.Quaternion();
			gmailNote.getWorldQuaternion(gmailQuat);
			gmailRot.setFromQuaternion(gmailQuat);
		}

		onPositionsReady?.({
			title: titlePos,
			table: tablePos,
			lightbulb: lightbulbPos,
			monitor: monitorPos,
			monitorRot: monitorRot,
			clipboard: clipboardPos,
			clipboardRot: clipboardRot,
			tablet: tabletPos,
			tabletRot: tabletRot,
			linkedin: linkedinPos,
			linkedinRot: linkedinRot,
			gmail: gmailPos,
			gmailRot: gmailRot,
		});
	}, [scene, onPositionsReady, hasClickedMonitor]);
	return <primitive object={scene} position={[0, -1, 0]} scale={1} />;
}

function SceneBackground({ color }) {
	const { scene } = useThree();

	useEffect(() => {
		scene.background = new THREE.Color(color);
	}, [scene, color]);

	return null;
}

// Main App
export default function App() {
	const controlsRef = useRef();
	const lightTarget = useRef();
	const tableTarget = useRef(); // New ref for table target
	const { position, target, activeView, goTo } = useCameraControl();
	const [positions, setPositions] = useState(null);
	const [hasClickedMonitor, setHasClickedMonitor] = useState(false);
	const [showMonitorIframe, setShowMonitorIframe] = useState(false);
	const [monitorOpacity, setMonitorOpacity] = useState(1);

	return (
		<>
			<Canvas
				shadows
				dpr={[Math.min(window.devicePixelRatio, 1.5)]}
				camera={{ position: [-11, 20, 10], fov: 50 }}
				style={{ width: "100vw", height: "100vh" }}
				gl={{ outputColorSpace: THREE.SRGBColorSpace }}
			>
				<ambientLight color={0x404040} intensity={0} />
				<SceneBackground color="black" />
				<mesh ref={lightTarget} position={[0, 15, -12]} visible={false} />

				{/* SpotLight from top */}
				<spotLight
					position={[0, 33, 0]}
					color={0xffffff}
					target={lightTarget.current}
					angle={0.6}
					penumbra={0.5}
					intensity={6} //3
					distance={1020}
					castShadow
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
					shadow-bias={-0.0001}
					decay={0.0}
				/>

				{/* Lightbulb Spotlight */}
				<mesh
					ref={tableTarget}
					position={[-0.04590791803643568, 9.59, -16.253016925609586]}
					visible={false}
				/>
				{positions?.lightbulb && positions?.table && (
					<>
						<spotLight
							position={[
								positions.lightbulb.x - 1,
								positions.lightbulb.y,
								positions.lightbulb.z,
							]}
							color="#faca07ff"
							angle={0.8}
							penumbra={0.2}
							intensity={8}
							distance={30}
							castShadow
							shadow-mapSize-width={1024}
							shadow-mapSize-height={1024}
							shadow-bias={-0.03}
							decay={0.1}
							target={tableTarget.current}
						/>
					</>
				)}

				{/* Load scene */}
				{/*front wall*/}
				<mesh position={[0, 10, -23]} receiveShadow>
					<planeGeometry args={[90, 50]} />
					<meshStandardMaterial
						color={wall_colour}
						roughness={1}
						metalness={0}
					/>{" "}
					{/*0x prefix*/}
				</mesh>

				{/* Floor */}
				<mesh
					position={[0, -0.5, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
					receiveShadow
				>
					<planeGeometry args={[100, 60]} />
					<meshStandardMaterial
						color={wall_colour}
						// roughness={0.8}
						// emissive={wall_colour}
						roughness={1}
						metalness={0}
					/>
				</mesh>

				{/* Floor and wall boundary constraint */}
				<FloorBoundary controlsRef={controlsRef} />
				<WallBoundary controlsRef={controlsRef} widthFromCentre={30} />
				<CeilingBoundary controlsRef={controlsRef} ceilingHeight={30} />

				<Suspense fallback={null}>
					<Scene
						onPositionsReady={setPositions}
						hasClickedMonitor={hasClickedMonitor}
					/>
				</Suspense>

				{/* Orbit Controls */}
				<OrbitControls
					ref={controlsRef}
					enableDamping
					dampingFactor={0.1}
					mouseButtons={{ LEFT: 0, MIDDLE: 1, RIGHT: 2 }}
					minDistance={1} // Don't get too close to the scene
					maxDistance={60} // Don't get too far from the scene
					minPolarAngle={-Infinity} // Don't go above the scene (almost top)
					maxPolarAngle={Infinity} // Don't go below the scene (about 120 degrees)
					minAzimuthAngle={-Infinity} // Limit horizontal rotation to 90 degrees left
					maxAzimuthAngle={Infinity} // Limit horizontal rotation to 90 degrees right
				/>
				<CameraLock controlsRef={controlsRef} activeView={activeView} />

				{/* Show iframe only after click */}
				{/* Transparent click plane in front of monitor */}
				{positions?.monitor && !hasClickedMonitor && (
					<mesh
						position={[
							positions.monitor.x,
							positions.monitor.y,
							positions.monitor.z,
						]}
						rotation={[
							positions.monitorRot.x,
							positions.monitorRot.y + Math.PI,
							positions.monitorRot.z + Math.PI,
						]}
						onClick={() => {
							goTo("monitor");
							setHasClickedMonitor(true); // trigger fade out

							// Fade out monitor screenshot over 0.5s
							let t = 0;
							const fadeDuration = 500;
							const interval = setInterval(() => {
								t += 50;
								setMonitorOpacity((1 - t / fadeDuration).toFixed(2));
								if (t >= fadeDuration) {
									clearInterval(interval);
									setShowMonitorIframe(true); // show iframe after fade out
								}
							}, 50);
						}}
					>
						<planeGeometry args={[6.7, 3.9]} />{" "}
						{/* Match monitor screen aspect ratio */}
						<meshBasicMaterial
							color="red"
							transparent
							opacity={0}
							side={THREE.BackSide}
						/>
					</mesh>
				)}
				{positions?.monitor && showMonitorIframe && (
					<Html
						transform
						occlude
						position={[
							positions.monitor.x,
							positions.monitor.y,
							positions.monitor.z,
						]}
						rotation={[
							positions.monitorRot.x,
							positions.monitorRot.y,
							positions.monitorRot.z + Math.PI,
						]}
						scale={0.3}
						style={{ pointerEvents: "auto", overflow: "auto" }}
					>
						<iframe
							key="monitor_iframe"
							src={`https://kennyhuynhhh.github.io/kenny_website/?cb=${Date.now()}`}
							width={858}
							height={482}
							allow="fullscreen"
							sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
							style={{
								border: "black solid 8px",
								borderRadius: "12px",
								overflow: "auto",
								pointerEvents: "auto",
							}}
						/>
					</Html>
				)}
				{positions?.clipboard && (
					<mesh
						position={[
							positions.clipboard.x,
							positions.clipboard.y + 0.05,
							positions.clipboard.z,
						]}
						rotation={[
							positions.clipboardRot.x,
							positions.clipboardRot.y + Math.PI,
							positions.clipboardRot.z + Math.PI,
						]}
						onClick={() => {
							goTo("clipboard"); // 🚀 moves camera
						}}
					>
						<planeGeometry args={[1.8, 2.65]} />{" "}
						{/* Adjust size to match your clipboard */}
						<meshBasicMaterial
							color="blue"
							transparent
							opacity={0}
							side={THREE.DoubleSide}
						/>
					</mesh>
				)}

				{positions?.linkedin && (
					<mesh
						position={[
							positions.linkedin.x,
							positions.linkedin.y,
							positions.linkedin.z,
						]}
						rotation={[
							positions.linkedinRot.x,
							positions.linkedinRot.y,
							positions.linkedinRot.z,
						]}
						onClick={() =>
							window.open(
								"https://www.linkedin.com/in/kennyhuynh1910/",
								"_blank"
							)
						}
					>
						<planeGeometry args={[0.7, 0.6]} /> {/* Size it to fit the note */}
						<meshBasicMaterial
							transparent
							opacity={0}
							color="cyan"
							side={THREE.DoubleSide}
						/>
					</mesh>
				)}
				{positions?.gmail && (
					<mesh
						position={[positions.gmail.x, positions.gmail.y, positions.gmail.z]}
						rotation={[
							positions.gmailRot.x,
							positions.gmailRot.y,
							positions.gmailRot.z,
						]}
						onClick={() =>
							window.open(
								"mailto:kennyhuynh2003@gmail.com?subject=Portfolio%20Inquiry&body=Hi%20Kenny%2C%0D%0A%0D%0AI%20found%20your%20portfolio%20interesting...",
								"_blank"
							)
						}
						onPointerOver={(e) => {
							e.stopPropagation();
							document.body.style.cursor = "pointer";
						}}
						onPointerOut={() => {
							document.body.style.cursor = "auto";
						}}
					>
						<planeGeometry args={[0.75, 0.55]} />{" "}
						<meshBasicMaterial
							transparent
							opacity={0.0}
							side={THREE.DoubleSide}
						/>
					</mesh>
				)}

				{positions?.tablet && (
					<mesh
						position={[
							positions.tablet.x,
							positions.tablet.y + 0.05,
							positions.tablet.z,
						]}
						rotation={[
							positions.tabletRot.x,
							positions.tabletRot.y + Math.PI,
							positions.tabletRot.z + Math.PI + 0.22,
						]}
						onClick={() => {
							goTo("tablet"); // 🔁 Trigger camera transition to tablet
						}}
					>
						<planeGeometry args={[3.8, 2.4]} />{" "}
						{/* Adjust based on screen size */}
						<meshBasicMaterial
							color="purple"
							transparent
							opacity={0}
							side={THREE.DoubleSide}
						/>
					</mesh>
				)}

				<CameraLerp
					controlsRef={controlsRef}
					cameraPos={position}
					target={target}
					isStarted={true}
				/>
			</Canvas>
			{activeView !== "overview" && (
				<div
					style={{
						position: "absolute",
						top: "20px",
						right: "20px",
						zIndex: 10,
					}}
				>
					<button
						onClick={() => {
							goTo("overview");
							setHasClickedMonitor(false); // if needed to restore PNG
							setShowMonitorIframe(false);
						}}
						style={{
							padding: "8px 12px",
							fontSize: "60px",
							borderRadius: "20px",
							border: "none",
							backgroundColor: "white",
							color: "black",
							cursor: "pointer",
						}}
					>
						Back
					</button>
				</div>
			)}
		</>
	);
}
