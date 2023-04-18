import * as THREE from 'three';
import { Ball } from '/ball';
import { Vector3 } from 'three';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import {CONST} from './parameters';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();

//first person camera
const controls = new FlyControls(camera, renderer.domElement);
const CAM_MOVE_SPD = 100;
const CAM_ROLL_SPD = Math.PI / 4;
controls.movementSpeed = CAM_MOVE_SPD;
controls.domElement = renderer.domElement;
controls.rollSpeed = CAM_ROLL_SPD;
controls.autoForward = false;
controls.dragToLook = true;


let ball = new Ball();
scene.add( ball.getBall() );

//plane
const planeGeo = new THREE.BoxGeometry( CONST.TABLE_W, CONST.TABLE_L, CONST.TABLE_H);
const planeMat = new THREE.MeshPhongMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeo, planeMat );
plane.receiveShadow = true;
scene.add( plane );
plane.position.y = - (CONST.TABLE_H);
plane.rotateX(Math.PI/2);

//net
const netGeo = new THREE.BoxGeometry( CONST.NET_L, CONST.NET_H, CONST.NET_W  );
const netMat = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
const net = new THREE.Mesh( netGeo, netMat );
net.position.y = CONST.NET_H / 2;
scene.add( net );

//floor
const floorGeo = new THREE.PlaneGeometry( CONST.FLOOR_XZ, CONST.FLOOR_XZ );
const floorMat = new THREE.MeshPhongMaterial( {color: 0x765432, side: THREE.DoubleSide} );
const floor = new THREE.Mesh( floorGeo, floorMat );
// floor.receiveShadow = true;
scene.add( floor );
floor.position.y = CONST.FLOOR_Y_POS;
floor.rotateX(Math.PI/2);

//add light
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 50, 0);
light.castShadow = true;
scene.add(light);
light.shadow.camera.left = -1 * (CONST.TABLE_X / 2);
light.shadow.camera.right = CONST.TABLE_X / 2;
light.shadow.camera.bottom = -1 * (CONST.TABLE_Z / 2);
light.shadow.camera.top = CONST.TABLE_Z / 2;

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

//camera position
camera.position.z = 0;
camera.position.x = 0;
camera.position.y = 80;
camera.lookAt(0, 0, 0);
let followAt = false;

function animate() {
	requestAnimationFrame( animate );
	const deltaT = clock.getDelta();
	ball.update(deltaT);
	controls.update(deltaT);
	if (followAt) {
		camera.lookAt(ball.sphere.position);
	}
	renderer.render( scene, camera );
}
animate();

addEventListener("keydown", (event) => {
	switch(event.key.toLowerCase()) {
		//Reset Round
		case('p'):
			ball.reset();
			break;
		case('1'):
			//above table view
			camera.position.z = 0;
			camera.position.x = 0;
			camera.position.y = 80;
			camera.lookAt(0, 0, 0);
			break;
		case('2'):
			//side table view
			camera.position.z = 0;
			camera.position.x = 40;
			camera.position.y = 10;
			camera.lookAt(0, 0, 0);
			break;
		case('3'):
			camera.position.z = - (CONST.TABLE_L / 2) - 20;
			camera.position.x = 0;
			camera.position.y = 20;
			camera.lookAt(0, 0, 0);
			break;
		case('`'):
			followAt = !followAt;
			break;
		default:
			break;
	}
});

