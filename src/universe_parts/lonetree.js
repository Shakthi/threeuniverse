
defineThreeUniverse(function (THREE,UNIVERSE,options) {

    return new Promise(function (resolve) {

        var objLoader = new THREE.OBJLoader2();
        var callbackOnLoad = function (event) {
           
            event.detail.loaderRootNode.rotateX(- 90 * THREE.Math.DEG2RAD);
            event.detail.loaderRootNode.scale.set(40, 40, 40);

            event.detail.loaderRootNode.traverse(object => {
                if (object.isMesh) {
                    object.castShadow = true;
                }
            })
            
                var k = new options.LocalGroundRayCaster();

                var val= k.intersectObjectsOrWait();
                val.then((result)=>{

                    event.detail.loaderRootNode.position.y = result[0].point.y;
                    resolve(event.detail.loaderRootNode);

                })
                
                
                


            
     
            
            

        };
        var onLoadMtl = function (materials) {
            objLoader.setMaterials(materials);
            objLoader.setLogging(true, true);
            objLoader.load(options.baseUrl+'resource/Tree_obj/Tree.obj', callbackOnLoad, null, null, null, false);


        };
        objLoader.loadMtl(options.baseUrl+'resource/Tree_obj/Tree.mtl', null, onLoadMtl);
    });
});
