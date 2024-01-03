import * as Three from "/plugins/three.js/build/three.module.js";
import {WebGL} from "/plugins/three.js/examples/jsm/WebGL.js";
import {GLTFLoader} from "/plugins/three.js/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "/plugins/three.js/examples/jsm/controls/OrbitControls.js";

import * as Utils from "/assets/js/utils.js";
import {engineStart, engineUpdate} from "/assets/js/main.js";


export let engine;

export function loadEngine() {
	engine = new Engine();
	engine.startRender();
}

class Engine {
	// region VARIABLES

	canvas;			// DOM element for canvas
	deviceWidth;	// Device window width * pixel ratio
	deviceHeight;	// Device window height * pixel ratio

	renderer;		// three.js renderer
	scene;			// three.js scene
	camera;			// three.js camera
	controls;		// three.js controls
	gltfLoader;		// three.js gltfLoader

	// endregion VARIABLES

	// region CONSTRUCTOR

	constructor() {
		this.initCanvas();
		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.initControls();
		this.initGltfLoader();
	}

	// endregion CONSTRUCTOR

	// region METHODS
	// region INIT

	initCanvas() {
		this.canvas = document.getElementById(Utils.BOARDGAME_CANVAS_ID);
	}

	initRenderer() {
		let canvas = this.canvas

		this.renderer = new Three.WebGLRenderer({canvas});
		this.setDeviceSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
	}

	initScene() {
		this.scene = new Three.Scene();
		this.scene.background = new Three.Color(Utils.BOARDGAME_SCENE_BACKGROUND_COLOR);
	}

	initCamera() {
		const fieldOfView = 50;
		const clippingDistNear = 100;
		const clippingDistFar = 10000;

		this.camera = new Three.PerspectiveCamera(fieldOfView, window.innerWidth / window.innerHeight, clippingDistNear, clippingDistFar);
	}

	initControls() {
		this.controls = new OrbitControls(this.camera, this.canvas);
		this.controls.minPolarAngle = 0;
		this.controls.maxPolarAngle = Math.PI / 2;
	}

	initGltfLoader() {
		this.gltfLoader = new GLTFLoader();
	}

	// endregion INIT

	// region LIGHTS

	createDirectionalLight(color, position, intensity) {
		let light = new Three.DirectionalLight(color, intensity);

		light.castShadow = true;
		light.position.set(position.x, position.y, position.z);
		light.target.position.set(0, 0, 0);
		
		this.scene.add(light);
		this.scene.add(light.target);

		return (light);
	}

	createHemisphereLight(colorTop, colorBottom, intensity) {
		let light = new Three.HemisphereLight(colorTop, colorBottom, intensity);

		this.scene.add(light);

		return (light);
	}

	addShadowToObject(mesh)
	{
		mesh.traverse(function(obj)
		{
			if (obj.castShadow !== undefined)
			{
				obj.castShadow = true;
				obj.receiveShadow = true;
			}
		});
	}

	// endregion LIGHTS

	// region CAMERA

	targetCameraToBoard(entity)
	{
		this.camera.position.copy(new Three.Vector3(-1, 0.5, -1).multiplyScalar(entity.boxSize * 0.75).add(entity.boxCenter));
		this.camera.updateProjectionMatrix();
		this.camera.lookAt(entity.boxCenter.x, entity.boxCenter.y, entity.boxCenter.z);
	}

	// endregion CAMERA

	// region RENDER

	startRender() {
		engineStart();

		if (Utils.DISPLAY_WEBGL_ERROR) {
			if (WebGL.isWebGLAvailable()) {
				this.updateRender();
			} else {
				console.log(WebGL.getWebGLErrorMessage());
			}
		} else {
			this.updateRender();
		}
	}

	updateRender() {
		engineUpdate();

		this.updateDeviceSize();
		this.renderer.render(this.scene, this.camera);

		// Recursive callback for next frame
		requestAnimationFrame(() => {
			this.updateRender();
		});
	}

	// endregion RENDER

	// region CANVAS

	setCanvasOpacity(opacity) {
		this.canvas.style.opacity = opacity.toString();
	}

	updateDeviceSize() {
		let width = window.innerWidth * window.devicePixelRatio;
		let height = window.innerHeight * window.devicePixelRatio;
		let needResize = this.canvas.width !== width || this.canvas.height !== height;

		if (needResize) {
			this.setDeviceSize(width, height);
			this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
			this.camera.updateProjectionMatrix();
		}
	}

	setDeviceSize(width, height) {
		this.deviceWidth = width;
		this.deviceHeight = height;
		this.renderer.setSize(width, height);
	}

	// endregion CANVAS

}