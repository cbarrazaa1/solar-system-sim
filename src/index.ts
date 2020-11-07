import {
  AmbientLight,
  CameraHelper,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Skybox from "./Skybox";
import SpaceObject from "./SpaceObject";

// create scene
const scene = new Scene();
const camera = new PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  20,
  1000000
);

// create renderer
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

// add renderer into DOM
document.body.appendChild(renderer.domElement);

// load textures
const loader = new TextureLoader();
const sunTexture = loader.load("/textures/solar_surface.jpg");
const mercuryTexture = loader.load("/textures/mercury_surface.jpg");
const venusTexture = loader.load("/textures/venus_surface.jpg");
const earthTexture = loader.load("/textures/earth_surface.jpg");
const marsTexture = loader.load("/textures/mars_surface.jpg");
const jupiterTexture = loader.load("/textures/jupyter_surface.jpg");
const saturnTexture = loader.load("/textures/saturn_surface.jpg");
const uranusTexture = loader.load("/textures/uranus_surface.jpg");
const neptuneTexture = loader.load("/textures/neptune_surface.jpg");

// create objects
const spaceObjects: SpaceObject[] = [];
spaceObjects.push(
  new SpaceObject({
    radius: 2000.4,
    distance: 0,
    rotationSpeed: 0.001997,
    translationSpeed: 0,
    quality: 32,
    texture: sunTexture,
    ignoreLight: true,
  }),
  new SpaceObject({
    radius: 174.397,
    distance: 4000,
    rotationSpeed: 0.0013892,
    translationSpeed: 160.8,
    quality: 32,
    texture: mercuryTexture,
  }),
  new SpaceObject({
    radius: 210.518,
    distance: 6000,
    rotationSpeed: 0.001452,
    translationSpeed: 117.4,
    quality: 32,
    texture: venusTexture,
  }),
  new SpaceObject({
    radius: 213.71,
    distance: 9000,
    rotationSpeed: 0.001674,
    translationSpeed: 100,
    quality: 32,
    texture: earthTexture,
    castShadow: true,
    satellites: [
      new SpaceObject({
        radius: 45,
        distance: 400,
        rotationSpeed: 0.002,
        translationSpeed: 0.002 * 500,
        quality: 32,
        texture: mercuryTexture,
        castShadow: true,
      }),
    ],
  }),
  new SpaceObject({
    radius: 183.895,
    distance: 12000,
    rotationSpeed: 0.0012822,
    translationSpeed: 80.2,
    quality: 32,
    texture: marsTexture,
  }),
  new SpaceObject({
    radius: 1200.11,
    distance: 22899,
    rotationSpeed: 0.0045061,
    translationSpeed: 43.4,
    quality: 32,
    texture: jupiterTexture,
  }),
  new SpaceObject({
    radius: 1000.32,
    distance: 31000,
    rotationSpeed: 0.0035532,
    translationSpeed: 32.3,
    quality: 32,
    texture: saturnTexture,
  }),
  new SpaceObject({
    radius: 800.62,
    distance: 44000,
    rotationSpeed: 0.000932,
    translationSpeed: 22.8,
    quality: 32,
    texture: uranusTexture,
  }),
  new SpaceObject({
    radius: 650.22,
    distance: 66000,
    rotationSpeed: 0.000965,
    translationSpeed: 18.2,
    quality: 32,
    texture: neptuneTexture,
  })
);

for (const obj of spaceObjects) {
  scene.add(obj.group);
  scene.add(obj.orbitLine);
}

// create sun light
const sunLight = new PointLight("white", 1);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 20;
sunLight.shadow.camera.far = 10000;
scene.add(sunLight);
scene.add(new CameraHelper(sunLight.shadow.camera));
const ambient = new AmbientLight("white", 0.09);
scene.add(ambient);

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
  requestAnimationFrame(animate);
  render();
  cameraController.update();
}

function render(): void {
  const delta = Date.now() * 0.0001;
  for (const obj of spaceObjects) {
    obj.update(delta);
  }
  
  cameraController.target.set(spaceObjects[3].x, spaceObjects[3].y, spaceObjects[3].z);
  renderer.render(scene, camera);
}

animate();
