import Unit from '@scene/units/Unit'
import { LoopOnce, Quaternion, Vector3 } from 'three'
import DisplacementFollow from '@scene/steering/modifiers/DisplacementFollow'
import DisplacementPush from '@scene/steering/modifiers/DisplacementPush'
import RotationTowardsTarget from '@scene/steering/modifiers/RotationTowardsTarget'
import Path from '@scene/steering/Path'

export default class Bot extends Unit {
  constructor(gltf) {
    super(gltf)

    /**
     *
     * @type {AnimationAction}
     */
    this.actionShooting = this.animation.findAction(Bot.ANIMATION_KEY_SHOOTING)

    /**
     *
     * @type {AnimationAction}
     */
    this.actionWalking = this.animation.findAction(Bot.ANIMATION_KEY_WALKING)

    /**
     *
     * @type {AnimationAction}
     */
    this.actionRunning = this.animation.findAction(Bot.ANIMATION_KEY_RUNNING)

    /**
     *
     * @type {AnimationAction}
     */
    this.actionDying = this.animation.findAction(Bot.ANIMATION_KEY_DYING)

    /**
     *
     * @type {AnimationAction}
     */
    this.actionIdle = this.animation.findAction(Bot.ANIMATION_KEY_IDLE)

    this.animationItems = [
      { key: Bot.ANIMATION_KEY_IDLE, action: this.actionIdle, disabled: false, loopOnce: false },
      { key: Bot.ANIMATION_KEY_DYING, action: this.actionDying, disabled: false, loopOnce: true },
      { key: Bot.ANIMATION_KEY_WALKING, action: this.actionWalking, disabled: false, loopOnce: false },
      { key: Bot.ANIMATION_KEY_RUNNING, action: this.actionRunning, disabled: false, loopOnce: false },
      { key: Bot.ANIMATION_KEY_SHOOTING , action: this.actionShooting, disabled: false, loopOnce: true },
    ]

    /**
     *
     * @type {{target: Vector3, orientationEnabled: boolean}}
     * @private
     */
    this._tmp = { target: new Vector3(), orientationEnabled: false }

    this.displacementPush = new DisplacementPush()
    this.displacementFollow = new DisplacementFollow()
    this.rotationTowardsTarget = new RotationTowardsTarget()

    this.path = new Path()
  }

  /**
   *
   * @param {Vector3} point
   * @returns {Bot}
   */
  setTarget(point) {
    this.path.clear().add(point)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  preset() {
    for (const item of this.animationItems) {
      if (!item.action) {
        throw new Error(`Could not find action "${item.key}"`)
      }
      if (item.disabled) {
        continue
      }

      if (item.loopOnce) {
        item.action.clampWhenFinished = true
        item.action.loop = LoopOnce
      }
    }
    return this
  }

  static ANIMATION_KEY_IDLE = 'Idle'
  static ANIMATION_KEY_DYING = 'Dying'
  static ANIMATION_KEY_WALKING = 'Walking'
  static ANIMATION_KEY_RUNNING = 'Running'
  static ANIMATION_KEY_SHOOTING = 'Shooting'

  /**
   *
   * @returns {Bot}
   */
  idleAnimation() {
    this.enableAnimation(Bot.ANIMATION_KEY_IDLE, 0.6)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  dyingAnimation() {
    this.enableAnimation(Bot.ANIMATION_KEY_DYING)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  walkingAnimation() {
    this.enableAnimation(Bot.ANIMATION_KEY_WALKING)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  runningAnimation() {
    this.enableAnimation(Bot.ANIMATION_KEY_RUNNING, 0.1)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  shootingAnimation() {
    this.enableAnimation(Bot.ANIMATION_KEY_SHOOTING)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  pauseAnimation() {
    this.animation.pause()
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  unpauseAnimation() {
    this.animation.unpause()
    return this
  }

  /**
   *
   * @param {string} key
   * @param {number} duration
   * @returns {Bot}
   */
  enableAnimation(key, duration = 0.2) {
    for (const item of this.animationItems) {
      if (item.key !== key) {
        continue
      }
      if (item.disabled) {
        break
      }
      this.animation.enableAction(item.action, duration)
    }
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {Bot}
   */
  update(delta) {
    super.update(delta)

    let target = this.path.current()
    if (!target) {
      return this
    }

    target.setY(0)

    // if (this.position.equals(target)) {
    //   target = this.path.advance().current().setY(0)
    // }

    if (this.position.equals(target)) {
      return this
    }

    if (!this._tmp.target.equals(target)) {
      this._tmp.target.copy(target)
      this._tmp.orientationEnabled = true
      // Событие кругового движения, начало.
    }

    const rotateSpeed = 8
    const quaternion = this.rotationTowardsTarget.calculate(this, target, rotateSpeed * delta)

    if (this._tmp.orientationEnabled && !this.quaternion.equals(quaternion)) {
      this.runningAnimation()

      this.quaternion.copy(quaternion)
      this.position.add(this.displacementPush.calculate(this))
      // Событие круговое движение, смещение.
      return this
    }

    if (this._tmp.orientationEnabled) {
      this.runningAnimation()// TODO: move
      // Событие круговое движение, завершено.
      // Событие прямолинейное движени, начало.
    }

    this._tmp.orientationEnabled = false

    const displacement = this.displacementFollow.calculate(this.position, target)
    if (displacement.length() > 0) {
      // Событие прямолинейное движени, смещение.
      this.position.add(displacement)
    } else {
      this.path.advance()
      this.position.copy(target)
      if (this.path.finished()) {
        this.idleAnimation()
      }
      // Событие прямолинейное движени, завершено.
    }

    return this
  }
}