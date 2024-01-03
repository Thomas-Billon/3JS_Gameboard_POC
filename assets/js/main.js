import {Vector3} from "/plugins/three.js/build/three.module.js";

import * as Utils from "/assets/js/utils.js";
import {engine, loadEngine} from "/assets/js/engine.js";
import {Entity} from "/assets/js/entity.js";


loadEngine();

export function engineStart() {
    spawnLights();
    spawnBoard();
}

export function engineUpdate() {
    //entity.pivot.rotation.y += 0.01;
}

function spawnLights() {
    engine.createDirectionalLight(0xFFFDFD, new Vector3(1, 1, -1), 1.5);
    engine.createHemisphereLight(0xB1E1FF, 0xB97A20, 0.75);
}

function spawnBoard() {
    new Entity(Utils.BOARDGAME_MAPPING_NAME_GLTF["low_poly_city"], new Vector3(0, 0, 0), onBoardSpawned);
}

function onBoardSpawned(entity) {
    engine.targetCameraToBoard(entity);
    engine.setCanvasOpacity(1);
}