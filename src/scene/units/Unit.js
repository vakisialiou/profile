import { Object3D, Vector3 } from 'three'
import UnitAnimation from './../animations/UnitAnimation'

export default class Unit extends Object3D {
  constructor(rawModel) {
    super()

    /**
     * @type {Mesh|Group}
     */
    this.model = rawModel.model

    if (this.model.hasOwnProperty('material')) {
      this.model.material.metalness = 0
    }

    this.add(this.model)

    /**
     *
     * @type {UnitAnimation}
     */
    this.animation = new UnitAnimation(rawModel)

    /**
     * Use method "setRigidBody" to create RigidBody
     *
     * @type {(RigidBody|null)}
     */
    this.rigidBody = null
  }

  /**
   *
   * @param {string} name
   * @returns {Object3D|undefined}
   */
  getObjectByName(name) {
    return this.model.getObjectByName(name) || super.getObjectByName(name)
  }

  /**
   *
   * @param {World} physicsWorld
   * @param {Vector3} size
   * @returns {Unit}
   */
  setRigidBody(physicsWorld, size) {
    if (this.rigidBody) {
      throw Error('Rigid body has already exists.')
    }

    const pos = this.position.toArray()
    const physicsOptions = { type: 'box', size, pos, move: true }
    this.rigidBody = physicsWorld.add(physicsOptions)
    return this
  }

  /**
   *
   * @param {number} size
   * @returns {Unit}
   */
  setScale(size) {
    this.scale.set(size, size, size)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {Unit}
   */
  setPosition(position) {
    this.position.copy(position)
    this.rigidBody ? this.rigidBody.position.copy(position) : null
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {Unit}
   */
  update(delta) {
    this.animation.update(delta)
    if (this.rigidBody) {
      this.position.copy(this.rigidBody.getPosition())
      this.quaternion.copy(this.rigidBody.getQuaternion())
    }
    return this
  }
}