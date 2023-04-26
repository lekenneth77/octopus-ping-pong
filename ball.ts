import * as THREE from 'three';
// import * as PP from  './parameters.js';
import { CONST } from './parameters.js';
import { normalizePath } from 'vite';
import {Octopus} from './octopus';


export class Ball {
    
    private sphere;
    private pos: THREE.Vector3;
    private vel: THREE.Vector3;
    private acc: THREE.Vector3;
    private spinAxis: THREE.Vector3;
    private spinStrength: number;

    private playerOne: Octopus;
    private playerTwo: Octopus;
    private playerSide: number;
    private hitSide: number;

    constructor(playerOne, playerTwo) { 
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        const geometry = new THREE.SphereGeometry(CONST.BALL_RAD);
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh(geometry, material);
        this.sphere = sphere;
        sphere.castShadow = true;
        this.reset(new THREE.Vector3(-19, 20, -39), new THREE.Vector3(0, 0, 120));
    }

    private getSide() {
       return this.pos.z <= 0 ? 0 : 1;
    }

    private updateSphere() {
        this.sphere.position.x = this.pos.x;
        this.sphere.position.y = this.pos.y;
        this.sphere.position.z = this.pos.z; 
    }
    
    public reset(pos: THREE.Vector3, vel: THREE.Vector3) {
        this.pos = pos  
        this.vel = vel;
        this.acc = new THREE.Vector3();
        this.spinAxis = new THREE.Vector3();
        this.spinStrength = 0;
        this.playerSide = this.getSide();
        this.hitSide = 0;
        this.updateSphere()
    }

    public getBall() {
        return this.sphere;
    }
    
    // get acceleration vector (does not change state)
    private applyForce(vel) {
        let grav_acc = new THREE.Vector3(0, CONST.GRAVITY, 0);
        let drag_force = vel.clone().multiply(vel).multiplyScalar(-1 * CONST.BALL_DRAG); // const * vel^2
        let drag_acc = drag_force.multiplyScalar(1/CONST.BALL_MASS); // no effect

        return grav_acc.add(drag_acc);
    }

    private verlet(old_pos, old_vel, old_acc, dt) {
        // calculate new accleration
        let new_acc = this.applyForce(old_vel);
        // calculate new velocity
        let new_vel = old_vel.clone().add(
            old_acc.clone().add(new_acc).multiplyScalar(dt * 0.5) // + (acc+new_acc)*(dt*0.5);
        )
        // calculate new position
        let new_pos = old_pos.clone().add( // pos
            old_vel.clone().multiplyScalar(dt) // + vel*dt
        ).add(
            old_acc.clone().multiplyScalar(dt*dt*0.5) // + acc*(0.5 * dt^2)
        )

        return {
            pos: new_pos,
            vel: new_vel,
            acc: new_acc
        }
    }

    public update(dt) {
        let update = this.verlet(this.pos, this.vel, this.acc, dt)
        // detect table collision a posteriori
        if (this.pos.y - CONST.BALL_RAD > CONST.TABLE_Y 
            && update.pos.y - CONST.BALL_RAD <= CONST.TABLE_Y) 
            {

            let t_prop = ((this.pos.y - CONST.BALL_RAD) - CONST.TABLE_Y) / (this.pos.y - CONST.BALL_RAD - (update.pos.y - CONST.BALL_RAD))
            
            let collision = this.verlet(this.pos, this.vel, this.acc, dt * t_prop)

            collision.vel.y = -1 * collision.vel.y
            update = this.verlet(collision.pos, collision.vel, collision.acc, dt * (1-t_prop));

            let dir: THREE.Vector3 = new THREE.Vector3(this.spinAxis.z, 0, -1 * this.spinAxis.x);
            dir = dir.normalize().multiplyScalar( this.spinStrength * .8);
            update.vel.addVectors(update.vel, dir);

            this.spinStrength *= .8;

        } else if (Math.abs(this.sphere.position.z) >= CONST.TABLE_L / 2 && Math.abs(this.sphere.position.x) < CONST.TABLE_W / 2) {
            // table boundary
            if (this.getSide()) {
                let player_vel = new THREE.Vector3(0,0,-1);
                player_vel.applyAxisAngle(new THREE.Vector3(0,-1,0), THREE.MathUtils.degToRad(this.playerOne.horizontalAngle));
                player_vel.applyAxisAngle(new THREE.Vector3(1,0,0), THREE.MathUtils.degToRad(this.playerOne.verticalAngle));

                update.vel = player_vel.multiplyScalar(this.playerOne.force);
                this.spinAxis = this.playerOne.spinAxis;
                this.spinStrength = this.playerOne.spinStrength;
            } else {
                let player_vel = new THREE.Vector3(0,0,1);
                player_vel.applyAxisAngle(new THREE.Vector3(0,-1,0), THREE.MathUtils.degToRad(this.playerTwo.horizontalAngle));
                player_vel.applyAxisAngle(new THREE.Vector3(-1,0,0), THREE.MathUtils.degToRad(this.playerTwo.verticalAngle));

                update.vel = player_vel.multiplyScalar(this.playerTwo.force);
                this.spinAxis = this.playerTwo.spinAxis;
                this.spinStrength = this.playerTwo.spinStrength;
            }

        } else if (this.sphere.position.y <= CONST.NET_H && Math.abs(this.sphere.position.z) <= CONST.BALL_RAD * 2 && Math.abs(this.sphere.position.x) < CONST.TABLE_W / 2) {            // 
            // net collision
            //update.vel = new THREE.Vector3(0, this.vel.y * .4, 0)
       } 
       
        // set values
        this.acc = update.acc;  
        this.vel = update.vel;
        this.pos = update.pos;
        this.updateSphere()
    }


}