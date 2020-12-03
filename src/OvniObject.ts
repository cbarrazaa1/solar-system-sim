import {
    BoxBufferGeometry,
    DoubleSide,
    Geometry,
    Group,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PolyhedronBufferGeometry,
    RingGeometry,
    SphereBufferGeometry,
    Texture,
    TorusBufferGeometry,
    Vector3,
  } from 'three';
  import THREE = require('three');

export type OvniObjectOptions = {
    radius: number;
    distance: number;
    rotationSpeed: number;
    translationSpeed: number;
    quality: number;
    texture: Texture;
    texture2: Texture;
    showOrbit?: boolean;
    ignoreLight?: boolean;
    castShadow?: boolean;
    receiveShadow?: boolean;
    ringTexture?: Texture;
    ringSize?: number;
    axisAngle?: number;
    randomRotation?: boolean;
    orbitInclination?: number;
    retrogradeRotation?: boolean;
    isHalo: boolean;
  };

// Clase para ovnis
class OvniObject {
    private buffer: TorusBufferGeometry | SphereBufferGeometry;
    private mesh: Mesh;
    private distance: number;
    private rotationSpeed: number;
    private translationSpeed: number;
    private orbitInclination: number;
    private randomRotation: boolean;
    private retrogradeRotation: boolean;
    public orbitLine?: Line;
    public group: Group;
    private material: MeshBasicMaterial | MeshStandardMaterial;
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
        texture2,
        isHalo = false,
        showOrbit = true,
        ignoreLight = false,
        castShadow = false,
        receiveShadow = false,
        ringTexture = null,
        ringSize = 800,
        axisAngle = 0,
        randomRotation = false,
        orbitInclination = 0,
        retrogradeRotation = false,
    }: OvniObjectOptions) {
        if(isHalo){
            let tubeRadius =  30;  
            let radialSegments =  3000;  
            let tubularSegments = 1000;  
            this.buffer = new TorusBufferGeometry(
                radius, tubeRadius,
                radialSegments, tubularSegments);
            
            // setup material
            if (ignoreLight) {
                this.material = new MeshBasicMaterial({map: texture});
            } else {
                this.material = new MeshStandardMaterial({map: texture});
            }

            // setup mesh 1
            this.mesh = new Mesh(this.buffer , this.material );
            this.mesh.castShadow = castShadow;
            this.mesh.receiveShadow = receiveShadow;

             // setup group
             this.group = new Group();
             this.group.add(this.mesh);

            tubeRadius =  30;  
            radialSegments =  3000;  
            tubularSegments = 1000;  
            this.buffer = new TorusBufferGeometry(
                radius + 10, tubeRadius,
                radialSegments, tubularSegments);
            // setup material
            if (ignoreLight) {
                this.material = new MeshBasicMaterial({map: texture2});
            } else {
                this.material = new MeshStandardMaterial({map: texture2});
            }
            
            // setup mesh 2
            this.mesh = new Mesh(this.buffer , this.material);
            this.mesh.castShadow = castShadow;
            this.mesh.receiveShadow = receiveShadow;

            this.group.add(this.mesh);


        }else{
            this.buffer = new SphereBufferGeometry(radius, quality / 2,quality / 2);
            // setup mesh
            this.mesh = new Mesh(this.buffer , this.material );
            this.mesh.castShadow = castShadow;
            this.mesh.receiveShadow = receiveShadow;

            // setup material
            if (ignoreLight) {
                this.material = new MeshBasicMaterial({map: texture});
            } else {
                this.material = new MeshStandardMaterial({map: texture});
            }

            // setup group
            this.group = new Group();
            this.group.add(this.mesh);
        }
        
      // setup other props
        this.distance = distance;
        this.rotationSpeed = rotationSpeed;
        this.translationSpeed = translationSpeed / 500.0;
        this.randomRotation = randomRotation;
        this.orbitInclination = orbitInclination;
        this.retrogradeRotation = retrogradeRotation;
      // create orbit line
      if (showOrbit) {
        const lineBuffer = new Geometry();
        const lineMaterial = new LineBasicMaterial({color: 'blue'});
  
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
      
      // set axis
        this.group.rotation.x = axisAngle -= 1000;
    }
  
    public update(delta: number): void {
      const {group, translationSpeed, distance, orbitInclination} = this;
      // update position
      this.x = Math.cos(delta * translationSpeed) * distance;
      this.y = Math.cos(delta * translationSpeed) * orbitInclination * distance;
      this.z = Math.sin(delta * translationSpeed) * distance;
      group.position.set(this.x, this.y, this.z);

    //   // update y axis rotation
    //     if (this.retrogradeRotation) {
    //         group.rotation.x -= this.rotationSpeed;
    //     } else {
    //         group.rotation.x += this.rotationSpeed;
    //     }
    
        // update random rotation
        if (this.randomRotation) {
            group.rotation.x += this.rotationSpeed * Math.random();
            group.rotation.z += this.rotationSpeed * Math.random();
        }
    }
  }

  export default OvniObject;