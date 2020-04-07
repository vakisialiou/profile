import Unit from '@scene/units/Unit'
import MathObject from '@scene/helper/MathObject'
import { LoopOnce, Matrix4, Quaternion, Vector3 } from 'three'

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
     * @type {MathObject}
     */
    this.math = new MathObject(this)

    /**
     *
     * @type {{quaternion: Quaternion, target: Vector3, pathLength: number, orientationEnabled: boolean}}
     * @private
     */
    this._followOptions = { quaternion: new Quaternion(), target: new Vector3(), pathLength: 0, orientationEnabled: false }

    /**
     *
     * @type {Array.<Vector3>}
     */
    this.followingPath = []




    /**
     * The amount of deceleration.
     * @type Number
     * @default 3
     */
    this.deceleration = 3

    /**
     * A tolerance value in world units to prevent the vehicle from overshooting its target.
     * @type {Number}
     * @default 0
     */
    this.tolerance = 0


    this.maxSpeed = 0.5
    this.desiredVelocity = new Vector3()
    this.displacement = new Vector3()


    this.point = null

  }

  /**
   *
   * @param {Vector3} p
   * @returns {Bot}
   */
  setPoint(p) {
    this.followingPath = [p]
    return this
  }

  /**
   *
   * @param {Vector3} p
   * @returns {Bot}
   */
  addPoint(p) {
    this.followingPath = [p]
    return this
  }

  /**
   *
   * @param {Array.<Vector3>} arr
   * @returns {Bot}
   */
  addPoints(arr) {
    this.followingPath = this.followingPath.concat(arr)
    return this
  }

  /**
   * @returns {(Vector3|?)}
   */
  getPoint() {
    if (this.followingPath.length > 0) {
      return this.followingPath[0].clone().setY(this.position.y)
    }
    return null
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
    this.enableAnimation(Bot.ANIMATION_KEY_RUNNING)
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

    const target = this.getPoint()
    if (!target) {
      return this
    }

    if (this.position.equals(target)) {
      return this
    }

    // TODO: make as individual class behavior
    if (!this._followOptions.target.equals(target)) {
      this._followOptions.target.copy(target)
      this._followOptions.pathLength = this.position.distanceTo(target)
      this._followOptions.orientationEnabled = true
      // Событие кругового движения, начало.
    }

    const angle = this.math.angleToPointXZ(target)
    this._followOptions.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), angle)

    if (this._followOptions.orientationEnabled && !this.quaternion.equals(this._followOptions.quaternion)) {
      this.walkingAnimation()// TODO: move
      const rotateSpeed = 9 //
      this.quaternion.rotateTowards(this._followOptions.quaternion, rotateSpeed * delta)

      // Толкать объект в его направлении.
      let moveSpeed = 30 * delta
      const distanceSq = target.distanceToSquared(this.position)
      const nextWayPointDistance = 0.5
      if (distanceSq < (nextWayPointDistance * nextWayPointDistance)) {
        moveSpeed = 0
      }
      const direction = this.math.direction()
      this.position.addScaledVector(direction, moveSpeed)

      // Событие круговое движение, смещение.
      return this
    }

    if (this._followOptions.orientationEnabled) {
      this.walkingAnimation()// TODO: move
      // Событие круговое движение, завершено.
      // Событие прямолинейное движени, начало.
    }
    this._followOptions.orientationEnabled = false

    // Перемещать в сторону цели.
    // const distanceSq = target.distanceToSquared(this.position)
    // const nextWayPointDistance = 0.5
    // if (distanceSq < (nextWayPointDistance * nextWayPointDistance)) {
    //   this.desiredVelocity.set(0, 0, 0)
    // } else {
    //   this.desiredVelocity.subVectors(target, this.position).normalize()
    //   this.desiredVelocity.multiplyScalar(this.maxSpeed)
    // }
    //
    // this.position.add(this.desiredVelocity)


    // calculate - 2
    this.displacement.subVectors(target, this.position)
    const distance = this.displacement.length()

    if (Number(distance.toFixed(1)) > this.tolerance) {
      // calculate the speed required to reach the target given the desired deceleration
      let speed = distance / this.deceleration

      // make sure the speed does not exceed the max
      speed = Math.min(speed, this.maxSpeed) / distance
      this.desiredVelocity.copy(this.displacement).multiplyScalar(speed)
      // Событие прямолинейное движени, смещение.
    } else {
      this.desiredVelocity.set(0, 0, 0)
      this.idleAnimation()// TODO: move
      // Событие прямолинейное движени, завершено.
    }
    this.position.add(this.desiredVelocity)
    return this
  }
}