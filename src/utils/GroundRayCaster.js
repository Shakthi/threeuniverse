
import * as THREE from 'three'

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

        var super_intersectObjects = ()=>super.intersectObjects(this.groundObjects, false);

        return new Promise(function (resolve, reject) { //TODO have a cancellable promise

            function getResultIfPossible(resolve) {

                let result = super_intersectObjects();
                if (result) {
                    resolve(result);
                }
                else {

                    GroundRayCaster.registerAddGroundCallBack((ground) => {

                        getResultIfPossible(resolve);

                    })
                }

            }


            getResultIfPossible(resolve);


        })
    }


    static registerAddGroundCallBack(callback) {
        GroundRayCaster.prototype.addGroundObjectsCallBack.push(callback);
    }
    static addGround(ground) {
        GroundRayCaster.prototype.addGroundObjectsCallBack.forEach(element => {
            element(ground);
        });
        GroundRayCaster.prototype.addGroundObjectsCallBack = [];

        GroundRayCaster.prototype.groundObjects.push(ground);
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
