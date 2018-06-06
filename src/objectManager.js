
import { loadnExecute } from './loadUnloader';
import * as THREE from 'three';
let maping = [
    {
        position: { x: 0, z: 100 },
        radius: 100,
        description: "IcosahedronGeometry",
        url: "https://shakthi.github.io/ThreeJSUniverse/src/universe/sampleMeshModule.js"
    },
    {
        position: { x: 200, z: 500 },
        radius: 10,
        description: "IcosahedronGeometry",
        url: "https://shakthi.github.io/ThreeJSUniverse/src/universe/sampleMeshModule.js"
    },
    {
        position: { x: 0, z: 0 },
        radius: 10000,
        description: "Gras ground with single texture",
        url: "../../src/universe/grassGround.js"
    }


]


let loaded = [];


export function loadUniverseAt(position, far, scene) {

    maping.forEach(item => {

        if (!loaded.includes(item)) {
            let vectposition = new THREE.Vector3(item.position.x,item.position.y,item.position.z);
            let distance = vectposition.distanceTo(position);
            if (distance - item.radius < far) {
                let anchor = new THREE.Object3D();
                anchor.position.copy(vectposition);

                loadnExecute(item.url, "defineThreeUniverse", (construct) => {
                    let result = construct(THREE);
                    anchor.add(result);
                    scene.add(anchor);

                });

            loaded.push(item);

            }
        }


    });



}