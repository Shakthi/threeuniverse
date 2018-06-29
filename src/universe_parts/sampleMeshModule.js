

defineThreeUniverse( function (THREE,options) {

    var faceIndices = [ 'a', 'b', 'c' ];

    let radius = 200;
    var f,f2,f3,vertexIndex,p,color;
    let geometry = new THREE.IcosahedronGeometry(radius, 1);
    let geometry2 = new THREE.IcosahedronGeometry(radius, 1);
    let geometry3 = new THREE.IcosahedronGeometry(radius, 1);
    for (var i = 0; i < geometry.faces.length; i++) {
        f = geometry.faces[i];
        f2 = geometry2.faces[i];
        f3 = geometry3.faces[i];
        for (var j = 0; j < 3; j++) {
            vertexIndex = f[faceIndices[j]];
            p = geometry.vertices[vertexIndex];
            color = new THREE.Color(0xffffff);
            color.setHSL((p.y / radius + 1) / 2, 1.0, 0.5);
            f.vertexColors[j] = color;
            color = new THREE.Color(0xffffff);
            color.setHSL(0.0, (p.y / radius + 1) / 2, 0.5);
            f2.vertexColors[j] = color;
            color = new THREE.Color(0xffffff);
            color.setHSL(0.125 * vertexIndex / geometry.vertices.length, 1.0, 0.5);
            f3.vertexColors[j] = color;
        }
    }


    var mesh, wireframe;
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors, shininess: 0 });
    var wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });
    
    mesh = new THREE.Mesh(geometry3, material);
    wireframe = new THREE.Mesh(geometry3, wireframeMaterial);
    mesh.add(wireframe);
    mesh.scale.set(0.25,0.25,0.25);
    var clock = new THREE.Clock();
    if(options.requestAnimationFrame){
        options.requestAnimationFrame(function () {
            mesh.position.y=Math.sin(clock.getElapsedTime())*100+100;
            
        });
    }



    return mesh;
});

//Test commit
