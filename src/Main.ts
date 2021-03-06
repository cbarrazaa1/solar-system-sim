import {
  AmbientLight,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Skybox from './Skybox';
import SolarSystemObjects from './SolarSystem';
import OvniObjects from './OvniSystem';
const StatManager = require('stats.js');

const SHOW_STATS = true;

// create scene
const scene = new Scene();
const camera = new PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  20,
  1000000,
);

// create renderer
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.domElement.style.cssText = 'position: absolute; top: 0px; left: 0px';
document.body.appendChild(renderer.domElement);

// init performance manager
const stats = new StatManager();
stats.showPanel(0);

if (SHOW_STATS) {
  document.body.appendChild(stats.dom);
}

// add solar system objects into scene
for (const obj of SolarSystemObjects) {
  scene.add(obj.group);

  if (obj.orbitLine != null) {
    scene.add(obj.orbitLine);
  }
}

for (const obj of OvniObjects) {
  scene.add(obj.group);

  if (obj.orbitLine != null) {
    scene.add(obj.orbitLine);
  }
}

// create sun light
const sunLight = new PointLight('white', 1);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 20;
sunLight.shadow.camera.far = 100000;
scene.add(sunLight);
const ambient = new AmbientLight('white', 0.09);
scene.add(ambient);

// setup skybox
scene.add(Skybox);

// setup camera controller
const cameraController = new OrbitControls(camera, renderer.domElement);

// setup camera
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.position.set(10000, 1000, 10000);
cameraController.update();

// handle planet selection
let selectedPlanet = 0;
document.addEventListener('keydown', function (e) {
  switch (e.key) {
    case '1':
      selectedPlanet = 0;
      break;
    case '2':
      selectedPlanet = 1;
      break;
    case '3':
      selectedPlanet = 2;
      break;
    case '4':
      selectedPlanet = 3;
      break;
    case '5':
      selectedPlanet = 4;
      break;
    case '6':
      selectedPlanet = 5;
      break;
    case '7':
      selectedPlanet = 6;
      break;
    case '8':
      selectedPlanet = 7;
      break;
    case '9':
      selectedPlanet = 8;
      break;
    case '0':
      selectedPlanet = 9;
      break;
  }
});

function animate(): void {
  stats.begin();
  render();
  cameraController.update();
  stats.end();
  requestAnimationFrame(animate);
}

function render(): void {
  const delta = Date.now() * 0.0001;
  for (const obj of SolarSystemObjects) {
    obj.update(delta);
  }
  for (const obj of OvniObjects) {
    obj.update(delta);
  }

  if(selectedPlanet < 10 ){
    // follow selected planet
    cameraController.target.set(
      SolarSystemObjects[selectedPlanet].x,
      SolarSystemObjects[selectedPlanet].y,
      SolarSystemObjects[selectedPlanet].z,
    );
  }
  else{
    cameraController.target.set(
      OvniObjects[selectedPlanet - 10].x,
      OvniObjects[selectedPlanet - 10].y,
      OvniObjects[selectedPlanet - 10].z,
    )
  }

  renderer.render(scene, camera);
}

animate();
