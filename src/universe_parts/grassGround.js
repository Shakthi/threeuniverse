
defineThreeUniverse(function (THREE, UNIVERSE, options) {
    var queryTexture = null;
    return new Promise(function (resolve, reject) {

        var groundTexturePromise = UNIVERSE.TextureLoader.load(options.baseUrl + 'resource/grasslight-big.jpg');
        var queryTexturePromise = UNIVERSE.TextureLoader.load(options.baseUrl +'resource/texture/sECkYCE.png').then(heightmap => new UNIVERSE.QueryTextureWrapper(heightmap));
        var geometry = new THREE.PlaneBufferGeometry(20000, 20000, 100, 100);


        Promise.all([groundTexturePromise, queryTexturePromise]).then((textures) => {

            var groundTexture = textures[0];
            groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
            groundTexture.repeat.set(25, 25);
            groundTexture.anisotropy = 16;

            var queryTexture= textures[1];
            var displacementMap = queryTexture.texture;


            var material = new THREE.MeshPhongMaterial({
                displacementMap: displacementMap,
                displacementScale: 400,
                displacementBias: -100,
                side: THREE.DoubleSide,
                map: groundTexture,
                aoMap:displacementMap,
                aoMapIntensity:1 
            });

            var mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = - Math.PI / 2;
            mesh.receiveShadow = true;

            

            var originalRaycast = mesh.raycast;
            mesh.raycast = function (raycaster, intersects) {
                originalRaycast.call(mesh, raycaster, intersects);
                var thisobjectsIntersects = intersects.filter((element) => element.object == mesh);
                if (thisobjectsIntersects.length) {
                    let uv = new THREE.Vector2().copy(thisobjectsIntersects[0].uv);
                    displacementMap.transformUv(uv);
                    var hightpixel = queryTexture.getPixelAtUv(uv.x, uv.y);
                    var hightVal = hightpixel.r / 255 * material.displacementScale + material.displacementBias;
                }

                thisobjectsIntersects.forEach(element => {
                    element.point.y = hightVal;

                });



            }

            UNIVERSE.GroundManager.add(mesh);
            resolve(mesh);

        });






    });


});