
import loadScript from "simple-load-script";

let num = 0;
let callbackMap = {};


export function loadnExecute(url, initializer, callback) {
    num++;

    callbackMap[num] = callback;
    window[initializer] = function () {

        let attrs = document.currentScript.attributes;

        let scriptIndex;


        for (var i = attrs.length - 1; i >= 0; i--) {
            if (attrs[i].name === "data-scriptid") {
                scriptIndex = attrs[i].value;
                break;
            }

        }

        callbackMap[scriptIndex].apply(null,arguments);
        delete callbackMap[scriptIndex];


    }

    loadScript(url, {
        removeScript: true, attrs: {
            "data-scriptid": `${num}`
        }
    }).then(element => {
       console.log(`Loaded ${url}`);
    });



}





/*


loadnExecute("https://shakthi.github.io/ThreeJSUniverse/src/sampleMeshModule.js",
    "defineThreeUniverse", function (contruct) {
        //debugger;
        //document.currentScript;
        scene.add(contruct(THREE));
    });

*/


