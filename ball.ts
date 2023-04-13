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
        this
        // pos
        this.sphere.position.y = 20;
        this.sphere.position.z = 0;
        this.vel = new THREE.Vector3();
        // this.vel.x = 20;
        this.vel.z = 50;
        this.clock = new THREE.Clock();
    }

    public getBall() {
        return this.sphere;
    }

    public update() {
        let t: number = this.clock.getDelta();
        //TODO: check dynamic t/frame
        //let t: number = 0.01;
        console.log(this.vel.x + " " +this.vel.y + " " + this.vel.z);
        if (this.sphere.position.y <= 0.51 && Math.abs(this.vel.y) <= 2) {
            this.sphere.position.y = 0.5;
            return;
            if(Math.abs(this.vel.x) <= 0.1 && Math.abs(this.vel.z) <= 0.1) {
            }
        }

        // update position according to velocity
        if (Math.abs(this.sphere.position.x) >= 19.5) {
            this.vel.x = this.vel.x * -1;
        }
        if (Math.abs(this.sphere.position.z) >= 34.5) { 
            this.vel.z = this.vel.z * -1;
            this.vel.z = this.vel.z < 0 ? Math.random() * -40 - 40 : Math.random() * 40 + 40;
            this.vel.y = 80;
        }
        if(this.sphere.position.y <= 0.5) {
            this.vel.y = Math.abs(this.vel.y) - 1;
        } else {
            // Velocity combines gravity and drag acceleration
            let drag = new THREE.Vector3();
            drag.copy(this.vel).multiplyScalar(-1 * DRAG);
            this.vel.x = drag.x + this.vel.x;
            this.vel.y = GRAVITY * t + drag.y + this.vel.y;
            this.vel.z = drag.z + this.vel.z;

        }

        this.sphere.position.x = this.vel.x * t + this.sphere.position.x;
        this.sphere.position.y = this.vel.y * t + this.sphere.position.y;
        this.sphere.position.z = this.vel.z * t + this.sphere.position.z;
        
        // update velocity based on gravity
    }


}