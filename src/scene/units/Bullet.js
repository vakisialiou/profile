import { Mesh, MeshBasicMaterial, SphereGeometry, Raycaster, Vector3 } from 'three'
import Unit from './Unit'

const geometry = new SphereGeometry(0.2)
const material = new MeshBasicMaterial({ color: 0x666666, opacity: 0.4, transparent: true })

export default class Bullet extends Unit {
  /**
   *
   */
  constructor() {
    super({ model: new Mesh(geometry, material), animations: [] })

    /**
     *
     * @type {{damage: number, distance: number, speed: number}}
     */
    this.options = { distance: 1200, speed: 800, damage: 60 }

    /**
     *
     * @type {Vector3}
     */
    this.direction = new Vector3()

    /**
     *
     * @type {Vector3}
     */
    this.prevPosition = new Vector3()

    /**
     *
     * @type {Vector3}
     */
    this.startPosition = new Vector3()

    /**
     *
     * @type {Raycaster}
     */
    this.raycaster = new Raycaster()

    /**
     *
     * @type {{collided: boolean, destroyed: boolean}}
     */
    this.status = { collided: false, destroyed: false }

    /**
     *
     * @type {(Node|Mesh|Group)[]}
     */
    this.collisionObjects = []
  }

  /**
   *
   * @param {Vector3} direction
   * @returns {Bullet}
   */
  setDirection(direction) {
    this.direction.copy(direction)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {Bullet}
   */
  setPosition(position) {
    this.prevPosition.copy(position)
    this.startPosition.copy(position)
    super.setPosition(position)
    return this
  }

  /**
   *
   * @param {(Node|Mesh|Group)[]} objects
   * @returns {Bullet}
   */
  setCollisionObjects(objects) {
    this.collisionObjects = objects
    return this
  }

  static EVENT_COLLISION = 'EVENT_COLLISION'
  static EVENT_DESTROY = 'DESTROY_EVENT'

  /**
   *
   * @param {Node[]} objects
   * @param {boolean} [recursive]
   * @returns {Intersection[]}
   */
  getIntersectionObjects(objects, recursive = false) {
    if (this.prevPosition.equals(this.position) || objects.length === 0) {
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
   * @returns {Bullet}
   */
  update(delta) {
    super.update(delta)
    this.prevPosition.copy(this.position)
    this.position.addScaledVector(this.direction, this.options.speed * delta)

    if (Array.isArray(this.collisionObjects) && !this.status.collided) {
      const intersections = this.getIntersectionObjects(this.collisionObjects, true)
      if (intersections.length > 0) {
        this.status.collided = true
        this.dispatchEvent({type: Bullet.EVENT_COLLISION, intersections})
        return this
      }
    }

    if (!this.status.destroyed) {
      if (this.position.y < 0 || this.startPosition.distanceTo(this.position) >= this.options.distance) {
        this.status.destroyed = true
        this.dispatchEvent({type: Bullet.EVENT_DESTROY})
      }
    }
    return this
  }
}