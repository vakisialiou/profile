import { TextureLoader, Texture } from 'three'

export default class LoadingTextures {
  constructor() {
    this.items = []

    /**
     *
     * @type {Object}
     */
    this.loadedItems = {}
  }

  /**
   *
   * @param {Array.<{name: string, path: string}>} items
   * @returns {LoadingTextures}
   */
  setItems(items) {
    this.items = items
    return this
  }

  /**
   *
   * @param {string} name
   * @param {string} path
   * @returns {LoadingTextures}
   */
  addItem(name, path) {
    this.items.push({ name, path })
    return this
  }

  /**
   *
   * @param {string} path
   * @returns {Promise<Texture>}
   */
  load(path) {
    return new Promise((resolve) => {
      new TextureLoader().load(path, resolve)
    })
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async presetTextures() {
    for (const item of this.items) {
      try {
        this.loadedItems[item.name] = await this.load(item.path)
      } catch (e) {
        throw new Error(`Can not load texture "${item.name}:${item.path}". Look at "LoadingTextures"`)
      }
    }
  }

  /**
   *
   * @param {string} name
   * @returns Texture
   */
  get(name) {
    const texture = this.loadedItems[name]
    if (!texture) {
      throw new Error(`Texture '${name}' does not exists`)
    }
    const newTexture = texture.clone()
    newTexture.needsUpdate = true
    return newTexture
  }
}