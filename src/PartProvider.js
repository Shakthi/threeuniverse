import * as THREE from 'three';
import OBJLoader2 from './extern/OBJLoader2'
import seedrandom from 'seedrandom'
import QueryTextureWrapper from './utils/QueryTextureWrapper'
import TextureLoader from './utils/TextureLoader'
import { loadnExecute } from './partLoader';


export let THREEEX = Object.assign({}, THREE, { OBJLoader2 });

import  {  GroundManager, GetGroundHitPoint } from './utils/GroundRayCaster'

function castShadow(object){
    object.traverse(object => {
        if (object.isMesh) {
            object.castShadow = true;
        }

    })
}

function loadMTLNObject(baseUrl, mtl, obj) {
    var objLoader = new THREEEX.OBJLoader2();
    objLoader.setLogging(false, false);


    return new Promise((resolve, reject) => {
        objLoader.loadMtl(baseUrl + mtl, null, function (materials) {

            objLoader.setMaterials(materials);
            objLoader.load(baseUrl + obj, (event) => {
                resolve(event.detail.loaderRootNode);
            }, null, reject, null, false);

        });
    });

}


export let UNIVERSE = Object.assign({}, {
    seedrandom,loadMTLNObject,castShadow, loadnExecute, QueryTextureWrapper,
     TextureLoader,GetGroundHitPoint, GroundManager,
});


export let cameraUpdateList = [];
export let requestAnimationFrameList =[];


export function GeneratePartOptions(item,baseUrl,vectposition){
    item.disposer = function () {
        item.object.traverse(function (obj) {
            if (obj.isMesh) {
                if (obj.geometry)
                    obj.geometry.dispose();
                if (obj.material instanceof Array) {
                    obj.material.forEach(item => {
                        if (item.map) {
                            item.map.dispose();
                        }
                        item.dispose();
                    });
                } else {
                    if (obj.material.map)
                        obj.material.map.dispose();
                    obj.material.dispose();
                }


            }

        });
    };


    let PARTOption = {
        dispose: function (disposer) {
            item.disposer = disposer;
        },
        onCameraUpdate: function (fun) {
            item.onCameraUpdate = fun;
            cameraUpdateList.push(item);
        },
        requestAnimationFrame: function (fun) {
            item.requestAnimationFrame = fun;
            requestAnimationFrameList.push(item);
        },
        baseUrl: baseUrl,
        getPartPosition: () => vectposition,
        GetGroundHitPoint:function (position) {
            return UNIVERSE.GetGroundHitPoint(new THREE.Vector3().addVectors(position,vectposition))
        },
        loadMTLNObject:function (mtlpath) {
            let objectpath = mtlpath.replace(/\.obj$/,".mtl");
            return UNIVERSE.loadMTLNObject(baseUrl,objectpath,mtlpath);
        }
    };

    return PARTOption;

}