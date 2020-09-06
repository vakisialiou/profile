import { SIDE_FRONT } from './constants'
import Color from './Color'

export default class MeshBaseMaterial {
  constructor() {
    this.color = new Color().setHex(0xffffff)
    this.wireframe = false
    this.side = SIDE_FRONT
    this.vertexColors = false
  }

  /**
   *
   * @param {Color|Object|string|number} value
   * @return {MeshBaseMaterial}
   */
  setColor(value) {
    this.color.set(value)
    return this
  }

  /**
   *
   * @param {boolean} [value]
   * @return {MeshBaseMaterial}
   */
  useWireframe(value = true) {
    this.wireframe = value
    return this
  }

  /**
   * User constants 'SIDE_FRONT'|'SIDE_BACK'|'SIDE_DOUBLE'
   *
   * @param {number} value
   * @return {MeshBaseMaterial}
   */
  useSide(value) {
    this.side = value
    return this
  }

  /**
   * Before use it you have to be ensure geometry has color faces
   *
   * @param {boolean} [value]
   * @return {MeshBaseMaterial}
   */
  useVertexColors(value = true) {
    this.vertexColors = value
    return this
  }
}