import {BackSide, BoxGeometry, Mesh, MeshBasicMaterial} from 'three';
import {tm} from './TextureManager';

const sides = new Array(6)
  .fill(null)
  .map(
    () => new MeshBasicMaterial({map: tm.get('milkyway_view'), side: BackSide}),
  );
const skyboxBuffer = new BoxGeometry(1000000, 1000000, 1000000);
const skybox = new Mesh(skyboxBuffer, sides);

export default skybox;
