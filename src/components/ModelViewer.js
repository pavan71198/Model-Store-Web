import {useEffect, useRef} from "react";
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const style = {
	height: 50 + "vh",
	display: "block",
	backgroundColor: "#cccccc"
};

const ModelViewer = ({fileUrl, gltfCheck}) => {
	let scene;
	let camera;
	let controls;
	let renderer;
	let requestID;
	let mountRef = useRef(null);

	const sceneSetup = () => {
		const width = mountRef.current.clientWidth;
		const height = mountRef.current.clientHeight;

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(
			75,
			width / height,
			0.1,
			1000
		);
		camera.position.z = 4;
		controls = new OrbitControls(camera, mountRef.current);
		renderer = new THREE.WebGLRenderer({alpha: true});
		renderer.setSize(width, height);
		renderer.outputEncoding = THREE.sRGBEncoding;
		mountRef.current.appendChild(renderer.domElement);
	};

	const addCustomSceneObjects = () => {
		const loader = new GLTFLoader();
		loader.load(fileUrl, (gltf) => {
			gltfCheck(true);
			scene.add(gltf.scene);
		}, undefined, function (error) {
			gltfCheck(false);
			console.error(error);
		});
		const lights = [];
		lights[0] = new THREE.PointLight(0xffffff, 1, 0);
		lights[1] = new THREE.PointLight(0xffffff, 1, 0);
		lights[2] = new THREE.PointLight(0xffffff, 1, 0);
		lights[0].position.set(0, 200, 0);
		lights[1].position.set(100, 200, 100);
		lights[2].position.set(-100, -200, -100);

		scene.add(lights[0]);
		scene.add(lights[1]);
		scene.add(lights[2]);
	};

	const startAnimationLoop = () => {
		renderer.render(scene, camera);
		requestID = window.requestAnimationFrame(startAnimationLoop);
	};

	const handleWindowResize = () => {
		const width = mountRef.current.clientWidth;
		const height = mountRef.current.clientHeight;

		renderer.setSize(width, height);
		camera.aspect = width / height;

		camera.updateProjectionMatrix();
	};

	useEffect(() => {
		let tempRef = mountRef.current;
		if (mountRef.current) {
			sceneSetup();
			addCustomSceneObjects();
			startAnimationLoop();
			window.addEventListener('resize', handleWindowResize);
			tempRef = mountRef.current;
		}
		return () => {
			if (tempRef) {
				tempRef.removeChild(renderer.domElement);
				window.cancelAnimationFrame(requestID);
				controls.dispose()
			}
		};
	});

	return (
		<div ref={mountRef} style={style}/>
	);
}

export default ModelViewer;