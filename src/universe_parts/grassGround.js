
defineThreeUniverse(function (THREE,options) {

    return new Promise(function (resolve, reject) {

        var groundTexture = new THREE.TextureLoader().load(options.baseUrl+'resource/grasslight-big.jpg');
        debugger;
        var texture = new THREE.TextureLoader().load( 'resource/texture/sECkYCE.png' );
				var geometry = new THREE.PlaneBufferGeometry( 20000, 20000, 200,200 );
				var material = new THREE.MeshPhongMaterial({
          displacementMap: texture,
          displacementScale:400,
          displacementBias:-35,
          aoMap:texture,
          side: THREE.DoubleSide,
          map: groundTexture
        });
                 mesh = new THREE.Mesh( geometry, material );
                mesh.rotation.x = - Math.PI / 2;

                 resolve(mesh);

//                 mesh.position.set(0,-100,0);
                groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
                groundTexture.repeat.set(25, 25);
                groundTexture.anisotropy = 16;


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