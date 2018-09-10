import * as THREE from 'three';

let loader =new THREE.TextureLoader();

export default {

    load:function(url){
        return new Promise((resolve,reject)=>{
            loader.load(url,resolve,null,reject);            
        });
    }



}