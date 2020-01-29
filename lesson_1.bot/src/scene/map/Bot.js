import { Group, Mesh, Vector3, Object3D, EventDispatcher } from 'three'
import { Object3DFollower, Object3DMover1, Object3DDirection } from '../lib'
import ModelBot from './ModelBot'

export default class Bot extends ModelBot {
  /**
   *
   * @param {Team} team
   * @param {Array.<Vector3>} path
   * @param {Vector3} position
   */
  constructor(team, path, position) {
    super(team)
    this.position.copy(position)

    this.options = { health: 200 }

    /**
     *
     * @type {Object3DFollower}
     */
    this.object3DFolower = new Object3DFollower(this, 4.5)

    /**
     *
     * @type {Object3DMover1}
     */
    this.object3DMover = new Object3DMover1(this, 40)

    /**
     *
     * @type {Object3DDirection}
     */
    this.object3DDirection = new Object3DDirection(this)

    /**
     *
     * @type {Team}
     */
    this.team = team

    /**
     *
     * @type {Array.<Vector3>}
     */
    this.path = Bot.preparePath(path, position)

    /**
     *
     * @type {number}
     */
    this.pursuitRadius = 90

    /**
     *
     * @type {number}
     */
    this.attackRadius = 60

    /**
     *
     * @type {Object3D|Group|Mesh|null}
     */
    this.attacTarget = null

    /**
     *
     * @type {Object3D|Group|Mesh|null}
     */
    this.pursuitTarget = null

    /**
     *
     * @type {EventDispatcher}
     */
    this.event = new EventDispatcher()

    /**
     *
     * @type {{expiredTime: number, interval: number}}
     */
    this.weaponOptions = { interval: 2, expiredTime: 0 }

    /**
     *
     * @type {boolean}
     */
    this.destroyed = false
  }

  /**
   *
   * @type {string}
   */
  static DESTROY_EVENT = 'DESTROY_EVENT'

  /**
   * @typedef {Object} DestroyEventOptions
   * @param {string} type
   */

  /**
   * @param {DestroyEventOptions} options
   * @callback destroyEventCallback
   */

  /**
   *
   * @param destroyEventCallback
   * @returns {Bot}
   */
  destroyEvent(destroyEventCallback) {
    this.event.addEventListener(Bot.DESTROY_EVENT, destroyEventCallback)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  dispatchDestroyEvent() {
    this.destroyed = true
    this.event.dispatchEvent({ type: Bot.DESTROY_EVENT })
    return this
  }

  /**
   *
   * @param {Charge} charge
   * @returns {Bot}
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
   * @typedef {Object} ShotEventOptions
   * @property {string} type
   * @property {Vector3} position
   * @property {Vector3} direction
   */

  /**
   * @param {ShotEventOptions}
   * @callback shotEventCallback
   */

  /**
   *
   * @param shotEventCallback
   * @returns {Bot}
   */
  shotEvent(shotEventCallback) {
    this.event.addEventListener(Bot.SHOT_EVENT, shotEventCallback)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  dispatchShotEvent() {
    this.event.dispatchEvent({
      type: Bot.SHOT_EVENT,
      position: this.position.clone(),
      direction: this.object3DDirection.get().clone(),
    })
    return this
  }

  /**
   *
   * @param {Array.<Vector3>} path
   * @param {Vector3} position
   * @returns {Array.<Vector3>}
   */
  static preparePath(path, position) {
    path = Array.from(path)
    if (path.length > 1) {
      const distanceToFirstVector = position.distanceTo(path[0])
      const distanceToLastVector = position.distanceTo(path[path.length - 1])
      if (distanceToFirstVector > distanceToLastVector) {
        path = path.reverse()
      }
    }
    return path
  }

  tryCaptureTarget(bots, builds) {
    if (this.destroyed) {
      return
    }

    if (this.attacTarget && this.position.distanceTo(this.attacTarget.position) <= this.attackRadius) {
      // Has target. Do nothing.
      return
    }

    // if (this.pursuitTarget && this.position.distanceTo(this.pursuitTarget.position) <= this.pursuitRadius) {
    //   // Has target. Do nothing.
    //   return
    // }

    if (this.attacTarget) {
      // Lost target.
      this.attacTarget = null
    }

    // if (this.pursuitTarget) {
    //   // Lost target.
    //   this.pursuitTarget = null
    // }

    for (const bot of bots) {
      if (this.position.distanceTo(bot.position) <= this.attackRadius) {
        // Target captured.
        this.attacTarget = bot
        return
      }
    }

    for (const build of builds) {
      if (this.position.distanceTo(build.position) <= this.pursuitRadius) {
        // Target captured.
        this.attacTarget = build
        return
      }
    }
  }

  /**
   *
   * @callback ShotCallback
   */

  /**
   *
   * @param {number} delta
   * @returns {Bot}
   */
  update(delta) {
    if (this.destroyed) {
      return this
    }

    this.weaponOptions.expiredTime += delta
    if (this.path.length > 0 && !this.attacTarget && !this.pursuitTarget) {
      // Move on the road
      const target = this.path[0]
      this.object3DMover.setTarget(target).update(delta)
      this.object3DFolower.setTarget(target).update(delta)
      if (this.object3DMover.isTargetReached) {
        this.path.splice(0, 1)
      }
    }

    // if (!this.attacTarget && this.pursuitTarget) {
    //   // Move on the pursuit target
    //   const target = this.pursuitTarget.position
    //   this.object3DMover.setTarget(target).update(delta)
    //   this.object3DFolower.setTarget(target).update(delta)
    // }

    if (!this.pursuitTarget && this.attacTarget) {
      this.object3DFolower.setTarget(this.attacTarget.position).update(delta)
      if (this.weaponOptions.expiredTime >= this.weaponOptions.interval) {
        this.weaponOptions.expiredTime = 0
        this.dispatchShotEvent()
      }
    }

    return this
  }
}