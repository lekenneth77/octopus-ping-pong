import * as THREE from 'three';
import { Ball } from '/ball';
import { Vector3 } from 'three';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

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
let cam_on = false;


let ball = new Ball();
scene.add( ball.getBall() );

//plane
const planeGeo = new THREE.PlaneGeometry( 39, 69 );
const planeMat = new THREE.MeshPhongMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeo, planeMat );
plane.receiveShadow = true;
scene.add( plane );
plane.rotateX(Math.PI/2);

//net
const netGeo = new THREE.PlaneGeometry( 39, 4 );
const netMat = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
const net = new THREE.Mesh( netGeo, netMat );
net.position.y = 2.5;
scene.add( net );

//floor
const floorGeo = new THREE.PlaneGeometry( 1000, 1000 );
const floorMat = new THREE.MeshPhongMaterial( {color: 0x765432, side: THREE.DoubleSide} );
const floor = new THREE.Mesh( floorGeo, floorMat );
// floor.receiveShadow = true;
scene.add( floor );
floor.position.y = -21;
floor.rotateX(Math.PI/2);

//add light
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 50, 0);
light.castShadow = true;
scene.add(light);
light.shadow.camera.left = -19.5;
light.shadow.camera.right = 19.5;
light.shadow.camera.bottom = -34.5;
light.shadow.camera.top = 34.5;

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

//camera position
camera.position.z = -30;
camera.position.x = 60;
camera.position.y = 20;
camera.lookAt(0, 0, 0);

function animate() {
	requestAnimationFrame( animate );
	const deltaT = clock.getDelta();
	ball.update(deltaT);
	if (cam_on) {
		controls.update(deltaT);
	}
	// camera.lookAt(ball.sphere.position);
	renderer.render( scene, camera );
}
animate();

addEventListener("keydown", (event) => {
	switch(event.key) {
		//Reset Round
		case('p'):
			ball.reset();
			break;
		//Turn Fly Camera On/Off
		case('o'):
			cam_on = !cam_on;
			break;
		default:
			break;
	}
});

