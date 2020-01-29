import { Mesh, MeshBasicMaterial, SphereGeometry, Raycaster, Vector3, Object3D, EventDispatcher } from 'three'
import { Object3DPusher } from '../lib'

export default class Charge extends Mesh {
  /**
   *
   * @param {Bot} bot
   * @param {Vector3} position
   * @param {Vector3} direction
   */
  constructor(bot, position, direction) {
    super()
    this.position.copy(position)
    this.applyQuaternion(bot.quaternion)

    /**
     *
     * @type {Bot}
     */
    this.bot = bot

    /**
     *
     * @type {Vector3}
     */
    this.direction = new Vector3().copy(direction)

    /**
     *
     * @type {Vector3}
     */
    this.prevPosition = new Vector3().copy(position)

    /**
     *
     * @type {SphereGeometry}
     */
    this.geometry = new SphereGeometry(2)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: bot.team.color })

    /**
     *
     * @type {Object3DPusher}
     */
    this.object3DPusher = new Object3DPusher(this, 30)

    /**
     *
     * @type {Raycaster}
     */
    this.raycaster = new Raycaster()

    /**
     *
     * @type {EventDispatcher}
     */
    this.event = new EventDispatcher()
  }

  /**
   *
   * @type {string}
   */
  static COLLISION_EVENT = 'COLLISION_EVENT'

  /**
   * @typedef {Object} CollisionEventOptions
   * @param {string} type
   * @param {Object} intersections
   */

  /**
   * @param {Array.<Object>} intersections
   * @callback collisionEventCallback
   */

  /**
   *
   * @param collisionEventCallback
   * @returns {Charge}
   */
  collisionEvent(collisionEventCallback) {
    this.event.addEventListener(Charge.COLLISION_EVENT, collisionEventCallback)
    return this
  }

  /**
   *
   * @param {Object3D[]} objects
   * @param {boolean} [recursive]
   * @returns {Intersection[]}
   */
  getIntersectionObjects(objects, recursive = false) {
    if (this.prevPosition.equals(this.position)) {
      return []
    }
    this.raycaster.ray.origin.copy(this.prevPosition)
    this.raycaster.ray.direction.copy(this.direction)
    this.raycaster.near = 0
    this.raycaster.far = this.prevPosition.distanceTo(this.position)
    return this.raycaster.intersectObjects(objects, recursive)
  }

  /**
   *
   * @param {number} delta
   * @param {Array.<(ModelBase|ModelBot|ModelTower)>} objects
   * @returns {Charge}
   */
  update(delta, objects) {
    this.prevPosition.copy(this.position)
    this.object3DPusher.moveForward(delta)
    const intersections = this.getIntersectionObjects(objects)
    if (intersections.length > 0) {
      this.event.dispatchEvent({ type: Charge.COLLISION_EVENT, intersections })
    }
    return this
  }
}