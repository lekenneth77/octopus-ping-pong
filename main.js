import * as THREE from 'three';
import { Ball } from '/ball';
import { Octopus } from '/octopus';
import { Vector3 } from 'three';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {CONST} from './parameters';
import { GUI } from 'dat.gui'

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
const CAM_MOVE_SPD = CONST.CAM_MV_SPD;
const CAM_ROLL_SPD = CONST.CAM_ROLL_SPD;
controls.movementSpeed = CAM_MOVE_SPD;
controls.domElement = renderer.domElement;
controls.rollSpeed = CAM_ROLL_SPD;
controls.autoForward = false;
controls.dragToLook = true;



let playerOne = new Octopus();
let playerTwo = new Octopus();
let ball = new Ball(playerOne, playerTwo);
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
light.shadow.camera.left = -1 * (CONST.TABLE_W / 2);
light.shadow.camera.right = CONST.TABLE_W / 2;
light.shadow.camera.bottom = -1 * (CONST.TABLE_L / 2);
light.shadow.camera.top = CONST.TABLE_L / 2;

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
let freeze = false;

const loader = new GLTFLoader();
let modelOne = new THREE.Object3D();
loader.load( './models/set_purple_octboy.glb', function ( gltf ) {
	modelOne.add(gltf.scene);
	modelOne.castShadow = true;
	modelOne.receiveShadow = true;
	modelOne.scale.set(2, 2, 2);
	scene.add(modelOne);
},);

let modelTwo = new THREE.Object3D();
loader.load( './models/set_red_octboy.glb', function ( gltf ) {
	modelTwo.add(gltf.scene);
	modelTwo.castShadow = true;
	modelTwo.receiveShadow = true;
	modelTwo.scale.set(2, 2, 2);
	scene.add(modelTwo);
},);


modelOne.position.set ( 0, 2, -CONST.TABLE_L / 2);
modelOne.rotation.set(0, Math.PI / 2, 0);
modelTwo.position.set(0, 2, CONST.TABLE_L / 2);
modelTwo.rotation.set(0, -Math.PI / 2, 0);


//       bus.body.rotation.set ( 0, -1.5708, 0 );
//       bus.body.castShadow = true;
//       bus.frame.add(bus.body);

const gui = new GUI();

const sceneFolder = gui.addFolder('Underwater');
sceneFolder.add(CONST, 'BALL_DRAG', 0, 1);
sceneFolder.open();

const ballFolder = gui.addFolder('Ball Initial State');
let initialPos = {pos_x: 15, pos_y: 10, pos_z: -34};
let initialVel = {vel_x: 0, vel_y: 0, vel_z: 120};
ballFolder.add(initialPos, 'pos_x', -CONST.TABLE_W / 2, CONST.TABLE_W / 2);
ballFolder.add(initialPos, 'pos_y', 0, 40);
ballFolder.add(initialPos, 'pos_z', -CONST.TABLE_L / 2, CONST.TABLE_L / 2);
ballFolder.add(initialVel, 'vel_x', -200, 200);
ballFolder.add(initialVel, 'vel_y', 0, 100);
ballFolder.add(initialVel, 'vel_z', -200, 200);
ballFolder.open();

addGuiOctopus("Octopus One", playerOne).open();
addGuiOctopus("Octopus Two", playerTwo).open();

const player1Geo = new THREE.BoxGeometry( 1, 1, 1 );
const player1Mat = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const player1 = new THREE.Mesh( player1Geo, player1Mat );
scene.add( player1 );
player1.position.z = -40;

function animate() {
	requestAnimationFrame( animate );
	const deltaT = clock.getDelta();
	controls.update(deltaT);
	if (followAt) {
		camera.lookAt(ball.sphere.position);
	}
	if (!freeze) {
		ball.update(deltaT);
	}
	renderer.render( scene, camera );
}
animate();

function addGuiOctopus(name, octopus) {
	const playerFolder = gui.addFolder(name);
	playerFolder.add(octopus, 'horizontalAngle', -90, 90);
	playerFolder.add(octopus, 'verticalAngle', -90, 90);
	playerFolder.add(octopus, 'force', 0, 200);
	playerFolder.add(octopus.spinAxis, 'x', -1, 1);
	playerFolder.add(octopus.spinAxis, 'y', -1, 1);
	playerFolder.add(octopus.spinAxis, 'z', -1, 1);
	playerFolder.add(octopus, 'spinStrength', 0, 200);
	return playerFolder;
}

addEventListener("keydown", (event) => {
	switch(event.key.toLowerCase()) {
		//Reset Round
		case(' '):
			freeze = !freeze;
			break;
		case('p'):
			ball.reset(new Vector3(initialPos.pos_x, initialPos.pos_y, initialPos.pos_z),
				 new Vector3(initialVel.vel_x, initialVel.vel_y, initialVel.vel_z));
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
			//player 1 pov
			camera.position.z = - (CONST.TABLE_L / 2) - 20;
			camera.position.x = 0;
			camera.position.y = 20;
			camera.lookAt(0, 0, 0);
			break;
		case('4'):
			//player 2 pov
			camera.position.z = (CONST.TABLE_L / 2) + 20;
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

