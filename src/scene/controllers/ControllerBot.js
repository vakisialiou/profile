import Bot from '@scene/units/Bot'
import Loading from '@scene/loading/Loading'
import { Vector3 } from 'three'

const MODEL_BOT = 'MODEL_BOT'

export const loading = new Loading()
  .addItem(Loading.TYPE_MODEL, MODEL_BOT, '/models/bot/bot.glb')

export class ControllerBot {
  /**
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
     * @type {Object3D|Group|null}
     */
    this.botTarget = null

    /**
     *
     * @type {Array.<Object3D|Group>}
     */
    this._captureObjects = []
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
        for (const item of this._captureObjects) {
          const length = this.bot.position.distanceTo(item.position)
          if (length > 60 && length < 300) {
            // Move to point.
            this.bot.setSpeed(1).runningForwardAnimation()
            return
          } else if (length <= 60) {
            // Move from point.
            this.bot.setSpeed(-1.5).runningBackwardAnimation()
            return
          }
        }

        this.bot.setSpeed(1.5).runningAnimation()
      })
      .onMoving((event) => {
        if (event.movingType !== 'direct') {
          // capture target can only if object look at in the same direction.
          return
        }

        for (const item of this._captureObjects) {
          const length = this.bot.position.distanceTo(item.position)
          if (length > 60 && length <= 140) {
            this.botTarget = item
            // Stay on the place and shooting to the target.
            this.bot.pauseMoving().shootingAnimation()
            return
          }
          if (length <= 60) {
            // Move from point.
            this.bot.setSpeed(-1.5).runningBackwardAnimation()
          }
        }
      })
      .onStopMoving(() => this.bot.idleAnimation())

    this.bot.animation.mixer.addEventListener('finished', () => {
      if (this.enabled === false) {
        return
      }
      if (this.botTarget && this.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
        this.bot.shootingAnimation()
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
   * @param {Array.<Object3D|Group>} objects
   * @returns {ControllerBot}
   */
  captureObjects(objects) {
    this._captureObjects = objects
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