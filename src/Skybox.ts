import { BoxGeometry, Mesh, MeshBasicMaterial, BackSide } from "three";
import { tm } from "./TextureManager";

const sides = new Array(6).fill(null).map(
  () => new MeshBasicMaterial({ map: tm.get("milkyway_view"), side: BackSide })
);
console.log(sides);
const skyboxBuffer = new BoxGeometry(1000000, 1000000, 1000000);
const skybox = new Mesh(skyboxBuffer, sides);

export default skybox;
