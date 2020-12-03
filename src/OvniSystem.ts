import * as ovniJson from '../data/ovniObjects.json';;
import OvniObject from './OvniObject';
import {tm} from './TextureManager';
import {getRandom} from './Util';

const ovniData = ovniJson as any;
const OvniObjects: OvniObject[] = [];


function createOvniObject(data: any): OvniObject {
  data.texture = tm.get(data.texture);
  data.texture2 = tm.get(data.texture2);
  return new OvniObject(data)
}

for (const name in ovniData) {
  OvniObjects.push(createOvniObject(ovniData[name]));
}

export default OvniObjects;
