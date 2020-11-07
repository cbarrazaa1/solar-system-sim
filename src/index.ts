import * as THREE from "three";
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Skybox from './Skybox';

// create clock
const clock = new THREE.Clock();

// create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  20,
  1000000,
);

// create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// add renderer into DOM
document.body.appendChild(renderer.domElement);

// create sphere
const sphereBuffer = new THREE.SphereBufferGeometry(300, 16, 8);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
const sphere = new THREE.Mesh(sphereBuffer, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

const sphere2Buffer = new THREE.SphereBufferGeometry(200, 16, 8);
const sphere2 = new THREE.Mesh(sphere2Buffer, sphereMaterial);
sphere2.position.set(0, 0, 1600);
scene.add(sphere2);

// setup skybox
scene.add(Skybox);


// setup camera controller
const cameraController = new OrbitControls(camera, renderer.domElement);

// setup camera
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.position.set(1200, -250, 2000);
camera.lookAt(scene.position);
cameraController.update();

function animate(): void {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);
  render();
  cameraController.update();
}

function render(): void {
  const delta = Date.now() * 0.0001;
  sphere.rotation.x += 0.01;
  sphere2.position.set(Math.cos(delta) * 1600, 0, Math.sin(delta) *1600);
  renderer.render(scene, camera);
}

animate();
