
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








export default class GroundRayCaster extends THREE.Raycaster {

    constructor(origin, direction, near, far) {
        if (!direction)
            direction = new THREE.Vector3(0, -1, 0);
        super(origin, direction, near, far);
    }

    hasGround() {
        return this.groundObjects.length > 0;
    }

    intersectObjects() {
        return super.intersectObjects(this.groundObjects, false);
    }

    intersectObjectsOrWait() {

        var savethis = this;

        return new Promise(function (resolve, reject) { //TODO have a cancellable promise

            function getResultIfPossible(resolve, _savethis) {

                let result = _savethis.intersectObjects();

                if (result.length) {
                    console.log(result[0].point.y);
                    resolve(result);

                }
                else {

                    GroundRayCaster.registerAddGroundCallBack((ground) => {

                        getResultIfPossible(resolve, _savethis);

                    })
                }

            }


            getResultIfPossible(resolve, savethis);


        })
    }


    static registerAddGroundCallBack(callback) {
        GroundRayCaster.prototype.addGroundObjectsCallBack.push(callback);
    }
    static addGround(ground) {

        requestAnimationFrame(() => {
            if (!GroundRayCaster.prototype.addGroundObjectsCallBack)
                GroundRayCaster.prototype.addGroundObjectsCallBack = [];

            GroundRayCaster.prototype.groundObjects.push(ground);
            GroundRayCaster.prototype.addGroundObjectsCallBack.forEach(element => {
                element(ground);
            });
            GroundRayCaster.prototype.addGroundObjectsCallBack = [];
        });


    }

    static removeGround(ground) {
        GroundRayCaster.prototype.splice(GroundRayCaster.prototype.indexOf(ground));
    }


};





GroundRayCaster.prototype.groundObjects = [];
GroundRayCaster.prototype.addGroundObjectsCallBack = [];


export function LocalGroundRayCasterGenerater(offset) {

    return function LocalGroundRayCaster(origin, direction, near, far) {
        if (!origin)
            origin = new THREE.Vector3();
        origin.add(offset);
        return new GroundRayCaster(origin, direction, near, far);
    }

}
