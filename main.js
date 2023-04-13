import * as THREE from 'three';
import { Ball } from '/ball';
import { Vector3 } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let ball = new Ball();
scene.add( ball.getBall() );


//plane
const planeGeo = new THREE.PlaneGeometry( 39, 69 );
const planeMat = new THREE.MeshPhongMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeo, planeMat );
plane.receiveShadow = true;
scene.add( plane );
plane.rotateX(Math.PI/2);

//plane2
const netGeo = new THREE.PlaneGeometry( 39, 5 );
const netMat = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
const net = new THREE.Mesh( netGeo, netMat );
net.position.y = 2.5;
scene.add( net );
// net.rotateX(Math.PI/2);

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
camera.position.z = 50;
camera.position.x = 50;
camera.position.y = 42;
camera.lookAt(0, 0, 0);

function animate() {
	requestAnimationFrame( animate );
	ball.update();
	renderer.render( scene, camera );
}
animate();