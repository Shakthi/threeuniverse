
defineThreeUniverse(function (THREE,UNIVERSE,SPACE) {

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


            SPACE.GetGroundHitPoint(new THREE.Vector3(0,1000,0)).then(result=>{
                console.log("tree",result[0].point.y)
                event.detail.loaderRootNode.position.y = result[0].point.y;
                resolve(event.detail.loaderRootNode);
            })
            
              
                
                
                
                


            
     
            
            

        };
        var onLoadMtl = function (materials) {
            objLoader.setMaterials(materials);
            objLoader.setLogging(true, true);
            objLoader.load(SPACE.baseUrl+'resource/Tree_obj/Tree.obj', callbackOnLoad, null, null, null, false);


        };
        objLoader.loadMtl(SPACE.baseUrl+'resource/Tree_obj/Tree.mtl', null, onLoadMtl);
    });
});
