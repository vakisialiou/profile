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
   * @param {string} name
   * @param {boolean} [value]
   * @returns {LoadingTextures}
   */
  enableItem(name, value = true) {
    for (const item of this.items) {
      if (item.name === name) {
        item.enabled = value
        break
      }
    }
    return this
  }

  /**
   *
   * @param {Array.<{name: string, path: string, [enabled]: boolean}>} items
   * @returns {LoadingTextures}
   */
  setItems(items) {
    for (const item of items) {
      if (item.enabled === undefined) {
        item.enabled = true
      }
      this.addItem(item.name, item.path, item.enabled)
    }
    return this
  }

  /**
   *
   * @param {string} name
   * @param {string} path
   * @param {boolean} [enabled]
   * @returns {LoadingTextures}
   */
  addItem(name, path, enabled = true) {
    this.items.push({ name, path, enabled })
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
      if (!item.enabled) {
        continue
      }
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