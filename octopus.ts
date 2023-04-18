import * as THREE from 'three';
import { CONST } from './parameters.js';

export class Octopus {
    public horizontalAngle: number;
    public verticalAngle: number;
    public force: number;
    public spinAxis: THREE.Vector3;

    public spinStrength: number;

    constructor() {
        this.horizontalAngle = 0;
        this.verticalAngle = 0;
        this.force = 0;
        this.spinAxis = new THREE.Vector3();
        this.spinStrength = 0;
    }

}