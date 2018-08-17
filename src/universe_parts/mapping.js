defineThreeUniverse(function () {

    let local_part = "https://threeuniverse.org/";

    let maping = [
       
        {
            position: { x: 0, z: 0 },
            description: "Grass ground with single texture",
            url: "https://threeuniverse.org/src/universe_parts/grassGround.js",
            credits: "https://threejs.org/examples/#webgl_animation_cloth",
            radius:14142.13562373095
        },

        {
            position: { x: 0, z: 0 },
            credits: "https://www.turbosquid.com/",
            url: "https://threeuniverse.org/src/universe_parts/lonetree.js",
        },
        {
            position: { x: 100, z: 100 },
            credits: "https://www.turbosquid.com/",
            url: "https://shakthi.github.io/PartUniverse/src/universe_parts/smallforest.js",
        },
        {
            position: { x: 0, z: 0 },
            radius: 10.0e10,
            url: "https://threeuniverse.org/src/universe_parts/directionalLight.js",
            //credits: "https://threejs.org/examples/#webgl_animation_cloth"
        },
        {
            position: { x: 0, z: -2700, y: 0 },
            description: "Futeristic ground",
            radius: 1500,
            url: "https://shakthi.github.io/PartUniverse/src/universe_parts/futureGround.js",
        },
         {
            position: { x: 200, z: -2500 },
            description: "IcosahedronGeometry",
            url: "https://shakthi.github.io/PartUniverse/src/universe_parts/sampleMeshModule.js"

        },
        {
            position: { x: -1000, z: -2900 },
            description: "IcosahedronGeometry",
            url: "https://shakthi.github.io/PartUniverse/src/universe_parts/sampleMeshModule.js"
        },
        {
            position: { x: 542, y: 0, z: -1900 },
            description: "Simple cube ground",
            url: "https://ashwithags.github.io/threeuniverse/src/universe_parts/cube.js",
        }, {
            position: { x: 600, z: 100 },
            credits: "https://www.turbosquid.com/",
            url: "https://shakthi.github.io/PartUniverse/src/universe_parts/hut.js",
        },



    ];

    return Promise.resolve({ maping, local_part });

})
