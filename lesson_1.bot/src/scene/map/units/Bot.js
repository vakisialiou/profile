import { Object3DFollower, Object3DMover1, Object3DDirection } from '../../lib'
import ModelBot from '../models/ModelBot'
import {Math as _Math, CircleGeometry, Vector3} from 'three'

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
     * @type {{expiredTime: number, interval: number}}
     */
    this.weaponOptions = { interval: 2, expiredTime: 0 }
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

  tryCaptureTarget(bots) {
    if (this.destroyed) {
      return
    }

    if (this.attacTarget && this.attacTarget.destroyed) {
      this.attacTarget = null
    }

    if (this.attacTarget && this.position.distanceTo(this.attacTarget.position) <= this.attackRadius) {
      // Has target. Do nothing.
      return
    }

    for (const bot of bots) {
      if (this.position.distanceTo(bot.position) <= this.attackRadius) {
        // Target captured.
        this.attacTarget = bot
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
    if (this.path.length > 0 && !this.attacTarget) {
      // Move on the road
      const target = this.path[0]
      this.object3DMover.setTarget(target).update(delta)
      this.object3DFolower.setTarget(target).update(delta)
      if (this.object3DMover.isTargetReached) {
        this.path.splice(0, 1)
      }
    }

    if (this.attacTarget) {
      this.object3DFolower.setTarget(this.attacTarget.position).update(delta)
      if (this.weaponOptions.expiredTime >= this.weaponOptions.interval) {
        this.weaponOptions.expiredTime = 0
        this.dispatchShotEvent(this.attacTarget)
      }
    }

    return this
  }
}