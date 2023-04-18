import * as THREE from 'three';
// import * as PP from  './parameters.js';
import { CONST } from './parameters.js';
import { normalizePath } from 'vite';


export class Ball {
    
    private sphere; // pos stored in sphere
    private vel: THREE.Vector3;
    private acc: THREE.Vector3;

    private spinAxis: THREE.Vector3;
    private spinStrength: number;

    constructor() { 
        const geometry = new THREE.SphereGeometry(CONST.BALL_RAD);
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh(geometry, material);
        this.sphere = sphere;
        sphere.castShadow = true;
        this.reset();
    }
    
    public reset() {
        this.sphere.position.x = 0;
        this.sphere.position.y = 20;
        this.sphere.position.z = -34;   
        this.vel = new THREE.Vector3();
        this.acc = new THREE.Vector3();

        this.spinAxis = new THREE.Vector3();
        this.spinAxis.x = 1;
        // this.spinAxis.z = .3;
        this.spinStrength = 80;
        this.vel.z = 120;
        // this.vel.x = 40;
    }

    public getBall() {
        return this.sphere;
    }
    
    // get acceleration vector (does not change state)
    private applyForce(hit=new THREE.Vector3()) {
        let grav_acc = new THREE.Vector3(0, CONST.GRAVITY, 0);
        let drag_force = this.vel.clone().multiply(this.vel).multiplyScalar(-1 * CONST.BALL_DRAG); // const * vel^2
        let drag_acc = drag_force.multiplyScalar(1/CONST.BALL_MASS); // no effect

        return grav_acc.add(drag_acc).add(hit);
    }

    public update(dt) {
        // calculate new accleration
        let new_acc = this.applyForce();

        // calculate new velocity
        let new_vel = this.vel.clone().add(
            this.acc.clone().add(new_acc).multiplyScalar(dt * 0.5) // + (acc+new_acc)*(dt*0.5);
        )

        // calculate new position
        let new_pos = this.sphere.position.clone().add( // pos
            this.vel.clone().multiplyScalar(dt) // + vel*dt
        ).add(
            this.acc.multiplyScalar(dt*dt*0.5) // + acc*(0.5 * dt^2)
        )


        // collisions
        if (this.sphere.position.y - 1 <= CONST.BALL_RAD && Math.abs(this.sphere.position.x) <= CONST.TABLE_W / 2 && Math.abs(this.sphere.position.z) <= CONST.TABLE_L / 2) {
            // table collision
            new_acc = new THREE.Vector3()
            new_vel = new THREE.Vector3(this.vel.x, Math.abs(this.vel.y), this.vel.z); // lose energy?
            // spin?
 //       } else if (Math.abs(this.sphere.position.z) >= CONST.TABLE_L / 2 && Math.abs(this.sphere.position.x) < CONST.TABLE_W / 2) {
            // boundary collision
        } 

        // set values
        this.acc = new_acc;  
        this.vel = new_vel;
        this.sphere.position.x = new_pos.x;
        this.sphere.position.y = new_pos.y;
        this.sphere.position.z = new_pos.z;
        

        // Update velocity 
        // Conditions: Net collision, table boundary, table hit, no collision

        // //net collision TOD
        // if (this.spher(this.sphere.position.y <= CONST.NET_H && Math.abs(this.sphere.position.z) <= CONST.BALL_RAD * 2 && Math.abs(this.sphere.position.x) < CONST.TABLE_W / 2)is.sphere.position.z) >= CONST.TABLE_L / 2 && Math.abs(this.sphere.position.x) < CONST.TABLE_W / 2) { 
        //     this.vel.z = this.vel.z * -1;
        //     this.vel.x = this.vel.x * -1;
        //     this.vel.y = 40;
        //     return;
        // }

        // //if hit the table (within table bounds) //TODO add y range?
        // if(this.sphere.position.y <= CONST.BALL_RAD && Math.abs(this.sphere.position.x) <= CONST.TABLE_W / 2 && Math.abs(this.sphere.position.z) <= CONST.TABLE_L / 2) {
        //     this.vel.y = Math.abs(this.vel.y) - 1;
        //     // we have the original velocity of the ball
        //     // project the axis of rotation
        //     let dir: THREE.Vector3 = new THREE.Vector3(this.spinAxis.z, 0, -1 * this.spinAxis.x);
        //     dir = dir.normalize().multiplyScalar( this.spinStrength * .8);
        //     this.vel.addVectors(this.vel, dir);
            
        //     this.spinStrength *= .8;
        //     return;
        // } 
         
        // // hit the floor
        // if (this.sphere.position.y <= CONST.FLOOR_Y_POS) {
        //     //if below table, bam apply absorption from cool pingpong club floor
        //     this.vel.y = Math.abs(this.vel.y);
        //     this.vel.y *= CONST.FLOOR_Y_ABSORB;
        //     this.vel.z *= CONST.FLOOR_XZ_ABSORB; else if () {
        }
        //} 
        


    }


}