import * as THREE from 'three';
import Hammer from 'hammerjs'

var isUpdate = false;

var prevTime = performance.now();
var velocity = 0;
var direction = new THREE.Vector3();
var hammer = null;

var controls = {
    camera: null,
    enabled: false,
    getObject: function () {
        return this.camera;
    }

}
export function enabled() {
    return controls.enabled;
}

export function init(camera, position, element) {

    controls.camera = camera;
    hammer = new Hammer(element);
    controls.getObject().translateX(position.x);
    controls.getObject().translateZ(position.z);
    var originalRotation = 0;

    
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 5 });
    hammer.get('rotate').set({ enable: true });



    var lastdelta = 0;
    var lastdeltaX = 0;
    hammer.on('panstart', function (ev) {

        lastdelta = 0;
        lastdeltaX = 0;
    });
    hammer.on('rotatestart', function (ev) {

        originalRotation = ev.rotation;
    });

    hammer.on('rotatemove', function (ev) {
        controls.getObject().rotation.y = (ev.rotation- originalRotation)*Math.PI/180;
        isUpdate = true;
    });


    hammer.on('pan', function (ev) {

        //controls.getObject().rotation.y = originalRotation + ev.deltaX * 0.01;
        controls.getObject().translateZ(lastdelta - ev.deltaY);
        controls.getObject().translateX(lastdeltaX - ev.deltaX);
        
        lastdelta = ev.deltaY;
        lastdeltaX = ev.deltaX;
        isUpdate = true;
    });

    return controls;
}
let prevPosition = new THREE.Vector3();
let clock = new THREE.Clock();
export function update(onObject) {

    if (!controls.enabled) {
        if (clock.running) {
            clock.stop();
        }

        return;
    }
    if (!clock.running) {
        clock.start();
    }
    var delta = clock.getDelta();


    function damp(original, delta) {
        var ret = original;
        if (ret > 0) {
            ret -= delta;
            if (ret < 0)
                ret = 0;
        }
        else if (ret < 0) {
            ret += delta;
            if (ret > 0)
                ret = 0;
        }

        return ret;

    }

    velocity = damp(velocity, delta * 10);

    prevPosition = controls.getObject().position.clone();
    controls.getObject().translateZ(velocity * delta);

    let distace = prevPosition.distanceTo(controls.getObject().position);


    if (distace > Number.EPSILON)
        isUpdate = true;



    var isUpDateLocal = isUpdate;
    isUpdate = false;
   
    return isUpDateLocal;
}