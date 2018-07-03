
import * as THREE from 'three';
import setLocationHash from 'set-location-hash';
import MobileDetect from 'mobile-detect';

import * as qualityController from './qualityController';
import * as partsManager from './partsManager'
import * as mobileController from './mobileController'
import * as deskTopController from './controller'

import instructionPanel from './instructionPanel'
import { datGUI } from './gui';






var camera, scene, renderer, controls;

var isSetNeedToDisplay = true;
var isFirstFrame = true;
var updateUniverseAtframeCount = 0;
var mobileDetect = new MobileDetect(window.navigator.userAgent);
var controller;






partsManager.initMaping().then(lmap => {
    let initialPosition = new THREE.Vector3();
    let offset = new THREE.Vector3(0, 30, 0);
    let urlHashPosition = getLocationHashObject();

    if (urlHashPosition) {
        initialPosition.set(offset.x + urlHashPosition.x, offset.y + urlHashPosition.y, offset.z + urlHashPosition.z);
    } else {

        let lastCameraPosition = localStorage.getItem("lastCameraPosition");
        if (lastCameraPosition && lastCameraPosition !== "undefined") {
            let obj = JSON.parse(lastCameraPosition);
            initialPosition.set(offset.x + obj.x, offset.y + obj.y, offset.z + obj.z);
        } else {
            let local_position = lmap.local_position;
            ['x', 'y', 'z'].forEach(key => {
                if (local_position[key])
                    local_position[key] = Number(local_position[key]);
                else
                    local_position[key] = 0;

            });

            if (local_position) {
                initialPosition.set(offset.x + local_position.x, offset.y + local_position.y, offset.z + local_position.z);
            }

        }

    }
    init(initialPosition);
    animate();


})





function init(position) {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcce0ff);
    scene.fog = new THREE.Fog(0xcce0ff, 500, 1800);


    let cameraFar = datGUI.add(camera, 'far', 100, 10000).name("Camera far");

    function matchFog() {
        scene.fog.far = camera.far * 0.9;
        scene.fog.near = camera.far * 0.25;
    }
    matchFog();
    cameraFar.onChange(value => {
        camera.updateProjectionMatrix();
        matchFog();
    });






    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    qualityController.init(renderer.info)


    window.addEventListener('resize', onWindowResize, false);

    if (mobileDetect.mobile()) {

        controller = mobileController;
    } else {
        controller = deskTopController;
    }

    controls = controller.init(camera, position, renderer.domElement);


    scene.add(controls.getObject());
    camera.position.y = position.y;
    instructionPanel.init(controls, mobileDetect);

    // let lastCameraRotation =localStorage.getItem("lastCameraRotation");
    // if (lastCameraRotation) {
    //     let obj = JSON.parse(lastCameraRotation);
    //     controls.getObject().rotation.set(obj._x,obj._y,obj._z);
    // }


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    setNeedToDisplay();

    renderer.setSize(window.innerWidth, window.innerHeight);

}




function animate() {
    requestAnimationFrame(animate);

    qualityController.timeRenderBegin();


    if (controller.enabled())
        isSetNeedToDisplay = partsManager.delegateRequestAnimationFrame() || isSetNeedToDisplay;

    if (isSetNeedToDisplay) {

        renderer.render(scene, camera);
        isSetNeedToDisplay = false;
        partsManager.updateloadedParts(controls.getObject().position);

    }

    if (controller.update() || isFirstFrame) {
        updateUniverseAt(controls.getObject().position);
        setNeedToDisplay();
    }

    isFirstFrame = false;



    qualityController.timeRenderEnd();
}




function updateUniverseAt(position) {

    if (updateUniverseAtframeCount == 0) {
        partsManager.loadPartsAt(position, camera.far, scene, setNeedToDisplay);
        partsManager.unloadPartsAt(position, camera.far, scene, setNeedToDisplay);

    } else if (updateUniverseAtframeCount == 59) {
        localStorage.setItem("lastCameraPosition", JSON.stringify(position));
        localStorage.setItem("lastCameraRotation", JSON.stringify(controls.getObject().rotation));

        setLocationHash(`x:${controls.getObject().position.x.toFixed(0)}&z:${controls.getObject().position.z.toFixed(0)}`,
            { replace: true });
    }


    if (updateUniverseAtframeCount < 60) {
        updateUniverseAtframeCount++;
    } else {

        updateUniverseAtframeCount = 0;
    }




}



function getLocationHashObject() {
    let hashParam = window.location.hash.substr(1).split('&');
    let hashParamObject = {};
    hashParam.forEach(item => {
        let splitted = item.split(':')
        hashParamObject[splitted[0]] = splitted[1];
    })

    if (hashParam.length <= 1) {
        return null;
    }

    function setVal(pr) {
        if (hashParamObject[pr])
            hashParamObject[pr] = Number(hashParamObject[pr]);
        else
            hashParamObject[pr] = 0;
    }

    setVal('x');
    setVal('y');
    setVal('z');


    return hashParamObject;
}


function setNeedToDisplay() {
    isSetNeedToDisplay = true;
}
