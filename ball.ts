import * as THREE from 'three';
// import * as PP from  './parameters.js';
import { CONST } from './parameters.js';
import { normalizePath } from 'vite';
import {Octopus} from './octopus';


export class Ball {
    
    private sphere;
    private vel: THREE.Vector3;
    private spinAxis: THREE.Vector3;
    private spinStrength: number;
    private playerOne: Octopus;
    private playerTwo: Octopus;

    constructor(playerOne, playerTwo) { 
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
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
    
    public update(t) {
        // update position according to velocity
        this.sphere.position.x = this.vel.x * t + this.sphere.position.x;
        this.sphere.position.y = this.vel.y * t + this.sphere.position.y;
        this.sphere.position.z = this.vel.z * t + this.sphere.position.z;

        // Update velocity 
        // Conditions: Net collision, table boundary, table hit, no collision

        //net collision TOD
        if (this.sphere.position.y <= CONST.NET_H && Math.abs(this.sphere.position.z) <= CONST.BALL_RAD * 2 && Math.abs(this.sphere.position.x) < CONST.TABLE_W / 2) {
            this.vel.x = 0;
            this.vel.z = 0;
            this.vel.y = 0.8 * this.vel.y;
            if (this.vel.y <= 0.005 && this.sphere.position.y <= CONST.BALL_RAD) {
                this.sphere.position.y = CONST.BALL_RAD;
                return;
            }
        }
       
        //table bondary
        if (Math.abs(this.sphere.position.z) >= CONST.TABLE_L / 2 && Math.abs(this.sphere.position.x) < CONST.TABLE_W / 2) { 
            this.vel.z = this.vel.z * -1;
            this.vel.x = this.vel.x * -1;
            this.vel.y = 40;
            return;
        }

        //if hit the table (within table bounds) //TODO add y range?
        if(this.sphere.position.y <= CONST.BALL_RAD && Math.abs(this.sphere.position.x) <= CONST.TABLE_W / 2 && Math.abs(this.sphere.position.z) <= CONST.TABLE_L / 2) {
            this.vel.y = Math.abs(this.vel.y) - 1;
            // we have the original velocity of the ball
            // project the axis of rotation
            let dir: THREE.Vector3 = new THREE.Vector3(this.spinAxis.z, 0, -1 * this.spinAxis.x);
            dir = dir.normalize().multiplyScalar( this.spinStrength * .8);
            this.vel.addVectors(this.vel, dir);
            
            this.spinStrength *= .8;
            return;
        } 
         
        // hit the floor
        if (this.sphere.position.y <= CONST.FLOOR_Y_POS) {
            //if below table, bam apply absorption from cool pingpong club floor
            this.vel.y = Math.abs(this.vel.y);
            this.vel.y *= CONST.FLOOR_Y_ABSORB;
            this.vel.z *= CONST.FLOOR_XZ_ABSORB; 
            this.vel.x *= CONST.FLOOR_XZ_ABSORB;
            return;
        } 
        
        //no collision

        // Velocity combines gravity and drag acceleration
        let drag = new THREE.Vector3();
        drag.copy(this.vel).multiplyScalar(-1 * CONST.DRAG);
        this.vel.x = drag.x + this.vel.x;
        this.vel.y = CONST.GRAVITY * t + drag.y + this.vel.y;
        this.vel.z = drag.z + this.vel.z;
    

    }


}