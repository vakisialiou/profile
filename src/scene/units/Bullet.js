import { Mesh, MeshBasicMaterial, SphereGeometry, Raycaster, Vector3 } from 'three'
import Unit from './Unit'

const geometry = new SphereGeometry(0.6)
const material = new MeshBasicMaterial({ color: 0xFF0000 })

export default class Bullet extends Unit {
  /**
   *
   * @param {Vector3} position
   * @param {Vector3} direction
   */
  constructor(position, direction) {
    super({ model: new Mesh(geometry, material), animations: [] })

    /**
     *
     * @type {{damage: number, distance: number, speed: number}}
     */
    this.options = { distance: 600, speed: 40, damage: 60 }

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
     * @type {Vector3}
     */
    this.startPosition = new Vector3().copy(position)
    this.position.copy(position)

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
  }

  static EVENT_COLLISION = 'EVENT_COLLISION'
  static EVENT_DESTROY = 'DESTROY_EVENT'

  /**
   *
   * @param {Object3D[]} objects
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
   * @param {(Object|{ delta: number, collisionObjects: Array.<(Object3D|Mesh|Group)> })} options
   * @returns {Bullet}
   */
  update(options) {
    super.update(options)
    this.prevPosition.copy(this.position)
    this.position.addScaledVector(this.direction, this.options.speed * options.delta)

    if (Array.isArray(options.collisionObjects) && !this.status.collided) {
      const intersections = this.getIntersectionObjects(options.collisionObjects, true)
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