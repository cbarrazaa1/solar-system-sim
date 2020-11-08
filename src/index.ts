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
const europaTexture = loader.load("/textures/europa_surface.jpg");
const ganymedeTexture = loader.load("/textures/ganymede_surface.jpg");
const callistoTexture = loader.load("/textures/callisto_surface.jpg");
const ioTexture = loader.load("/textures/io_surface.jpg");
const saturnTexture = loader.load("/textures/saturn_surface.jpg");
const saturnRingsTexture = loader.load("/textures/saturn_rings.png");
const uranusTexture = loader.load("/textures/uranus_surface.jpg");
const uranusRingsTexture = loader.load("/textures/test.jpg");
const neptuneTexture = loader.load("/textures/neptune_surface.jpg");
const moonTexture = loader.load("/textures/moon_surface.jpg");
const deimosTexture = loader.load("/textures/deimos_surface.png");
const phobosTexture = loader.load("/textures/phobos_surface.png");
const plutoTexture = loader.load('/textures/pluto_surface.jpg');

// create objects
const spaceObjects: SpaceObject[] = [];
spaceObjects.push(
  new SpaceObject({
    radius: 2500.4,
    distance: 0,
    rotationSpeed: 0.001997,
    translationSpeed: 0,
    quality: 32,
    texture: sunTexture,
    ignoreLight: true,
  }),
  new SpaceObject({
    radius: 174.397,
    distance: 4500,
    rotationSpeed: 0.0013892,
    translationSpeed: 160.8,
    quality: 32,
    texture: mercuryTexture,
  }),
  new SpaceObject({
    radius: 210.518,
    distance: 6500,
    rotationSpeed: 0.001452,
    translationSpeed: 117.4,
    quality: 32,
    texture: venusTexture,
  }),
  new SpaceObject({
    radius: 213.71,
    distance: 9500,
    rotationSpeed: 0.001674,
    translationSpeed: 100,
    quality: 32,
    texture: earthTexture,
    castShadow: true,
    receiveShadow: true,
    satellites: [
      new SpaceObject({
        radius: 15,
        distance: 400,
        rotationSpeed: 0.002,
        translationSpeed: 0.002 * 500,
        quality: 32,
        texture: moonTexture,
        castShadow: true,
        receiveShadow: true,
      }),
    ],
  }),
  new SpaceObject({
    radius: 183.895,
    distance: 12500,
    rotationSpeed: 0.0012822,
    translationSpeed: 80.2,
    quality: 32,
    texture: marsTexture,
    castShadow: true,
    satellites: [
      new SpaceObject({
        radius: 15,
        distance: 400,
        rotationSpeed: 0.002,
        translationSpeed: 0.001 * 500,
        quality: 12,
        texture: deimosTexture,
        castShadow: true,
      }),
      new SpaceObject({
        radius: 21,
        distance: 320,
        rotationSpeed: 0.002,
        translationSpeed: 0.006 * 500,
        quality: 8,
        texture: phobosTexture,
        castShadow: true,
      }),
    ],
  }),
  new SpaceObject({
    radius: 1300.11,
    distance: 27399,
    rotationSpeed: 0.0025061,
    translationSpeed: 43.4,
    quality: 32,
    castShadow: true,
    texture: jupiterTexture,
    satellites: [
      new SpaceObject({
        radius: 25,
        distance: 1900,
        rotationSpeed: 0.002,
        translationSpeed: 10,
        quality: 20,
        texture: europaTexture,
        castShadow: true,
        receiveShadow: true,
      }),
      new SpaceObject({
        radius: 45,
        distance: 1600,
        rotationSpeed: 0.002,
        translationSpeed: 20,
        quality: 20,
        texture: ioTexture,
        castShadow: true,
        receiveShadow: true,
      }),
      new SpaceObject({
        radius: 80,
        distance: 2550,
        rotationSpeed: 0.002,
        translationSpeed: 40,
        quality: 20,
        texture: callistoTexture,
        castShadow: true,
        receiveShadow: true,
      }),
      new SpaceObject({
        radius: 130,
        distance: 2230,
        rotationSpeed: 0.002,
        translationSpeed: 60,
        quality: 20,
        texture: ganymedeTexture,
        castShadow: true,
        receiveShadow: true,
      }),
    ],
  }),
  new SpaceObject({
    radius: 1000.32,
    distance: 35500,
    rotationSpeed: 0.0035532,
    translationSpeed: 32.3,
    quality: 32,
    texture: saturnTexture,
    ringTexture: saturnRingsTexture,
    axisAngle: -0.46652651,
  }),
  new SpaceObject({
    radius: 800.62,
    distance: 48500,
    rotationSpeed: 0.000932,
    translationSpeed: 22.8,
    quality: 32,
    texture: uranusTexture,
    ringTexture: uranusRingsTexture,
    ringSize: 320,
    axisAngle: 1.69297,
  }),
  new SpaceObject({
    radius: 650.22,
    distance: 70500,
    rotationSpeed: 0.000965,
    translationSpeed: 18.2,
    quality: 32,
    texture: neptuneTexture,
  }),
  new SpaceObject({
    radius: 110,
    distance: 90000,
    rotationSpeed: 0.0001234,
    translationSpeed: 20,
    quality: 32,
    texture: plutoTexture,
    orbitInclination: 0.125,
  })
);

// asteroids
function getRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < 2500; i++) {
  const asteroid = new SpaceObject({
    radius: getRandom(20, 120),
    distance: getRandom(16000, 16500) + getRandom(0, 4500),
    rotationSpeed: getRandom(0.001, 0.01),
    translationSpeed: getRandom(3, 100),
    quality: Math.floor(getRandom(4, 10)),
    texture: moonTexture,
    showOrbit: false,
    randomRotation: true,
  });

  spaceObjects.push(asteroid);
}

for (const obj of spaceObjects) {
  scene.add(obj.group);

  if (obj.orbitLine != null) {
    scene.add(obj.orbitLine);
  }
}

// create sun light
const sunLight = new PointLight("white", 1);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 20;
sunLight.shadow.camera.far = 1000005;
scene.add(sunLight);
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
camera.position.set(10000, 1000, 10000);
cameraController.update();

let i = 0;
document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "1":
      i = 0;
      break;
    case "2":
      i = 1;
      break;
    case "3":
      i = 2;
      break;
    case "4":
      i = 3;
      break;
    case "5":
      i = 4;
      break;
    case "6":
      i = 5;
      break;
    case "7":
      i = 6;
      break;
    case "8":
      i = 7;
      break;
    case "9":
      i = 8;
      break;
    case "0":
      i = 9;
      break;
  }
});

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

  cameraController.target.set(
    spaceObjects[i].x,
    spaceObjects[i].y,
    spaceObjects[i].z
  );

  renderer.render(scene, camera);
}

animate();
