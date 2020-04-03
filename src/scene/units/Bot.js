import Unit from '@scene/units/Unit'
import { Vector3 } from 'three'

export default class Bot extends Unit {
  constructor(gltf) {
    super(gltf)

    /**
     *
     * @type {AnimationAction}
     */
    this.actionShooting = this.animation.findAction('Shooting')
    this.actionShooting.setDuration(0.6)

    /**
     *
     * @type {AnimationAction}
     */
    this.actionWalking = this.animation.findAction('Walking')

    /**
     *
     * @type {AnimationAction}
     */
    this.actionDying = this.animation.findAction('Dying')

    /**
     *
     * @type {AnimationAction}
     */
    this.actionIdle = this.animation.findAction('Idle')

    /**
     *
     * @type {Object3D|Mesh}
     */
    this.weapon = gltf.model.getObjectByName('Weapon')
    if (!this.weapon) {
      throw Error('Could not find weapon.')
    }

    this._tmp = new Vector3()
    this._weaponScalar = new Vector3(0, 1.6, 0)
  }

  /**
   *
   * @returns {Vector3}
   */
  get weaponTrapPosition() {
    return this.weapon.getWorldPosition(this._tmp).add(this._weaponScalar)
  }

  /**
   *
   * @returns {Bot}
   */
  idleAnimation() {
    this.animation.enableAction(this.actionIdle)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  dyingAnimation() {
    this.animation.enableAction(this.actionDying)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  walkingAnimation() {
    this.animation.enableAction(this.actionWalking)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  shootingAnimation() {
    this.animation.enableAction(this.actionShooting)
    return this
  }
}