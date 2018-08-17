import * as THREE from 'three';
import GroundRayCaster from './utils/GroundRayCaster';

const groundCaster = new GroundRayCaster();
const PointerLockControls = require('three-pointerlock');

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var nitroBoost = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();


var controls;
export function enabled() {
    return controls.enabled;
}

export function init(camera, position) {

    controls = new PointerLockControls(camera);
    controls.getObject().translateX(position.x);
    controls.getObject().translateZ(position.z);
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
let oldHieght = 0;

export function update(onObject) {

    if (!controls.enabled) {
        prevTime = performance.now();
        return;
    }

    var time = performance.now();
    var delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    direction.normalize(); // this ensures consistent movements in all directions

    let mult = 1000;
    if (nitroBoost) {
        mult = 4000;
    }


    if (moveForward || moveBackward) velocity.z -= direction.z * mult * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * mult * delta;


    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateZ(velocity.z * delta);

    groundCaster.ray.origin.set(
        controls.getObject().position.x,
        300,
        controls.getObject().position.z
    );






    prevTime = time;
    let isUpdate = false;
    let distace = prevPosition.distanceTo(controls.getObject().position);
    let distace2d = Math.sqrt(
        (prevPosition.x -controls.getObject().position.x)*(prevPosition.x -controls.getObject().position.x)
        +(prevPosition.z -controls.getObject().position.z)*(prevPosition.z -controls.getObject().position.z));



    let rotation = new THREE.Vector3().subVectors(new THREE.Vector3(controls.getObject().rotation.x,
        controls.getObject().rotation.y,
        controls.getObject().rotation.z),
        new THREE.Vector3(prevRocation.x,
            prevRocation.y,
            prevRocation.z));

    if (distace > Number.EPSILON || Math.abs(rotation.x) > Number.EPSILON
        || Math.abs(rotation.y) > Number.EPSILON
        || Math.abs(rotation.z) > Number.EPSILON) {

        isUpdate = true;
    }


    prevPosition = controls.getObject().position.clone();
    prevRocation = controls.getObject().rotation.clone();

    if (isUpdate) {

        var intersectObject = groundCaster.intersectObjects();

        if (intersectObject.length) {
            
            if (oldHieght) {
                oldHieght =  ( intersectObject[0].point.y-oldHieght ) * distace2d*0.05+oldHieght ;   
            }else{
                oldHieght = intersectObject[0].point.y;
            }
             
            controls.getObject().position.y = oldHieght;    
        
            

        }
    }


    return isUpdate;
}