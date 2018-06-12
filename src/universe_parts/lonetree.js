
defineThreeUniverse(function (THREE,options) {

    return new Promise(function (resolve, reject) {

        var objLoader = new THREE.OBJLoader2();
        var callbackOnLoad = function (event) {
            
            //console.log('Loading complete: ' + event.detail.modelName);
            //scope._reportProgress({ detail: { text: '' } });
            event.detail.loaderRootNode.rotateX(- 90 * THREE.Math.DEG2RAD);
            event.detail.loaderRootNode.scale.set(40, 40, 40);

            event.detail.loaderRootNode.traverse(object => {
                if (object.isMesh) {
                    object.castShadow = true;
                }

            })

            resolve(event.detail.loaderRootNode);

        };
        var onLoadMtl = function (materials) {
            // objLoader.setModelName(modelName);
            objLoader.setMaterials(materials);
            objLoader.setLogging(true, true);
            objLoader.load(options.baseUrl+'resource/Tree_obj/Tree.obj', callbackOnLoad, null, null, null, false);


        };
        objLoader.loadMtl(options.baseUrl+'resource/Tree_obj/Tree.mtl', null, onLoadMtl);
    });
});
