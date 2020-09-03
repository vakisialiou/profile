import Node from './Node'

export default class Mesh extends Node {
  /**
   *
   * @param {Object} geometry
   * @param {Object} material
   */
  constructor(geometry, material) {
    super()

    /**
     *
     * @type {Object}
     */
    this.geometry = geometry

    /**
     *
     * @type {Object}
     */
    this.material = material
  }
}