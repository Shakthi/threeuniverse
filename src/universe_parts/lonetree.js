
defineThreeUniverse(function (THREE,UNIVERSE,SPACE) {

    return new Promise(function (resolve) {

        var objLoader = new THREE.OBJLoader();
        var mtlLoader = new THREE.MTLLoader()
        var callbackOnLoad = function (objnode) {
           
            objnode.rotateX(- 90 * THREE.Math.DEG2RAD);
            objnode.scale.set(40, 40, 40);

            objnode.traverse(object => {
                if (object.isMesh) {
                    object.castShadow = true;
                }
            })


            SPACE.GetGroundHitPoint(new THREE.Vector3(0,1000,0)).then(result=>{
                console.log("tree",result[0].point.y)
                objnode.position.y = result[0].point.y;
                resolve(objnode);
            })
            
              
                
                
                
                


            
     
            
            

        };


        var onLoadMtl = function (materials) {
            //materials.preLoad();
            objLoader.setMaterials(materials);
            objLoader.load(SPACE.baseUrl+'resource/Tree_obj/Tree.obj', callbackOnLoad);


        };
        mtlLoader.setPath(SPACE.baseUrl+'resource/Tree_obj/')
        mtlLoader.load('Tree.mtl', onLoadMtl);
    });
});
