import Unit from '@scene/units/Unit'
import { LoopOnce, Math as _Math, Vector3 } from 'three'
import DisplacementFollow from '@scene/steering/modifiers/DisplacementFollow'
import DisplacementPush from '@scene/steering/modifiers/DisplacementPush'
import RotationTowardsTarget from '@scene/steering/modifiers/RotationTowardsTarget'
import Path from '@scene/steering/Path'

export default class Bot extends Unit {
  constructor(gltf) {
    super(gltf)

    /**
     *
     * @type {number}
     */
    this.rotateSpeed = 12

    /**
     *
     * @type {number}
     */
    this.maxSpeedMoving = 1.5

    /**
     *
     * @type {Path}
     */
    this.path = new Path()

    /**
     *
     * @type {DisplacementPush}
     */
    this.displacementPush = new DisplacementPush()

    /**
     *
     * @type {DisplacementFollow}
     */
    this.displacementFollow = new DisplacementFollow()

    /**
     *
     * @type {RotationTowardsTarget}
     */
    this.rotationTowardsTarget = new RotationTowardsTarget()

    /**
     *
     * @type {Object3D}
     */
    this.weaponPlug = this.getObjectByName('Plug')
    this._weaponPlugPosition = new Vector3()
    this._weaponPlugDirection = new Vector3()
    this._weaponPlugAccuracy = new Vector3()

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
    this.actionRunningBackwards = this.animation.findAction(Bot.ANIMATION_KEY_RUNNING_BACKWARD)

    /**
     *
     * @type {AnimationAction}
     */
    this.actionRunningForward = this.animation.findAction(Bot.ANIMATION_KEY_RUNNING_FORWARD)
    this.actionRunningForward.setDuration(9)

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
      { key: Bot.ANIMATION_KEY_RUNNING_FORWARD , action: this.actionRunningForward, disabled: false, loopOnce: false },
      { key: Bot.ANIMATION_KEY_RUNNING_BACKWARD , action: this.actionRunningBackwards, disabled: false, loopOnce: false },
    ]

    /**
     *
     * @type {{target: Vector3, orientationEnabled: boolean}}
     * @private
     */
    this._tmp = { target: new Vector3(), orientationEnabled: false }

    /**
     *
     * @type {{pause: boolean, prevFramePause: boolean}}
     * @private
     */
    this._state = { pause: false, prevFramePause: false }

    /**
     *
     * @type {string|?}
     * @private
     */
    this._activeActionKey = null
  }

  static EVENT_PAUSE_MOVING = 'EVENT_PAUSE_MOVING'
  static EVENT_PLAY_MOVING = 'EVENT_PLAY_MOVING'
  static EVENT_START_MOVING = 'EVENT_START_MOVING'
  static EVENT_STOP_MOVING = 'EVENT_STOP_MOVING'
  static EVENT_MOVING = 'EVENT_MOVING'

  /**
   *
   * @returns {Vector3}
   */
  getWeaponPosition() {
    return this.weaponPlug.getWorldPosition(this._weaponPlugPosition)
  }

  /**
   *
   * @param {number} [minAccuracy]
   * @param {number} [maxAccuracy]
   * @returns {Vector3}
   */
  getWeaponDirection(minAccuracy = - 0.01, maxAccuracy = 0.01) {
    this._weaponPlugAccuracy.setX(_Math.randFloat(minAccuracy, maxAccuracy))
    this._weaponPlugAccuracy.setY(_Math.randFloat(minAccuracy, maxAccuracy))
    this._weaponPlugAccuracy.setZ(_Math.randFloat(minAccuracy, maxAccuracy))
    return this.getWorldDirection(this._weaponPlugDirection).add(this._weaponPlugAccuracy).multiplyScalar(-1)
  }

  /**
   *
   * @param value
   * @returns {Bot}
   */
  setSpeed(value) {
    this.maxSpeedMoving = value
    return this
  }

  /**
   * Follow to specific point. Stop when you reach a point.
   *
   * @param {Vector3} point
   * @returns {Bot}
   */
  followTo(point) {
    this.path.clear().add(point)
    return this
  }

  /**
   * Follow from one to another point.
   *
   * @param {Array.<Vector3>} points
   * @param {boolean} [loop]
   * @returns {Bot}
   */
  setPath(points, loop = false) {
    this.path.loop = loop
    for (const point of points) {
      this.path.add(point)
    }
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  clearPath() {
    this.path.clear()
    this._state.pause = false
    this._state.prevFramePause = false
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  pauseMoving() {
    this._state.pause = true
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  playMoving() {
    this._state.pause = false
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  preset() {
    if (!this.weaponPlug) {
      throw new Error(`Could not find object by name Plug.`)
    }
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
  static ANIMATION_KEY_RUNNING_BACKWARD = 'RunningBackward'
  static ANIMATION_KEY_RUNNING_FORWARD = 'RunningForward'
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
  runningBackwardAnimation() {
    this.enableAnimation(Bot.ANIMATION_KEY_RUNNING_BACKWARD, 0.1)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  runningForwardAnimation() {
    this.enableAnimation(Bot.ANIMATION_KEY_RUNNING_FORWARD, 0.1)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  shootingAnimation() {
    this.enableAnimation(Bot.ANIMATION_KEY_SHOOTING, 0.2)
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
   * @param {string} key - Key of animation.
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
      this._activeActionKey = key
      this.animation.enableAction(item.action, duration)
    }
    return this
  }

  /**
   *
   * @param {string} key - Key of animation.
   * @returns {boolean}
   */
  isActiveAnimation(key) {
    return this._activeActionKey === key
  }

  /**
   *
   * @param {Function} callback
   * @returns {Bot}
   */
  onStartMoving(callback) {
    this.addEventListener(Bot.EVENT_START_MOVING, callback)
    return this
  }

  /**
   *
   * @param {Function} callback
   * @returns {Bot}
   */
  onStopMoving(callback) {
    this.addEventListener(Bot.EVENT_STOP_MOVING, callback)
    return this
  }

  /**
   *
   * @param {Function} callback
   * @returns {Bot}
   */
  onPauseMoving(callback) {
    this.addEventListener(Bot.EVENT_PAUSE_MOVING, callback)
    return this
  }

  /**
   *
   * @param {Function} callback
   * @returns {Bot}
   */
  onPlayMoving(callback) {
    this.addEventListener(Bot.EVENT_PLAY_MOVING, callback)
    return this
  }

  /**
   *
   * @param {Function} callback
   * @returns {Bot}
   */
  onMoving(callback) {
    this.addEventListener(Bot.EVENT_MOVING, callback)
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {Bot}
   */
  update(delta) {
    delta = delta === 0 ? 0.0000000001 : delta
    super.update(delta)

    // Select last point.
    let target = this.path.current()
    if (!target) {
      return this
    }

    target.setY(this.position.y)

    if (this.position.equals(target)) {
      if (this.path.loop) {
        // Looping path. Select first point.
        target = this.path.advance().current()
        target.setY(this.position.y)
      } else {
        return this
      }
    }

    // Pause control.
    if (this._state.pause) {
      if (!this._state.prevFramePause) {
        this.dispatchEvent({ type: Bot.EVENT_PAUSE_MOVING, target })
      }
      this._state.prevFramePause = true
      return this
    }

    if (this._state.prevFramePause) {
      this.dispatchEvent({ type: Bot.EVENT_PLAY_MOVING, target })
    }
    this._state.prevFramePause = false

    // Remember active target.
    if (!this._tmp.target.equals(target)) {
      this._tmp.target.copy(target)
      this._tmp.orientationEnabled = true
      this.dispatchEvent({ type: Bot.EVENT_START_MOVING, target })
    }

    this.displacementPush.setMaxSpeed(this.maxSpeedMoving)
    this.displacementFollow.setMaxSpeed(this.maxSpeedMoving)

    // Arc moving.
    const quaternion = this.rotationTowardsTarget.calculate(this, target, this.rotateSpeed * delta)
    if (this._tmp.orientationEnabled && !this.quaternion.equals(quaternion)) {
      this.quaternion.copy(quaternion)

      // TODO: value 25: need calculate dynamically. Depend on distance to target and arc radius.
      if (this.position.distanceTo(target) > 25) {
        this.position.add(this.displacementPush.calculate(this))
      }
      // Событие круговое движение, смещение.
      this.dispatchEvent({ type: Bot.EVENT_MOVING, target, movingType: 'arc' })
      return this
    }

    if (this._tmp.orientationEnabled) {
      // Событие круговое движение, завершено.
      // Событие прямолинейное движени, начало.
    }

    this._tmp.orientationEnabled = false

    // Direct moving.
    const displacement = this.displacementFollow.calculate(this.position, target)
    if (displacement.length() > 0) {
      this.dispatchEvent({ type: Bot.EVENT_MOVING, target, movingType: 'direct' })
      // Событие прямолинейное движени, смещение.
      this.position.add(displacement)
    } else {
      this.path.advance()
      this.position.copy(target)
      if (this.path.finished()) {
        this.dispatchEvent({ type: Bot.EVENT_STOP_MOVING, target })
      }
    }

    return this
  }
}