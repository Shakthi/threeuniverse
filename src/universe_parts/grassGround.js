
defineThreeUniverse(function (THREE, options, UNIVERSE) {
    var queryTexture = null;
    return new Promise(function (resolve, reject) {

        var groundTexture = new THREE.TextureLoader().load(options.baseUrl + 'resource/grasslight-big.jpg');
        var texture = new THREE.TextureLoader().load('resource/texture/sECkYCE.png', (heightmap) => {
            queryTexture = new UNIVERSE.QueryTextureWrapper(heightmap);

        });


        var geometry = new THREE.PlaneBufferGeometry(20000, 20000, 100, 100);
        var material = new THREE.MeshPhongMaterial({
            displacementMap: texture,
            displacementScale: 400,
            displacementBias: -35,
            //aoMap: texture,
            side: THREE.DoubleSide,
            map: groundTexture
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = - Math.PI / 2;

        var originalRaycast = mesh.raycast;
        mesh.raycast = function (raycaster, intersects) {
            originalRaycast.call(mesh, raycaster, intersects);
            var thisobjectsIntersects = intersects.filter((element) => element.object == mesh);
            if (thisobjectsIntersects.length) {
                let uv = new THREE.Vector2().copy(thisobjectsIntersects[0].uv);
                texture.transformUv(uv);
                var hightpixel = queryTexture.getPixelAtUv(uv.x, uv.y);
                var hightVal = hightpixel.r / 255 * material.displacementScale + material.displacementBias;
            }

            thisobjectsIntersects.forEach(element => {
                element.point.y = hightVal;

            });



        }

        UNIVERSE.GroundRayCaster.addGround(mesh);
        resolve(mesh);

        //                 mesh.position.set(0,-100,0);
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(25, 25);
        groundTexture.anisotropy = 16;

        //UNIVERSE.groundCaster;

        //     var loader = new THREE.TextureLoader();
        //     var mesh = null;

        //     var groundTexture = loader.load(options.baseUrl+'resource/grasslight-big.jpg',
        //         () => {resolve(mesh)},
        //         null,
        //         (error) => {reject(error)}
        //     );

        //     // var displacementMap  = loader.load(options.baseUrl+'resource/texture/sECkYCE.png',()=>{
        //     //     debugger;
        //     // });

        //     var displacementMap  = loader.load('https://threejs.org/examples/models/obj/ninja/displacement.jpg',()=>{

        //     });


        //     // groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        //     // groundTexture.repeat.set(25, 25);
        //     // groundTexture.anisotropy = 16;

        //     var groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture,
        //         displacementMap:displacementMap,displacementScale:10,
        //     	displacementBias:  10,  });

        //     var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000,100,100), groundMaterial);
        //     // mesh.position.y = - 250;
        //    // mesh.position.y = - 100;
        //     mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;

    });


});