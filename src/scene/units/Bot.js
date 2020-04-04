import Unit from '@scene/units/Unit'

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
      { key: Bot.ANIMATION_KEY_IDLE, action: this.actionIdle, disabled: false, duration: null },
      { key: Bot.ANIMATION_KEY_DYING, action: this.actionDying, disabled: false, duration: null },
      { key: Bot.ANIMATION_KEY_WALKING, action: this.actionWalking, disabled: false, duration: null },
      { key: Bot.ANIMATION_KEY_RUNNING, action: this.actionRunning, disabled: false, duration: null },
      { key: Bot.ANIMATION_KEY_SHOOTING , action: this.actionShooting, disabled: false, duration: null }
    ]
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
      if (item.duration) {
        item.action.setDuration(0.6)
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
    this.enableAnimation(Bot.ANIMATION_KEY_IDLE)
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
   * @param {Function} [callback]
   * @returns {Bot}
   */
  pauseAnimation(callback) {
    this.animation.pause(callback)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  stopAnimation() {
    this.animation.stop()
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  unpauseAnimation() {
    this.animation.play()
    return this
  }

  /**
   *
   * @param {string} key
   * @returns {Bot}
   */
  enableAnimation(key) {
    for (const item of this.animationItems) {
      if (item.key !== key) {
        continue
      }
      if (item.disabled) {
        break
      }
      this.animation.enableAction(item.action)
    }
    return this
  }
}