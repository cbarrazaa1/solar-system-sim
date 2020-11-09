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
  SphereBufferGeometry,
  Texture,
  Vector3,
} from 'three';

export type SpaceObjectOptions = {
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
  randomRotation?: boolean;
  orbitInclination?: number;
};

class SpaceObject {
  private buffer: SphereBufferGeometry;
  private material: MeshBasicMaterial | MeshStandardMaterial;
  private mesh: Mesh;
  private satellites: SpaceObject[];
  private distance: number;
  private rotationSpeed: number;
  private translationSpeed: number;
  private randomRotation: boolean;
  private orbitInclination: number;
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
    randomRotation = false,
    orbitInclination = 0,
  }: SpaceObjectOptions) {
    this.buffer = new SphereBufferGeometry(radius, quality / 2, quality / 2);

    // setup material
    if (ignoreLight) {
      this.material = new MeshBasicMaterial({map: texture});
    } else {
      this.material = new MeshStandardMaterial({map: texture});
    }

    // setup mesh
    this.mesh = new Mesh(this.buffer, this.material);
    this.mesh.castShadow = castShadow;
    this.mesh.receiveShadow = receiveShadow;

    // setup group
    this.group = new Group();
    this.group.add(this.mesh);
    this.satellites = satellites;
    for (const satellite of this.satellites) {
      this.group.add(satellite.group);
    }

    // setup other props
    this.distance = distance;
    this.rotationSpeed = rotationSpeed;
    this.translationSpeed = translationSpeed / 500.0;
    this.randomRotation = randomRotation;
    this.orbitInclination = orbitInclination;

    // create orbit line
    if (showOrbit) {
      const lineBuffer = new Geometry();
      const lineMaterial = new LineBasicMaterial({color: 'gray'});

      for (let i = 0; i <= 128; i++) {
        const theta = (i / 128) * Math.PI * 2;
        lineBuffer.vertices.push(
          new Vector3(
            Math.cos(theta) * distance,
            Math.cos(theta) * orbitInclination * distance,
            Math.sin(theta) * distance,
          ),
        );
      }

      this.orbitLine = new Line(lineBuffer, lineMaterial);
    }

    // create rings
    if (ringTexture != null) {
      const ringBuffer = new RingGeometry(radius + 160, radius + ringSize, 128);
      const ringMaterial = new MeshStandardMaterial({
        map: ringTexture,
        side: DoubleSide,
      });
      const ringMesh = new Mesh(ringBuffer, ringMaterial);
      ringMesh.rotation.x = 1.5708;
      this.group.add(ringMesh);
    }

    // set axis
    this.group.rotation.x = axisAngle;
  }

  public update(delta: number): void {
    const {group, translationSpeed, distance, orbitInclination} = this;

    // update position
    this.x = Math.cos(delta * translationSpeed) * distance;
    this.y = Math.cos(delta * translationSpeed) * orbitInclination * distance;
    this.z = Math.sin(delta * translationSpeed) * distance;
    group.position.set(this.x, this.y, this.z);

    // update y axis rotation
    group.rotation.y += this.rotationSpeed;

    // update random rotation
    if (this.randomRotation) {
      group.rotation.x += this.rotationSpeed * Math.random();
      group.rotation.z += this.rotationSpeed * Math.random();
    }

    // update satellites
    for (const satellite of this.satellites) {
      satellite.update(delta);
    }
  }
}

export default SpaceObject;
