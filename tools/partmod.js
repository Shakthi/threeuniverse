

const fs = require('fs');
const mappingpath = 'src/universe_parts'

exports.createASperePart = function(name){

    
    const content = 
    `
    defineThreeUniverse(function (THREE,UNIVERSE,SPACE) {

        return new Promise(function (resolve) {
            var geometry = new THREE.SphereGeometry( 50, 32, 32 );
            var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            var root = new THREE.Object3D();
            root.add(new THREE.Mesh( geometry, material ));
            root.position.set(0,0,-300);
            resolve(root);
            
        });
    })
    ` 


    fs.writeFileSync(mappingpath+"/"+name+".js",content)
}
