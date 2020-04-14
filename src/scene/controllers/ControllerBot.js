import Bot from '@scene/units/Bot'
import Loading from '@scene/loading/Loading'
import { loading as loadingBullet, ControllerBullet } from './ControllerBullet'
import { Vector3, Math as _Math } from 'three'

const MODEL_BOT = 'MODEL_BOT'

export const loading = new Loading()
  .addItem(Loading.TYPE_MODEL, MODEL_BOT, '/models/bot/bot.glb')
  .addLoading(loadingBullet)

export class ControllerBot {
  /**
   * Use method "followTo" to move object to specific position.
   * Use method
   *
   * @param {Loading} loader
   */
  constructor(loader) {
    /**
     *
     * @type {Loading}
     */
    this.loader = loader

    /**
     *
     * @type {(Bot|Unit)}
     */
    this.bot = new Bot(this.loader.getRawModel(MODEL_BOT))
    this.bot.position.setY(2)

    /**
     *
     * @type {boolean}
     */
    this.enabled = true

    /**
     *
     * @type {Object3D|Group|Unit|null}
     */
    this.target = null

    this.speed = {
      running: 1.5,
      runningForward: 1,
      runningBackward: - 1,
    }
  }

  /**
   * @param {Engine} engine
   * @returns {ControllerBot}
   */
  preset(engine) {
    this.bot
      .setScale(20)
      .preset()
      .pauseMoving()
      .idleAnimation()
      .onStartMoving(() => {
        if (!this.target) {
          this.bot.setSpeed(this.speed.running).runningAnimation()
          return
        }

        const length = this.bot.position.distanceTo(this.target.position)
        if (length > 60 && length < 300) {
          // Move to point.
          this.bot.setSpeed(this.speed.runningForward).runningForwardAnimation()
        } else if (length <= 60) {
          // Move from point.
          this.bot.setSpeed(this.speed.runningBackward).runningBackwardAnimation()
        } else {
          this.bot.setSpeed(this.speed.running).runningAnimation()
        }
      })
      .onMoving((event) => {
        if (event.movingType !== 'direct') {
          // capture target can only if object look at in the same direction.
          return
        }

        if (!this.target) {
          return
        }

        const length = this.bot.position.distanceTo(this.target.position)

        if (length > 140 && length <= 240 && !this.bot.isActiveAnimation(Bot.ANIMATION_KEY_RUNNING_FORWARD)) {
          this.bot.setSpeed(this.speed.runningForward).runningForwardAnimation()
          return
        }

        if (length > 60 && length <= 140 && !this.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
          // Stay on the place and shooting to the target.
          this.bot.pauseMoving().shootingAnimation()

          const gunPosition = new Vector3().copy(this.bot.position).setY(30)
          const direction = this.bot
            .getWorldDirection(new Vector3())
            .add(new Vector3(_Math.randFloat(-0.01, 0.01), _Math.randFloat(-0.01, 0.01), _Math.randFloat(-0.01, 0.01)))
            .multiplyScalar(-1)
          const collisionObjects = []
          new ControllerBullet(this.loader)
            .setPosition(gunPosition)
            .setDirection(direction)
            .preset(engine, collisionObjects)

          return
        }

        if (length <= 60 && !this.bot.isActiveAnimation(Bot.ANIMATION_KEY_RUNNING_BACKWARD)) {
          // Move from point.
          this.bot.setSpeed(this.speed.runningBackward).runningBackwardAnimation()
        }
      })
      .onStopMoving(() => this.bot.idleAnimation())

    this.bot.animation.mixer.addEventListener('finished', () => {
      if (this.enabled === false) {
        return
      }

      if (this.target && this.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
        this.bot.shootingAnimation()

        const gunPosition = new Vector3().copy(this.bot.position).setY(30)
        const direction = this.bot.getWorldDirection(new Vector3())
          .add(new Vector3(_Math.randFloat(-0.01, 0.01), _Math.randFloat(-0.01, 0.01), _Math.randFloat(-0.01, 0.01)))
          .multiplyScalar(-1)
        const collisionObjects = []
        new ControllerBullet(this.loader)
          .setPosition(gunPosition)
          .setDirection(direction)
          .preset(engine, collisionObjects)
      }
    })

    engine.add('bot', this.bot)

    engine.addUpdate((delta) => {
      this.bot.update(delta)
    })
    return this
  }

  /**
   *
   * @param {Boolean} value
   * @returns {ControllerBot}
   */
  enable(value = true) {
    if (value) {
      this.enabled = value
      this.bot.clearPath().playMoving()
    } else {
      this.bot.pauseMoving()
    }
    return this
  }

  /**
   *
   * @param {Object3D|Group|Unit} value
   * @returns {ControllerBot}
   */
  setTarget(value) {
    if (this.target === value) {
      return this
    }
    this.target = value
    this.followTo(value.position)
    return this
  }

  /**
   *
   * @returns {ControllerBot}
   */
  captureTarget() {
    this.target = null
    return this
  }

  /**
   *
   * @param {Vector3} point
   * @returns {ControllerBot}
   */
  followTo(point) {
    this.bot.playMoving().followTo(point)
    return this
  }
}