import {  SpriteMaterial, Sprite } from 'three'

export default class Star extends Sprite {
  /**
   *
   * @param {Texture} texture
   */
  constructor(texture) {
    super()

    this.material = new SpriteMaterial({ map: texture, depthWrite: false })
  }

  /**
   *
   * @param {Vector3} v
   * @returns {Star}
   */
  setPosition(v) {
    this.position.copy(v)
    return this
  }

  /**
   *
   * @param {number} scale
   * @returns {Star}
   */
  setScale(scale) {
    this.scale.set(scale, scale, scale)
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {Star}
   */
  update(delta) {

    return this
  }
}