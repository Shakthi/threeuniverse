
import { loadnExecute } from './loadUnloader';
import * as THREE from 'three';
import OBJLoader2 from './extern/OBJLoader2'
import seedrandom from 'seedrandom'

let THREEEX = Object.assign({}, THREE, { OBJLoader2, seedrandom });

let maping = null;
let loadedParts = [];
let local_part = "";
function getMaping() {
    return new Promise(function (resolve) {

        if (maping == null) {
            maping = [];
            loadnExecute("src/universe_parts/mapping.js", "defineThreeUniverse", (construct) => {
                return construct().then(lmap => {
                    maping = lmap.maping;
                    local_part = lmap.local_part;
                    resolve(maping);
                });
            });
        }
        else {
            resolve(maping);
        }


    });
}


var status = ''

export function loadUniverseAt(position, far, scene, setNeedToDisplay) {

    getMaping().then((maping) => {
        maping.forEach(item => {

            if (!loadedParts.includes(item)) {
                let vectposition = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
                let distance = vectposition.distanceTo(position);
                if (distance - item.radius < far) {
                    let anchor = new THREE.Object3D();
                    anchor.position.copy(vectposition);
                    let baseUrl = item.url.substring(0, item.url.indexOf("src/universe_parts"));
                    if (baseUrl == local_part) {
                        item.url = item.url.substring(local_part.length);
                    }
                    loadnExecute(item.url, "defineThreeUniverse", (construct) => {
                        item.disposer = null;
                        let options = {
                            dispose: function (disposer) {
                                item.disposer = disposer;
                            },
                            onCameraUpdate: function (fun) {
                                item.onCameraUpdate = fun;
                            },
                            baseUrl: baseUrl,
                        };



                        let promise = construct(THREEEX, options);
                        promise.then((result) => {
                            anchor.add(result);
                            scene.add(anchor);
                            item.object = anchor;
                            setNeedToDisplay();

                        })


                    });

                    loadedParts.push(item);

                }
            }


        });
    });



}

export function unLoadUniverseAt(position, far, scene, setNeedToDisplay) {
    let unloaded = [];
    loadedParts.forEach(item => {

        let vectposition = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
        let distance = vectposition.distanceTo(position);
        if (distance - item.radius > far + 100 && item.object) {

            console.log("Unloading ", item.url);

            item.object.parent.remove(item.object);
            if (item.disposer) {
                item.disposer();
            } else {
                item.object.traverse(function (obj) {
                    if (obj.isMesh) {
                        if (obj.geometry)
                            obj.geometry.dispose();
                        if (obj.material) {
                            if (obj.material.map)
                                obj.material.map.dispose();
                            obj.material.dispose();
                        }

                    }

                });
            }
            unloaded.push(item);
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
    for (let i = loadedParts.length - 1; i > -1; i--) {
        if (loadedParts[i].onCameraUpdate) {
            loadedParts[i].onCameraUpdate(position);
        }
    }
}

//p---fr-----0
 //   0p-or<f

 //g>f