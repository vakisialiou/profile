import { v4 } from 'uuid'
import { mat4 } from 'gl-matrix'

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

    this.position = [0, 0, 0]
    this.rotation = [0, 0, 0]
    this.scale = [1, 1, 1]

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

  setPosition(v) {
    this.position = v
    return this
  }

  setRotation(v) {
    this.rotation = v
    return this
  }

  setScale(v) {
    this.scale = v
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