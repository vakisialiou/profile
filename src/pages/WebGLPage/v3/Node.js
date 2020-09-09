import { v4 } from 'uuid'
import { mat4 } from 'gl-matrix'
import Vector3 from './Vector3'

export default class Node {
  constructor() {
    /**
     * @type {string}
     */
    this.uuid = v4()

    /**
     *
     * @type {string|?}
     */
    this.name = null

    /**
     *
     * @type {Node|?}
     */
    this.parent = null

    /**
     *
     * @type {boolean}
     */
    this.visible = true

    /**
     *
     * @type {Vector3}
     */
    this.position = new Vector3(0, 0, 0)

    /**
     *
     * @type {Vector3}
     */
    this.rotation = new Vector3(0, 0, 0)

    /**
     *
     * @type {Vector3}
     */
    this.scale = new Vector3(1, 1, 1)

    /**
     *
     * @type {Array.<Node>}
     */
    this.children = []

    this.localMatrix = mat4.create()
    this.worldMatrix = mat4.create()
  }

  /**
   *
   * @param {Boolean} value
   * @returns {Node}
   */
  hide(value) {
    this.visible = value
    return this
  }

  /**
   *
   * @param {Object|Vector3} v
   * @returns {Node}
   */
  setPosition(v) {
    this.position.copy(v)
    return this
  }

  /**
   *
   * @param {Object|Vector3} v
   * @returns {Node}
   */
  setRotation(v) {
    this.rotation.copy(v)
    return this
  }

  /**
   *
   * @param {Object|Vector3} v
   * @returns {Node}
   */
  setScale(v) {
    this.scale.copy(v)
    return this
  }

  /**
   *
   * @param {Node} node
   * @callback traverseCallback
   */

  /**
   *
   * @param {traverseCallback} callback
   * @returns {Node}
   */
  traverse(callback) {
    callback(this)
    for (const node of this.children) {
      node.traverse(callback)
    }
    return this
  }

  /**
   *
   * @param {Boolean} [updateChildren]
   * @returns {Node}
   */
  updateWorldMatrix(updateChildren = true) {
    if (this.parent) {
      this.worldMatrix = mat4.multiply(this.worldMatrix, this.parent.worldMatrix, this.localMatrix)
    } else {
      this.worldMatrix = mat4.clone(this.localMatrix)
    }

    if (updateChildren) {
      for (const children of this.children) {
        children.updateWorldMatrix(true, true)
      }
    }

    return this
  }

  /**
   *
   * @param {string} name
   * @returns {Node}
   */
  setName(name) {
    this.name = name
    return this
  }

  /**
   *
   * @param {Node} obj
   * @returns {Node}
   */
  add(obj) {
    if (obj.parent) {
      const index = obj.parent.children.indexOf(obj)
      if (index >= 0) {
        obj.parent.children.splice(index - 1)
      }
    }

    obj.parent = this
    this.children.push(obj)
    return this
  }
}