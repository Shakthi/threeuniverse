import { datGUI } from './gui'


//Since screen refresh done on demand, We estimate fps based on time taken to render.
let pseudoFPS = {
    displayCount: 0,
    count: 0,
    time:0
}


export function init(info) {

    let infogui = datGUI.addFolder('Info');

    infogui.add(info.render, 'calls').name("render calls");
    infogui.add(info.render, 'triangles')
    infogui.add(info.memory, 'geometries');
    infogui.add(info.memory, 'textures');
    infogui.add(info.programs, 'length').name("Shaders");
    infogui.add(pseudoFPS, 'displayCount').name("Est FPS");

    

    function updatePerSecond() {
        
        var avg = pseudoFPS.time / pseudoFPS.count;
        pseudoFPS.displayCount = 3000/(avg*100);
        pseudoFPS.time = pseudoFPS.count= 0;
        

        setTimeout(updatePerSecond, 1000);

        if (!infogui.closed) {

            for (var i in infogui.__controllers) {
                infogui.__controllers[i].updateDisplay();
            }
        }
    }
    updatePerSecond();






}


var startTime;
export var timeRenderBegin = function () {
    startTime = new Date();
};

export var timeRenderEnd = function () {
    var endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
   
    pseudoFPS.time += timeDiff;
    pseudoFPS.count++;
}

