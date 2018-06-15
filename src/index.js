
import * as THREE from 'three';
import { datGUI } from './dat';
import { initVisibilityDesider } from './visibiltyDesider';
import { loadUniverseAt, unLoadUniverseAt, updateloadedParts } from './objectManager'
import { initController, updateController } from './controller'
import setLocationHash from 'set-location-hash';




var camera, scene, renderer, controls;
var rendererStats;


var objects = [];

var raycaster;

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

    var element = document.body;

    var pointerlockchange = function (event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {


            controls.enabled = true;

            blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = 'block';

            instructions.style.display = '';

        }

    };



    var pointerlockerror = function (event) {

        instructions.style.display = '';

    };

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);


    function firsttlock() {
        element.requestPointerLock();
        element.removeEventListener('click', firsttlock);
    }

    element.addEventListener('click', firsttlock);


    instructions.addEventListener('click', function (event) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

    }, false);

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

var controlsEnabled = false;



init();
animate();
var isSetNeedToDisplay = true;
function setNeedToDisplay() {
    isSetNeedToDisplay = true;
}

blocker.style.display = 'none';
controls.enabled = true;


function init() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);

    camera.position.set(0, 100, 0);




    scene = new THREE.Scene();


    scene.background = new THREE.Color(0xcce0ff);
    scene.fog = new THREE.Fog(0xcce0ff, 500, 1800);

    datGUI.add(scene.fog, 'near', 0, 100).name("fog near");

    datGUI.add(scene.fog, 'far', 10, 10000).name("fog far");
    datGUI.close();



    let camfar = datGUI.add(camera, 'far', 100, 10000).name("Camera far");
    camfar.onChange(value => {
        camera.updateProjectionMatrix();
    });


    // var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    // light.position.set(0.5, 1, 0.75);
    // scene.add(light);
    controls = initController(camera)
    scene.add(controls.getObject());

    let lastCameraPosition = localStorage.getItem("lastCameraPosition");
    if (lastCameraPosition && lastCameraPosition !== "undefined") {
        let obj = JSON.parse(lastCameraPosition);
        controls.getObject().position.set(obj.x, obj.y, obj.z);
    }

    // let lastCameraRotation =localStorage.getItem("lastCameraRotation");
    // if (lastCameraRotation) {
    //     let obj = JSON.parse(lastCameraRotation);
    //     controls.getObject().rotation.set(obj._x,obj._y,obj._z);
    // }

    let hashParam = window.location.hash.substr(1).split('&');
    let hashParamObject = {};
    hashParam.forEach(item => {
        let splitted = item.split(':')
        hashParamObject[splitted[0]] = splitted[1];
    })

    if (hashParamObject.x) {
        controls.getObject().position.set(Number(hashParamObject.x),
            0, Number(hashParamObject.z));
    }
    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    initVisibilityDesider(renderer.info)

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);
    if (isSetNeedToDisplay) {
        renderer.render(scene, camera);
        isSetNeedToDisplay = false;
        updateloadedParts(controls.getObject().position);
    }

    if (controls.enabled === true) {

        

        if (updateController(false)) {
            updateUniverseAt(controls.getObject().position);
            setNeedToDisplay();

        }

    }



}




function updateUniverseAt(position) {
    if (!updateUniverseAt.frameCount) {
        updateUniverseAt.count = 0;
    }


    if (updateUniverseAt.frameCount < 60) {
        updateUniverseAt.frameCount++;
    } else {
        updateUniverseAt.frameCount = 0;
        loadUniverseAt(position, camera.far, scene, setNeedToDisplay);
        unLoadUniverseAt(position, camera.far, scene, setNeedToDisplay);
        localStorage.setItem("lastCameraPosition", JSON.stringify(position.position));
        localStorage.setItem("lastCameraRotation", JSON.stringify(controls.getObject().rotation));

        setLocationHash(`x:${controls.getObject().position.x.toFixed(0)}&z:${controls.getObject().position.z.toFixed(0)}`, { replace: true });


    }




}