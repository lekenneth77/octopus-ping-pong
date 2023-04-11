import * as THREE from 'three';

const GRAVITY: number = -245.25;

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
        this
        // pos
        this.sphere.position.y = 20;
        this.vel = new THREE.Vector3();
        this.clock = new THREE.Clock();
    }

    public getBall() {
        return this.sphere;
    }

    public update() {
        let t: number = this.clock.getDelta();

        // update position according to velocity
        this.sphere.position.y = this.vel.y * t + this.sphere.position.y;
        
        if(this.sphere.position.y <= 0.5) {
            this.vel.y = Math.abs(this.vel.y);
        } else {
            this.vel.y = GRAVITY * t + this.vel.y;
        }
        // update velocity based on gravity
    }


}