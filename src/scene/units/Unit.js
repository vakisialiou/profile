import { Object3D, EventDispatcher, Euler, Group, Mesh, Box3, Box3Helper, Vector3 } from 'three'

export default class Unit extends Object3D {
  constructor(rawModel) {
    super()

    /**
     * @type {Mesh|Group}
     */
    this.model = rawModel.model
    this.model.material.metalness = 0
    this.add(this.model)

    /**
     * Use method "setRigidBody" to create RigidBody
     *
     * @type {(RigidBody|null)}
     */
    this.rigidBody = null

    /**
     *
     * @type {Box3}
     */
    this.box = new Box3()

    /**
     *
     * @type {Box3Helper}
     */
    this.rigitBodyHelper = new Box3Helper(this.box)
  }

  /**
   *
   * @param {World} physicsWorld
   * @returns {Unit}
   */
  setRigidBody(physicsWorld) {
    if (this.rigidBody) {
      throw Error('Rigid body has already exists.')
    }
    this.box.setFromObject(this.model)
    const pos = this.position.toArray()
    const size = this.box.getSize(new Vector3()).toArray()
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
   * @returns {Unit}
   */
  showRigidBodyHelper() {
    this.add(this.rigitBodyHelper)
    return this
  }

  /**
   *
   * @returns {Unit}
   */
  update() {
    if (this.rigidBody) {
      this.position.copy(this.rigidBody.getPosition())
      this.quaternion.copy(this.rigidBody.getQuaternion())
    }
    return this
  }
}