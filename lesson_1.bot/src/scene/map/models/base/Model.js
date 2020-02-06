import { Mesh, EventDispatcher } from 'three'
import { Object3DDirection } from '../../../lib'

class Model extends Mesh {
  /**
   *
   * @param {Team} team
   * @param {(ModelOptions|ModelOptionsBase|ModelOptionsBot|ModelOptionsCharge|ModelOptionsTower|ModelOptionsGround)} options
   */
  constructor(team, options) {
    super()

    /**
     *
     * @type {Team}
     */
    this.team = team

    /**
     *
     * @type {(ModelOptions|ModelOptionsBase|ModelOptionsBot|ModelOptionsCharge|ModelOptionsTower|ModelOptionsGround)}
     */
    this.options = options

    /**
     *
     * @type {Object3DDirection}
     */
    this.object3DDirection = new Object3DDirection(this)

    /**
     *
     * @type {EventDispatcher}
     */
    this.event = new EventDispatcher()

    /**
     *
     * @type {boolean}
     */
    this.destroyed = false
  }

  /**
   *
   * @param {Vector3} value
   * @return {Model}
   */
  setPosition(value) {
    this.position.copy(value)
    return this
  }

  /**
   *
   * @type {string}
   */
  static DESTROY_EVENT = 'DESTROY_EVENT'

  /**
   * @param {Object} options
   * @callback destroyEventCallback
   */

  /**
   *
   * @param destroyEventCallback
   * @returns {Model}
   */
  destroyEvent(destroyEventCallback) {
    this.event.addEventListener(Model.DESTROY_EVENT, destroyEventCallback)
    return this
  }

  /**
   *
   * @param {Object} [options]
   * @returns {Model}
   */
  dispatchDestroyEvent(options = {}) {
    this.destroyed = true
    this.event.dispatchEvent({ type: Model.DESTROY_EVENT, ...options })
    return this
  }

  /**
   *
   * @param {Object|{ options: (ModelOptions|ModelOptionsBase|ModelOptionsBot|ModelOptionsCharge|ModelOptionsTower) }} charge
   * @returns {Model}
   */
  hit(charge) {
    this.options.health -= charge.options.damage
    if (this.options.health <= 0) {
      this.dispatchDestroyEvent()
    }
    return this
  }

  /**
   *
   * @type {string}
   */
  static SHOT_EVENT = 'SHOT_EVENT'

  /**
   * @param {Object} options
   * @callback shotEventCallback
   */

  /**
   *
   * @param shotEventCallback
   * @returns {Model}
   */
  shotEvent(shotEventCallback) {
    this.event.addEventListener(Model.SHOT_EVENT, shotEventCallback)
    return this
  }

  /**
   *
   * @param {Object|Model} targetObject
   * @param {Object} [options]
   * @returns {Model}
   */
  dispatchShotEvent(targetObject, options = {}) {
    this.event.dispatchEvent({
      ...options,
      targetObject,
      type: Model.SHOT_EVENT,
      position: this.position.clone(),
      direction: this.object3DDirection.get().clone(),
    })
    return this
  }

  update(delta) {

  }
}

export default Model