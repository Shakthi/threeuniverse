
defineThreeUniverse(function (THREE,options) {

    return new Promise(function (resolve, reject) {


        var geometry = new THREE.BoxGeometry( 100, 100, 100 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var cube = new THREE.Mesh( geometry, material );

            resolve(cube);

       
    });
});

