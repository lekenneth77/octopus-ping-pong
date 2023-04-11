import * as THREE from 'three';
import { Ball } from '/ball';
import { Vector3 } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let ball = new Ball();
scene.add( ball.getBall() );


//plane

const planeGeo = new THREE.PlaneGeometry( 39, 69 );
const planeMat = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeo, planeMat );
scene.add( plane );
plane.rotateX(Math.PI/2);

//camera position
camera.position.z = 50;
camera.position.x = 20;
camera.position.y = 42;
camera.lookAt(0, 0, 0);

function animate() {
	requestAnimationFrame( animate );
	ball.update();
	renderer.render( scene, camera );
}
animate();