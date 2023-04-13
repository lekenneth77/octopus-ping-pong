import * as THREE from 'three';

const GRAVITY: number = -245.25;
const DRAG: number = 0.005;
export class Ball {
    private sphere;
    // private pos: THREE.Vector3;
    private vel: THREE.Vector3;
    private clock: THREE.Clock;
    constructor() {
        const geometry = new THREE.SphereGeometry(1);
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh( geometry, material );
        this.sphere = sphere;
        sphere.castShadow = true;
        this.reset();
        this.clock = new THREE.Clock();
    }
    
    public reset() {
        this.sphere.position.x = -10;
        this.sphere.position.y = 20;
        this.sphere.position.z = -34;   
        this.vel = new THREE.Vector3();
        this.vel.z = 120;
        this.vel.x = 40;
    }

    public getBall() {
        return this.sphere;
    }

    public update() {
        let t: number = this.clock.getDelta();
        //TODO: check dynamic t/frame
        // let t: number = 0.02;

        // // update position according to velocity
       
        if (Math.abs(this.sphere.position.z) >= 34.5 && Math.abs(this.sphere.position.x) < 19.5) { 
            this.vel.z = this.vel.z * -1;
            this.vel.x = this.vel.x * -1;
            this.vel.y = 40;

            //scale by speed in z and height
        }
        if(this.sphere.position.y <= 0.5 && Math.abs(this.sphere.position.x) < 19.5) {
            this.vel.y = Math.abs(this.vel.y) - 1;
        } else if (this.sphere.position.y <= -20) {
            this.vel.y = Math.abs(this.vel.y);
            //apply absorption from cool pingpong club floor
            this.vel.y *= 0.5;
            this.vel.z *= 0.99; 
            this.vel.x *= 0.99;
        } else {
            // Velocity combines gravity and drag acceleration
            let drag = new THREE.Vector3();
            drag.copy(this.vel).multiplyScalar(-1 * DRAG);
            // this.vel.x = drag.x + this.vel.x;
            this.vel.y = GRAVITY * t + drag.y + this.vel.y;
            // this.vel.z = drag.z + this.vel.z;
        }

        this.sphere.position.x = this.vel.x * t + this.sphere.position.x;
        this.sphere.position.y = this.vel.y * t + this.sphere.position.y;
        this.sphere.position.z = this.vel.z * t + this.sphere.position.z;
        
        // update velocity based on gravity
    }


}