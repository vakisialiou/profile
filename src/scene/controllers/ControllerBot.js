import Bot from '@scene/units/Bot'
import Loading from '@scene/loading/Loading'
import BotEffect from '@scene/effects/BotEffect'
import { loading as loadingBullet, ControllerBullet } from './ControllerBullet'
import { Vector3 } from 'three'

const MODEL_BOT = 'MODEL_BOT'
const TEXTURE_SMOKE_PARTICLE = 'TOWER_TEXTURE_SMOKE_PARTICLE'

export const loading = new Loading()
  .addItem(Loading.TYPE_MODEL, MODEL_BOT, '/models/bot/bot.glb')
  .addItem(Loading.TYPE_TEXTURE, TEXTURE_SMOKE_PARTICLE, '/images/spe/smokeparticle.png')
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
     * @type {BotEffect}
     */
    this.botEffect = new BotEffect()
      .createShotEffect(this.loader.getTexture(TEXTURE_SMOKE_PARTICLE))
      .createMistEffect(this.loader.getTexture(TEXTURE_SMOKE_PARTICLE))

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
      walking: 0.5,
    }

    /**
     *
     * @type {boolean}
     */
    this.patrol = false

    this.enemies = []
  }

  /**
   * @param {Engine} engine
   * @returns {ControllerBot}
   */
  preset(engine) {
    this.bot
      .onStartMoving(() => {
        if (!this.target) {
          if (this.patrol) {
            this.bot.setSpeed(this.speed.walking).walkingAnimation()
          } else {
            this.bot.setSpeed(this.speed.running).runningAnimation()
          }
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
          if (this.patrol) {
            this.bot.setSpeed(this.speed.walking).walkingAnimation()
          } else {
            this.bot.setSpeed(this.speed.running).runningAnimation()
          }
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

          const weaponPosition = this.bot.getWeaponPosition()
          new ControllerBullet(this.loader)
            .setPosition(weaponPosition)
            .setDirection(this.bot.getWeaponDirection())
            .preset(engine, this.enemies)

          // Провацировать эффек выстрела.
          this.botEffect.emmitShotEffect(weaponPosition)
          this.botEffect.emmitMistEffect(weaponPosition)

          return
        }

        if (length <= 60 && !this.bot.isActiveAnimation(Bot.ANIMATION_KEY_RUNNING_BACKWARD)) {
          // Move from point.
          this.bot.setSpeed(this.speed.runningBackward).runningBackwardAnimation()
        }
      })
      .onStopMoving(() => this.bot.idleAnimation())
      .idleAnimation()
      .setScale(20)
      .preset()

    this.bot.animation.mixer.addEventListener('finished', () => {
      if (this.enabled === false) {
        return
      }

      if (this.target && this.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
        this.bot.shootingAnimation()

        const weaponPosition = this.bot.getWeaponPosition()
        new ControllerBullet(this.loader)
          .setPosition(weaponPosition)
          .setDirection(this.bot.getWeaponDirection())
          .preset(engine, this.enemies)

        // Провацировать эффек выстрела.
        this.botEffect.emmitShotEffect(weaponPosition)
        this.botEffect.emmitMistEffect(weaponPosition)
      }
    })

    engine.add('bot', this.bot)
      .add('bot-effect', this.botEffect.getShotMesh()) // Добавить на сцену эффекты
      .add('bot-effect', this.botEffect.getMistMesh()) // Добавить на сцену эффекты

    engine.addUpdate((delta) => {
      this.bot.update(delta)
      this.botEffect.update(delta)
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
   * @param {boolean} value
   * @returns {ControllerBot}
   */
  patrolling(value) {
    this.patrol = value
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {ControllerBot}
   */
  setPosition(position) {
    this.bot.position.copy(position)
    this.bot.position.setY(2)
    return this
  }

  /**
   *
   * @param {Object3D|Mesh|Group|Unit} enemies
   * @returns {ControllerBot}
   */
  setEnemies(enemies) {
    this.enemies = enemies
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
    this.bot.followTo(point).playMoving()
    return this
  }

  /**
   *
   * @param {Array.<Vector3>} points
   * @param {boolean} [loop]
   * @returns {ControllerBot}
   */
  setPath(points, loop = false) {
    this.bot.setPath(points, loop).playMoving()
    return this
  }
}