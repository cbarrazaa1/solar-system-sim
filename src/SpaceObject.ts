import {
  Geometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Shape,
  SphereBufferGeometry,
  Texture,
  Vector3,
} from "three";

type SpaceObjectOptions = {
  radius: number;
  distance: number;
  rotationSpeed: number;
  translationSpeed: number;
  quality: number;
  texture: Texture;
  satellites?: SpaceObject[];
  showOrbit?: boolean;
  ignoreLight?: boolean;
  castShadow?: boolean;
};

class SpaceObject {
  private buffer: SphereBufferGeometry;
  private material: MeshBasicMaterial | MeshStandardMaterial;
  private mesh: Mesh;
  private satellites: SpaceObject[];
  private distance: number;
  private rotationSpeed: number;
  private translationSpeed: number;
  public orbitLine?: Line;
  public group: Group;
  public x: number;
  public y: number;
  public z: number;

  constructor({
    radius,
    distance,
    rotationSpeed,
    translationSpeed,
    quality,
    texture,
    satellites = [],
    showOrbit = true,
    ignoreLight = false,
    castShadow = false,
  }: SpaceObjectOptions) {
    this.buffer = new SphereBufferGeometry(radius, quality, quality / 2);

    if (ignoreLight) {
      this.material = new MeshBasicMaterial({ map: texture });
    } else {
      this.material = new MeshStandardMaterial({ map: texture });
    }

    this.mesh = new Mesh(this.buffer, this.material);
    if (castShadow) {
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
    } else {
      this.mesh.castShadow = false;
      this.mesh.receiveShadow = false;
    }

    this.satellites = satellites;
    this.group = new Group();
    this.group.add(this.mesh);
    for (const satellite of this.satellites) {
      this.group.add(satellite.group);
    }
    this.distance = distance;
    this.rotationSpeed = rotationSpeed;
    this.translationSpeed = translationSpeed / 500.0;

    // create orbit line
    if (showOrbit) {
      const lineBuffer = new Geometry();
      const lineMaterial = new LineBasicMaterial({ color: 0xffffff });

      for (let i = 0; i <= 128; i++) {
        const theta = (i / 128) * Math.PI * 2;
        lineBuffer.vertices.push(
          new Vector3(Math.cos(theta) * distance, 0, Math.sin(theta) * distance)
        );
      }

      this.orbitLine = new Line(lineBuffer, lineMaterial);
    }
  }

  public addSatellite(satellite: SpaceObject) {
    this.satellites.push(satellite);
    this.group.add(satellite.group);
  }

  public update(delta: number): void {
    const { group, translationSpeed, distance } = this;
    this.x = Math.cos(delta * translationSpeed) * distance;
    this.y = 0;
    this.z = Math.sin(delta * translationSpeed) * distance;

    group.position.set(this.x, this.y, this.z);

    group.rotation.y += this.rotationSpeed;

    for (const satellite of this.satellites) {
      satellite.update(delta);
    }
  }
}

export default SpaceObject;
