


let panel = {

    init: function (controls, md) {

        var blocker = document.getElementById('blocker');
        var instructions = document.getElementById('instructions');
        var control_instruction = document.getElementById('control-instruction');
        var start_instruction = document.getElementById('start-instruction');

        if (md.mobile()) {
            control_instruction.innerHTML = "Pan = Move</br>Rotate = Look around";
            start_instruction.innerHTML = "Tap to roam; fork to edit "


            instructions.addEventListener('click', function (event) {

                instructions.style.display = 'none';
                blocker.style.display = 'none';
                controls.enabled = true;

                

            }, false);

        } else {
            // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

            if (havePointerLock) {

                var element = document.body;

                var pointerlockchange = function (event) {

                    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {


                        controls.enabled = true;

                        blocker.style.display = 'none';

                    } else {

                        controls.enabled = false;

                        blocker.style.display = 'block';

                        instructions.style.display = '';

                    }

                };



                var pointerlockerror = function (event) {

                    instructions.style.display = '';

                };

                // Hook pointer lock state change events
                document.addEventListener('pointerlockchange', pointerlockchange, false);
                document.addEventListener('mozpointerlockchange', pointerlockchange, false);
                document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

                document.addEventListener('pointerlockerror', pointerlockerror, false);
                document.addEventListener('mozpointerlockerror', pointerlockerror, false);
                document.addEventListener('webkitpointerlockerror', pointerlockerror, false);


                instructions.addEventListener('click', function (event) {

                    instructions.style.display = 'none';

                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                    element.requestPointerLock();

                }, false);

            } else {

                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

            }
        }


    }





}

export default panel;