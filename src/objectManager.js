
import { loadnExecute } from './loadUnloader';
import * as THREE from 'three';
import  OBJLoader2  from './extern/OBJLoader2'
import seedrandom from 'seedrandom'

let THREEEX = Object.assign({},THREE,{OBJLoader2,seedrandom});

let maping = null;
let loaded = [];

loadnExecute("src/universe_parts/mapping.js", "defineThreeUniverse", (construct) => {
    construct().then(lmap=>{
         maping = lmap;
    });

});

export function loadUniverseAt(position, far, scene, setNeedToDisplay) {

    if(maping == null)
        return;



    maping.forEach(item => {

        if (!loaded.includes(item)) {
            let vectposition = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
            let distance = vectposition.distanceTo(position);
            if (distance - item.radius < far) {
                let anchor = new THREE.Object3D();
                anchor.position.copy(vectposition);
                let baseUrl= item.url.substring(0,item.url.indexOf("src/universe_parts"));
                loadnExecute(item.url, "defineThreeUniverse", (construct) => {
                    item.disposer = null;
                    item.options = {
                        dispose: function (disposer) {
                            item.disposer = disposer;
                        },
                        baseUrl:baseUrl,

                    };
                    let promise = construct(THREEEX, item.options);
                    promise.then((result) => {
                        anchor.add(result);
                        scene.add(anchor);
                        item.object = anchor;
                        setNeedToDisplay();

                    })


                });

                loaded.push(item);

            }
        }


    });



}

export function unLoadUniverseAt(position, far, scene, setNeedToDisplay) {
    let unloaded = [];
    loaded.forEach(item => {

        let vectposition = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
        let distance = vectposition.distanceTo(position);
        if (distance - item.radius > far+100  && item.object) {

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
        let i = loaded.indexOf(item);
        if (i != -1) {
            loaded.splice(i, 1);
        }

    })

}


//p---fr-----0
 //   0p-or<f

 //g>f