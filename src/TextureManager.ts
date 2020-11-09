import { Texture, TextureLoader } from "three";

const BASE_PATH = '/textures';

class TextureManager {
  private loader: TextureLoader;
  private textures: {[key: string]: Texture};

  constructor() {
    this.loader = new TextureLoader();
    this.textures = {};
  }

  public get(name: string): Texture {
    if (this.textures[name] == null) {
      this.textures[name] = this.loader.load(`${BASE_PATH}/${name}.jpg`);
    }

    return this.textures[name];
  }
}

export const tm = new TextureManager();