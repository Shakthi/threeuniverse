
import loadScript from "simple-load-script";


let num = 0;
let callbackMap = {};

/** Loads external javascript. Via initializerName function callback executed from the external script*/
export function loadnExecute(url, initializerName, callback) {
    num++;
    if (initializerName) {
        callbackMap[num] = callback;
        window[initializerName] = function () {

            let attrs = document.currentScript.attributes;

            let scriptIndex;


            for (var i = attrs.length - 1; i >= 0; i--) {
                if (attrs[i].name === "data-scriptid") {
                    scriptIndex = attrs[i].value;
                    break;
                }

            }

            callbackMap[scriptIndex].apply(null, arguments);
            delete callbackMap[scriptIndex];


        }

    }

    return new Promise((resolve, reject) => {
        loadScript(url, {
            removeScript: initializerName?true:false, attrs: {
                "data-scriptid": `${num}`
            }
        }).then(resolve).catch(reject);

    });




}



