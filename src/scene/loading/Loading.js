import LoadingTextures from '@scene/loading/LoadingTextures'
import LoadingModels from '@scene/loading/LoadingModels'

export default class Loading {
  constructor() {
    /**
     *
     * @type {LoadingTextures}
     */
    this.loadingTextures = new LoadingTextures()

    /**
     *
     * @type {LoadingModels}
     */
    this.loadingModels = new LoadingModels()
  }

  static TYPE_TEXTURE = 'texture'
  static TYPE_MODEL = 'model'

  /**
   *
   * @param {string} type
   * @param {string} name
   * @param {boolean} [value]
   * @returns {Loading}
   */
  enableItem(type, name, value = true) {
    switch (type) {
      case Loading.TYPE_TEXTURE:
        this.loadingTextures.enableItem(name, value)
        break
      case Loading.TYPE_MODEL:
        this.loadingModels.enableItem(name, value)
    }
    return this
  }

  /**
   *
   * @param {string} type
   * @param {Array.<{name: string, path: string, [enabled]: boolean}>} items
   * @returns {Loading}
   */
  setItems(type, items) {
    switch (type) {
      case Loading.TYPE_TEXTURE:
        this.loadingTextures.setItems(items)
        break
      case Loading.TYPE_MODEL:
        this.loadingModels.setItems(items)
    }
    return this
  }

  /**
   *
   * @param {string} type
   * @param {string} name
   * @param {string} path
   * @param {boolean} [enabled]
   * @returns {Loading}
   */
  addItem(type, name, path, enabled = true) {
    switch (type) {
      case Loading.TYPE_TEXTURE:
        this.loadingTextures.addItem(name, path, enabled)
        break
      case Loading.TYPE_MODEL:
        this.loadingModels.addItem(name, path, enabled)
    }
    return this
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async preset() {
    await this.loadingTextures.presetTextures()
    await this.loadingModels.presetModels()
  }

  /**
   *
   * @param {string} name
   * @returns {RawModel}
   */
  getRawModel(name) {
    return this.loadingModels.getRawModel(name)
  }

  /**
   *
   * @param {string} name
   * @returns {Texture}
   */
  getTexture(name) {
    return this.loadingTextures.get(name)
  }
}