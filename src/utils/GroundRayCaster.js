
import * as THREE from 'three'
import EventEmitter from 'events'


export function Raycast(origin, direction, near, far, objects, recursive, param) {
    let rayCaster = new THREE.Raycaster(origin, direction, near, far);
    let target = [];
    rayCaster.intersectObjects(objects, recursive, target);

    return target;
}



export function GroundRaycast(origin, direction, near, far, objects, recursive, param) {
    if (!GroundManager.groundObjectList)
        return [];

    if (!direction)
        direction = new THREE.Vector3(0, -1, 0);
    let result = Raycast(origin, direction, near, far, GroundManager.groundObjectList, false);
    return result;
}




class GroundManagerClass extends EventEmitter {
    constructor() {
        super();
        this.groundObjectList = [];
    }

    add(ground) {
        requestAnimationFrame(() => {
            this.groundObjectList.push(ground);
            this.emit("added", ground);
        })

    }

    remove(ground) {
        let pos = this.groundObjectList.indexOf(ground);
        this.groundObjectList.splice(pos, 1);
        this.emit("removed", ground);
    }

    hasGround() {
        return this.groundObjectList.length != 0;
    }

    hasGroundPromise(cancelToken) {
        return new Promise((resolve, reject) => {
            this.once("added", resolve)

            if (cancelToken)
                cancelToken(() => {
                    this.off("added", resolve);
                    reject('cancelToken');
                });
        });
    }

};

export let GroundManager = new GroundManagerClass();


export function GetGroundHitPoint(point, cancelTocken) {

    return new Promise((resolve, reject) => {

        function getHit() {

            let hitlist = GroundRaycast(point, undefined, undefined, undefined, GroundManager.groundObjectList);
            if (hitlist.length)
                resolve(hitlist);
            else GroundManager.hasGroundPromise(cancelTocken).then(getHit, reject)
        }
        getHit();

    });



}








