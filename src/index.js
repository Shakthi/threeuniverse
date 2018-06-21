
import * as THREE from 'three';
import { datGUI } from './dat';
import { initVisibilityDesider,timeRenderEnd,timeRenderBegin } from './visibiltyDesider';
import { loadUniverseAt, unLoadUniverseAt, updateloadedParts, initMaping } from './objectManager'
import { initController, updateController } from './controller'
import instructionPanel  from './instructionPanel'
import setLocationHash from 'set-location-hash';




var camera, scene, renderer, controls;






initMaping().then(lmap => {
    let initialPosition = new THREE.Vector3();
    let offset = new THREE.Vector3(0, 100, 0);

    let urlHashPosition = getHashObject();

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

var isSetNeedToDisplay = true;
function setNeedToDisplay() {
    isSetNeedToDisplay = true;
}

var firstFrame = true;

//blocker.style.display = 'none';


function getHashObject() {
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
    ;

    return hashParamObject;
}


function init(position) {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);




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
    camera.position.y = 100;
    controls.getObject().translateX(position.x);
    controls.getObject().translateZ(position.z);
    instructionPanel.init(controls);
    // let lastCameraRotation =localStorage.getItem("lastCameraRotation");
    // if (lastCameraRotation) {
    //     let obj = JSON.parse(lastCameraRotation);
    //     controls.getObject().rotation.set(obj._x,obj._y,obj._z);
    // }


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
    //controls.enabled = true;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    setNeedToDisplay();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    requestAnimationFrame(animate);
    var timeBegan = false;

    if(isSetNeedToDisplay ){
        timeRenderBegin();
        timeBegan =true;
    }


    if (isSetNeedToDisplay) {

        renderer.render(scene, camera);
        
        isSetNeedToDisplay = false;
        updateloadedParts(controls.getObject().position);

    }

    if (controls.enabled === true || firstFrame) {
        if (updateController(false)) {
            updateUniverseAt(controls.getObject().position);
            setNeedToDisplay();
        }

        firstFrame = false;

    }

    if(timeBegan)
        timeRenderEnd();
}




function updateUniverseAt(position) {
    if (!updateUniverseAt.frameCount) {
        updateUniverseAt.frameCount = 0;
    }
    if (updateUniverseAt.frameCount == 0) {
        loadUniverseAt(position, camera.far, scene, setNeedToDisplay);
        unLoadUniverseAt(position, camera.far, scene, setNeedToDisplay);

    }




    if (updateUniverseAt.frameCount == 59) {
        localStorage.setItem("lastCameraPosition", JSON.stringify(position));
        localStorage.setItem("lastCameraRotation", JSON.stringify(controls.getObject().rotation));

        setLocationHash(`x:${controls.getObject().position.x.toFixed(0)}&z:${controls.getObject().position.z.toFixed(0)}`,
            { replace: true });
    }


    if (updateUniverseAt.frameCount < 60) {
        updateUniverseAt.frameCount++;
    } else {

        updateUniverseAt.frameCount = 0;
    }




}