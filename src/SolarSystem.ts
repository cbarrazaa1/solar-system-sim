import * as json from '../data/spaceObjects.json';
import SpaceObject from './SpaceObject';
import {tm} from './TextureManager';
import {getRandom} from './Util';

const NUM_ASTEROIDS = 1000;
const data = json as any;
const SolarSystemObjects: SpaceObject[] = [];

function createSpaceObject(data: any): SpaceObject {
  data.texture = tm.get(data.texture);

  // create ring texture if present
  if (data.ringTexture) {
    data.ringTexture = tm.get(data.ringTexture);
  }

  // create satellites if present
  if (data.satellites) {
    data.satellites = data.satellites.map((satellite) =>
      createSpaceObject(satellite),
    );
  }

  return new SpaceObject(data);
}

// add sun, planets and satellites
for (const name in data) {
  SolarSystemObjects.push(createSpaceObject(data[name]));
}

// add asteroid belt
for (let i = 0; i < NUM_ASTEROIDS; i++) {
  SolarSystemObjects.push(
    new SpaceObject({
      radius: getRandom(20, 120),
      distance: getRandom(16000, 16500) + getRandom(0, 5000),
      rotationSpeed: getRandom(0.001, 0.01),
      translationSpeed: getRandom(3, 100),
      quality: Math.floor(getRandom(4, 10)),
      texture: tm.get('moon_surface'),
      showOrbit: false,
      randomRotation: true,
    }),
  );
}

// add kuiper belt
for (let i = 0; i < NUM_ASTEROIDS; i++) {
  SolarSystemObjects.push(
    new SpaceObject({
      radius: getRandom(60, 180),
      distance: getRandom(77000, 78500) + getRandom(0, 10000),
      rotationSpeed: getRandom(0.001, 0.01),
      translationSpeed: getRandom(3, 100),
      quality: Math.floor(getRandom(4, 10)),
      texture: tm.get('moon_surface'),
      showOrbit: false,
      randomRotation: true,
    }),
  );
}

export default SolarSystemObjects;
