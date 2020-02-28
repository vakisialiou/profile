import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import objectPath from 'object-path'
import { cloneGltf } from './clone-gltf'

export default class LoadingModels {
  constructor() {

    /**
     *
     * @type {Array}
     */
    this.items = [
      {
        name: LoadingModels.MODEL_BOT,
        path: '/models/bot/bot.glb',
        enabled: false,
      },
      {
        name: LoadingModels.MODEL_BASE,
        path: '/models/base/base.glb',
        enabled: false,
      },
      {
        name: LoadingModels.MODEL_TOWER,
        path: '/models/tower/tower.glb',
        enabled: false,
      },
      {
        name: LoadingModels.MODEL_GROUND,
        path: '/models/ground/ground.glb',
        enabled: false,
      },
    ]

    /**
     *
     * @type {Object}
     */
    this.loadedItems = {}

    /**
     *
     * @type {GLTFLoader}
     */
    this.loader = new GLTFLoader()
  }

  /**
   *
   * @type {string}
   */
  static MODEL_BOT = 'bot'

  /**
   *
   * @type {string}
   */
  static MODEL_BASE = 'base'

  /**
   *
   * @type {string}
   */
  static MODEL_TOWER = 'tower'

  /**
   *
   * @type {string}
   */
  static MODEL_GROUND = 'ground'

  /**
   *
   * @param {string} name
   * @param {boolean} [value]
   * @returns {LoadingModels}
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
   * @param {Array.<{name: string, path: string}>} items
   * @returns {LoadingModels}
   */
  setItems(items) {
    this.items = items
    return this
  }

  /**
   *
   * @param {string} name
   * @param {string} path
   * @returns {LoadingModels}
   */
  addItem(name, path) {
    this.items.push({ name, path })
    return this
  }

  /**
   *
   * @returns {Promise<Object>}
   */
  async load(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(path, resolve, null, reject)
    })
  }

  /**
   *
   * @returns {Promise<Object>}
   */
  async presetModels() {
    for (const item of this.items) {
      if (!item.enabled) {
        continue
      }
      try {
        this.loadedItems[item.name] = await this.load(item.path)
      } catch (e) {
        throw new Error(`Can not load model "${item.name}:${item.path}". Look at "LoadingModels"`)
      }
    }
    return this.loadedItems
  }

  /**
   * @typedef {Object} RawModel
   * @property {(Object3D|Group|Mesh)} model
   * @property {Array.<AnimationClip>} animations
   */

  /**
   *
   * @param {string} name
   * @returns {GLTF}
   */
  getRawModel(name) {
    const gltf = cloneGltf(this.loadedItems[name])
    const obj = objectPath.get(gltf, ['scene', 'children', 0], null)
    const animations = objectPath.get(gltf, ['animations'], [])
    if (!obj) {
      throw new Error(`Model '${name}' does not exists`)
    }
    return { model: obj, animations: animations }
  }
}