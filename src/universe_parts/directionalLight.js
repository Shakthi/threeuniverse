
defineThreeUniverse(function (THREE,options) {


      
    //Create a DirectionalLight and turn on shadows for the light
    var light = new THREE.DirectionalLight(0xffffff, 1, 100);
    light.position.set(50, 200, 0); 			//default; light shining from top
    light.castShadow = true;            // default false

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512;  // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5;    // default
    light.shadow.camera.far = 500;     // default
    light.shadow.camera.left = light.shadow.camera.bottom = -900;
    light.shadow.camera.top = light.shadow.camera.right =900;
    light.add(light.target);
    light.target.position.set(-50,-200,0);

    if (options.onCameraUpdate) {
        options.onCameraUpdate((position)=>{
            light.position.set(position.x+50, 200,position.z+ 0);
        })
    }    

    // var helper = new THREE.CameraHelper( light.shadow.camera );
    // light.add( helper );

    return light;

});
