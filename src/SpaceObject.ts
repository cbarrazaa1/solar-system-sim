import {
  DoubleSide,
  Geometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  RingGeometry,
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
  receiveShadow?: boolean;
  ringTexture?: Texture;
  ringSize?: number;
  axisAngle?: number;
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
    receiveShadow = false,
    ringTexture = null,
    ringSize = 800,
    axisAngle = 0,
  }: SpaceObjectOptions) {
    this.buffer = new SphereBufferGeometry(radius, quality, quality / 2);

    if (ignoreLight) {
      this.material = new MeshBasicMaterial({ map: texture });
    } else {
      this.material = new MeshStandardMaterial({ map: texture });
    }

    this.mesh = new Mesh(this.buffer, this.material);
    this.mesh.castShadow = castShadow;
    this.mesh.receiveShadow = receiveShadow;

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

    // rings
    if (ringTexture != null) {
      const ringBuffer = new RingGeometry(radius + 160, radius + ringSize, 128);
      const ringMaterial = new MeshStandardMaterial({map: ringTexture, side: DoubleSide});
      const ringMesh = new Mesh(ringBuffer, ringMaterial);
      ringMesh.rotation.x = 1.5708;
      this.group.add(ringMesh);
    }

    // axis
    this.group.rotation.x = axisAngle;
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
