

const fs = require('fs');
const mappingpath = 'resource/mapping.json'
let jsonobject;

exports.open = function(){
    jsonobject = JSON.parse(fs.readFileSync(mappingpath).toString());
}

exports.setLocalPart = function setLocalPart( githubPageUrl) {
    jsonobject.local_part = githubPageUrl;
}

exports.appingNewPartViaMarker = function appingNewPartViaMarker(newData) {
        jsonobject.maping.push(newData)
    
}


exports.write = function(){
    fs.writeFileSync(mappingpath,JSON.stringify(jsonobject,null,2))
}

