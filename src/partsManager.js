import * as THREE from 'three';

import { THREEEX, UNIVERSE, GeneratePartOptions } from './PartProvider';


import { loadnExecute } from './partLoader';
import { OnScreen } from './gui';


let maping = null;
let loadedParts = [];
let local_part = "";

export function initMaping() {
    return new Promise(function (resolve) {
        loadnExecute("src/universe_parts/mapping.js", "defineThreeUniverse", (construct) => {
            return construct().then(lmap => {
                maping = lmap.maping;
                local_part = lmap.local_part;
                let localPartItems = maping.filter(item => item.url.startsWith(local_part));

                if (localPartItems.length) {
                    lmap.local_position = localPartItems[0].position;
                }


                resolve(lmap);
            });
        });
    });
}




var status = ''

export function loadPartsAt(position, far, scene, setNeedToDisplay) {

    maping.forEach(item => {

        if (!loadedParts.includes(item)) {
            let vectposition = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
            let distance = vectposition.distanceTo(position);
            if (!item.radius) {
                item.radius = 0;
            }
            if (distance - item.radius < far) {

                let anchor = new THREE.Object3D();
                anchor.position.copy(vectposition);
                let baseUrl = item.url.substring(0, item.url.indexOf("src/universe_parts"));
                if (baseUrl == local_part) {
                    item.url = item.url.substring(local_part.length);
                    baseUrl = "";
                }

                loadnExecute(item.url, "defineThreeUniverse", (construct) => {
                    item.disposer = null;
                    let PARTOption = GeneratePartOptions(item, baseUrl, vectposition);
                    let promise = Promise.resolve(construct(THREEEX, UNIVERSE, PARTOption));
                    promise.then((result) => {
                        anchor.add(result);
                        scene.add(anchor);
                        item.object = anchor;
                        setNeedToDisplay();
                        OnScreen.log(`Loaded  ${item.url}`);

                    })


                });

                loadedParts.push(item);

            }
        }


    });



}




import { cameraUpdateList, requestAnimationFrameList } from './PartProvider';



function onUnloadPart(part) {

    let cindex = cameraUpdateList.indexOf(part)
    if (cindex != -1) {
        if (cindex != -1) {
            cameraUpdateList.splice(cindex, 1);
        }
    }

    cindex = requestAnimationFrameList.indexOf(part)
    if (cindex != -1) {
        if (cindex != -1) {
            requestAnimationFrameList.splice(cindex, 1);
        }
    }




}

export function unloadPartsAt(position, far, scene, setNeedToDisplay) {
    let unloaded = [];
    loadedParts.forEach(item => {

        let vectposition = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
        let distance = vectposition.distanceTo(position);
        if (distance - item.radius > far + 100 && item.object) {
            onUnloadPart(item);
            OnScreen.log(`Unloading  ${item.url}`);
            if (item.object.parent)
                item.object.parent.remove(item.object);
            if (item.disposer) {
                item.disposer();
            }
            unloaded.push(item);
        } else {
            if (item.object && item.radius === 0) {
                let box = new THREE.Box3().setFromObject(item.object);
                let sphere = new THREE.Sphere();
                box.getBoundingSphere(sphere);
                OnScreen.log(`${item.url} Eestimated radius: ${sphere.radius.toFixed(1)}`);
                item.radius = sphere.radius;
            }
        }



    });


    unloaded.forEach((item) => {
        let i = loadedParts.indexOf(item);
        if (i != -1) {
            loadedParts.splice(i, 1);
        }

    })

}

export function updateloadedParts(position) {
    for (let i = cameraUpdateList.length - 1; i > -1; i--) {
        cameraUpdateList[i].onCameraUpdate(position);

    }
}


export function delegateRequestAnimationFrame(delta) {
    for (var i = requestAnimationFrameList.length - 1; i > -1; i--) {
        requestAnimationFrameList[i].requestAnimationFrame(delta);

    }
    return requestAnimationFrameList.length > 0;
}

