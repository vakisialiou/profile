import Node from './Node'
import MeshBaseMaterial from './MeshBaseMaterial'
import BufferGeometry from './BufferGeometry'

export default class Mesh extends Node {
  /**
   *
   * @param {Object|Geometry|BufferGeometry} [geometry]
   * @param {Object|MeshBaseMaterial} [material]
   */
  constructor(geometry = null, material = null) {
    super()

    /**
     *
     * @type {Object}
     */
    this.geometry = geometry || new BufferGeometry()

    /**
     *
     * @type {Object}
     */
    this.material = material || new MeshBaseMaterial()
  }
}