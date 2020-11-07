import {TextureLoader, BoxGeometry, Mesh, MeshBasicMaterial, BackSide} from 'three';

const loader = new TextureLoader();
const imgs = [
  loader.load('/textures/skybox/milkyway_view.jpg'),
  loader.load('/textures/skybox/milkyway_view.jpg'),
  loader.load('/textures/skybox/milkyway_view.jpg'),
  loader.load('/textures/skybox/milkyway_view.jpg'),
  loader.load('/textures/skybox/milkyway_view.jpg'),
  loader.load('/textures/skybox/milkyway_view.jpg'),
];
const sides = imgs.map(img => new MeshBasicMaterial({map: img, side: BackSide}));
const skyboxBuffer = new BoxGeometry(1000000, 1000000, 1000000);
const skybox = new Mesh(skyboxBuffer, sides);

export default skybox;
