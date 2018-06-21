import { datGUI } from './dat'

let fps = {
    displayCount: 0,
    count: 0,
    time:0
}


function init(info) {

    let infogui = datGUI.addFolder('Info');

    infogui.add(info.render, 'calls').name("render calls");
    infogui.add(info.render, 'triangles')
    infogui.add(info.memory, 'geometries');
    infogui.add(info.memory, 'textures');
    infogui.add(info.programs, 'length').name("Shaders");
    infogui.add(fps, 'displayCount').name("Est fps");

    

    function updatePerSecond() {
        
        var avg = fps.time / fps.count;
        fps.displayCount = 3000/(avg*100);
        fps.time = fps.count= 0;
        ;

        setTimeout(updatePerSecond, 1000);

        if (!infogui.closed) {

            for (var i in infogui.__controllers) {
                infogui.__controllers[i].updateDisplay();
            }
        }
    }
    updatePerSecond();






    //update();


}


//datGUI.add
var startTime;
export var timeRenderBegin = function () {

    startTime = new Date();

    //requestAnimationFrame(update);

    // 
};

export var timeRenderEnd = function () {
    var endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
   
    fps.time += timeDiff;
    fps.count++;
}
export { init as initVisibilityDesider }

