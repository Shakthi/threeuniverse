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
var velocity = new THREE.Vector3();
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

    hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL,threshold:20 });

    hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammer.on('panstart', function (ev) {

        originalRotation = controls.getObject().rotation.y;
    });
    hammer.on('pan', function (ev) {

        controls.getObject().rotation.y = originalRotation + ev.deltaX * 0.01;
        isUpdate = true;

    });

    hammer.on('swipe', function (ev) {
        
        console.log(ev);

    });
    var onKeyDown = function (event) {


        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 66: // b
            case 67: // c
            case 86: // v
            case 78: // v
            case 77: // v
                nitroBoost = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

        }

    };


    var onKeyUp = function (event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;


            case 66: // b
            case 67: // c
            case 86: // v
            case 78: // v
            case 77: // v
                nitroBoost = false; break;
        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    return controls;

}


let prevPosition = new THREE.Vector3();
let prevRocation = new THREE.Vector3();

export function update(onObject) {

    // if (!controls.enabled)
    //     return;

    var isUpDateLocal = isUpdate;
    isUpdate = false;

    return isUpDateLocal;
}