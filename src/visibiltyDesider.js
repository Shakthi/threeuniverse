import { datGUI } from './dat'


function init(info) {

    let fps = {
        displayCount:0,
        count:0
    }

    let infogui = datGUI.addFolder('Info');

    infogui.add(info.render, 'calls').name("render calls");
    infogui.add(info.render, 'triangles')
    infogui.add(info.memory, 'geometries');
    infogui.add(info.memory, 'textures');
    infogui.add(info.programs, 'length');
    infogui.add(fps, 'displayCount').name("fps");
    

    function updatePerSecond(){
        fps.displayCount = fps.count;
        fps.count = 0;
        setTimeout(updatePerSecond,1000);
    } 
    updatePerSecond();




    var update = function () {
        fps.count ++;
        requestAnimationFrame(update);

        if (!infogui.closed) {

            for (var i in infogui.__controllers) {
                infogui.__controllers[i].updateDisplay();
            }
        }
    };

    update();


}


//datGUI.add


export { init as initVisibilityDesider }

