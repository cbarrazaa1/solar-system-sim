import * as THREE from "three";
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';
import Skybox from './Skybox';

// create clock
const clock = new THREE.Clock();

// create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  45,
  30000,
);

// create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// add renderer into DOM
document.body.appendChild(renderer.domElement);

// create sphere
const sphereBuffer = new THREE.SphereBufferGeometry(0.5, 16, 8);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
const sphere = new THREE.Mesh(sphereBuffer, sphereMaterial);
scene.add(sphere);

// setup skybox
scene.add(Skybox);

// setup camera
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.position.set(1200, -250, 2000);
camera.lookAt(scene.position);

// setup camera controller
const cameraController = new FirstPersonControls(camera, renderer.domElement);
cameraController.lookSpeed = 0.25;
cameraController.movementSpeed = 200;

function animate(): void {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);
  render();
  cameraController.update(delta);
}

function render(): void {
  sphere.rotation.x += 0.01;
  renderer.render(scene, camera);
}

animate();
