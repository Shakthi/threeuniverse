
defineThreeUniverse(function (THREE) {

    return new Promise(function (resolve, reject) {

        var objLoader = new THREE.OBJLoader2();
        var callbackOnLoad = function (event) {
            
            // //console.log('Loading complete: ' + event.detail.modelName);
            // //scope._reportProgress({ detail: { text: '' } });
            // event.detail.loaderRootNode.rotateX(- 90 * THREE.Math.DEG2RAD);

            let prg = THREE.seedrandom("Farest rendering start");
            let obj = new THREE.Object3D();
            event.detail.loaderRootNode.scale.set(40, 40, 40);
            
            event.detail.loaderRootNode.traverse(object => {
                if (object.isMesh) {
                    object.castShadow = true;
                }

            })

            for (let index = 0; index < 20; index++) {
                
                let clone=event.detail.loaderRootNode.clone();
                clone.rotateY(prg()*Math.PI*2);
                clone.position.set(prg()*1000-500,0,prg()*1000-500);
                obj.add(clone);
            }



            resolve(obj);

        };
        var onLoadMtl = function (materials) {
            // objLoader.setModelName(modelName);
            objLoader.setMaterials(materials);
            objLoader.setLogging(true, true);
            objLoader.load('resource/forest/Oak_Tree.obj', callbackOnLoad, null, null, null, false);


        };
        objLoader.loadMtl('resource/forest/Oak_Tree.mtl', null, onLoadMtl);
    });
});
