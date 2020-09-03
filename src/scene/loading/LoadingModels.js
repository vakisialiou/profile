import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import objectPath from 'object-path'
import { cloneGltf } from './clone-gltf'
import LoadingItems from './LoadingItems'

export default class LoadingModels extends LoadingItems {
  constructor() {
    super(GLTFLoader)
  }

  /**
   * @typedef {Object} RawModel
   * @property {(Node|Group|Mesh)} model
   * @property {Array.<AnimationClip>} animations
   */

  /**
   *
   * @param {string} name
   * @param {Number} [index]
   * @returns {RawModel}
   */
  getRawModel(name, index = 0) {
    const item = this.getItem(name)
    const gltf = cloneGltf(item)
    const obj = objectPath.get(gltf, ['scene', 'children', index], null)
    const animations = objectPath.get(gltf, ['animations'], [])
    if (!obj) {
      throw new Error(`Model '${name}' does not exists`)
    }
    return { model: obj, animations: animations }
  }
}