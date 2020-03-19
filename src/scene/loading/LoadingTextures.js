import LoadingItems from './LoadingItems'
import { TextureLoader } from 'three'

export default class LoadingTextures extends LoadingItems {
  constructor() {
    super(TextureLoader)
  }

  /**
   *
   * @param {string} name
   * @returns Texture
   */
  getTexture(name) {
    const texture = this.getItem(name)
    if (!texture) {
      throw new Error(`Texture '${name}' does not exists`)
    }
    const newTexture = texture.clone()
    newTexture.needsUpdate = true
    return newTexture
  }
}