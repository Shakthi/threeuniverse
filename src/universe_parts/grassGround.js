
defineThreeUniverse(function (THREE,options) {

    return new Promise(function (resolve, reject) {

        var loader = new THREE.TextureLoader();
        var mesh = null;

        var groundTexture = loader.load(options.baseUrl+'resource/grasslight-big.jpg',
            () => {resolve(mesh)},
            null,
            (error) => {reject(error)}
        );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(25, 25);
        groundTexture.anisotropy = 16;

        var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

        var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
        // mesh.position.y = - 250;
       // mesh.position.y = - 100;
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;

    });


});