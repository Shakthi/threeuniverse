import * as THREE from 'three';
import Hammer from 'hammerjs'

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var isUpdate = false;
var nitroBoost = false;

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
    debugger;
    var originalRotation = 0;

    hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 20 });

    hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL ,velocity:0.1});
    hammer.on('panstart', function (ev) {

        originalRotation = controls.getObject().rotation.y;
    });
    hammer.on('pan', function (ev) {

        controls.getObject().rotation.y = originalRotation + ev.deltaX * 0.01;
        isUpdate = true;
    });

    

    hammer.on('swipeup', function (ev) {

        velocity = 10;
       

    });

    hammer.on('swipedown', function (ev) {

        velocity = -10;
 
     });
 

    return controls;
}
let prevPosition = new THREE.Vector3();
let prevRocation = new THREE.Vector3();
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
    if (isUpDateLocal) {

        console.log("postion",controls.getObject().position.x,controls.getObject().position.y,controls.getObject().position.z);
        
    }
    
    return isUpDateLocal;
}