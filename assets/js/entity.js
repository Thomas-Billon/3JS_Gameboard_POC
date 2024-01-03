import * as Three from "/plugins/three.js/build/three.module.js";

import {engine} from "/assets/js/engine.js";


export class Entity {
	// region VARIABLES

	mesh;			// three.js mesh containing the board
	box;			// three.js box containing the board
	boxSize;		// Size of the box
	boxCenter;		// Center of the box

	// endregion VARIABLES

	// region CONSTRUCTOR

	constructor(path, position, callback) {
		engine.gltfLoader.load(path, (gltf) => {
			this.mesh = gltf.scene;
			this.box = new Three.Box3().setFromObject(this.mesh);
			this.boxSize = this.box.getSize(new Three.Vector3()).length();
			this.boxCenter = new Three.Vector3(0, 0, 0);

			let offset = this.box.getCenter(new Three.Vector3());
			this.mesh.position.set(offset.x * -1 + position.x, offset.y * -1 + position.y, offset.z * -1 + position.z);

			engine.addShadowToObject(this.mesh);
			engine.scene.add(this.mesh);

			callback(this);
		});
	}

	// endregion CONSTRUCTOR
}