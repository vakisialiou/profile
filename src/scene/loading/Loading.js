import LoadingTextures from '@scene/loading/LoadingTextures'
import LoadingModels from '@scene/loading/LoadingModels'
import LoadingAudio from '@scene/loading/LoadingAudio'

export default class Loading {
  constructor() {
    this.loaders = {
      [Loading.TYPE_TEXTURE]: new LoadingTextures(),
      [Loading.TYPE_MODEL]: new LoadingModels(),
      [Loading.TYPE_AUDIO]: new LoadingAudio()
    }
  }

  static TYPE_TEXTURE = 'texture'
  static TYPE_MODEL = 'model'
  static TYPE_AUDIO = 'audio'

  /**
   *
   * @param {string} type
   * @param {string} name
   * @param {boolean} [value]
   * @returns {Loading}
   */
  enableItem(type, name, value = true) {
    const loader = this.loaders[type]
    if (!loader) {
      throw new Error('Unknown type loading.')
    }
    loader.enableItem(name, value)
    return this
  }

  /**
   *
   * @param {string} type
   * @param {Array.<{name: string, path: string, [enabled]: boolean}>} items
   * @returns {Loading}
   */
  setItems(type, items) {
    const loader = this.loaders[type]
    if (!loader) {
      throw new Error('Unknown type loading.')
    }
    loader.setItems(items)
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
    const loader = this.loaders[type]
    if (!loader) {
      throw new Error('Unknown type loading.')
    }
    loader.addItem(name, path, enabled)
    return this
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async preset() {
    for (const type in this.loaders) {
      if (!this.loaders.hasOwnProperty(type)) {
        continue
      }
      const loader = this.loaders[type]
      await loader.preset()
    }
  }

  /**
   *
   * @param {string} name
   * @returns {RawModel}
   */
  getRawModel(name) {
    const loader = this.loaders[Loading.TYPE_MODEL]
    return loader.getRawModel(name)
  }

  /**
   *
   * @param {string} name
   * @returns {Texture}
   */
  getTexture(name) {
    const loader = this.loaders[Loading.TYPE_TEXTURE]
    return loader.getTexture(name)
  }

  /**
   *
   * @param {string} name
   * @returns {AudioBuffer}
   */
  getAudioBuffer(name) {
    const loader = this.loaders[Loading.TYPE_AUDIO]
    return loader.getAudioBuffer(name)
  }
}