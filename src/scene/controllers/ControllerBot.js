import Bot from '@scene/units/Bot'
import Loading from '@scene/loading/Loading'
import BotEffect from '@scene/effects/BotEffect'
import { loading as loadingBullet, ControllerBullet } from './ControllerBullet'
import { Vector3 } from 'three'

export const MODEL_BOT = 'MODEL_BOT'
export const TEXTURE_SMOKE_PARTICLE = 'TOWER_TEXTURE_SMOKE_PARTICLE'

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
    // this.bot.position.setY(2)

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

    this.aimingArea = { min: 140, max: 240 }
    this.shootingArea = { min: 60, max: 140 }
    this.retreatArea = { min: 0, max: 60 }

    /**
     *
     * @type {string}
     * @private
     */
    this._movingAnimation = Bot.ANIMATION_KEY_RUNNING
    this._movingAnimationNeedUpdate = false

    this.enemies = []
  }

  /**
   * Used when model is moving to target.
   *
   * @param {string} movingAnimationKey - Use constants. Look at method "ControllerBot._activateMoveAnimation" that using it.
   * @returns {ControllerBot}
   */
  useMovingAnimation(movingAnimationKey) {
    this._movingAnimation = movingAnimationKey
    this._movingAnimationNeedUpdate = true
    return this
  }

  /**
   *
   * @param {string} movingAnimationKey
   * @returns {ControllerBot}
   * @private
   */
  _activateMoveAnimation(movingAnimationKey) {
    switch (movingAnimationKey) {
      case Bot.ANIMATION_KEY_WALKING:
        this.bot.setSpeed(this.speed.walking).walkingAnimation()
        break
      case Bot.ANIMATION_KEY_RUNNING_FORWARD:
        this.bot.setSpeed(this.speed.runningForward).runningForwardAnimation()
        break
      case Bot.ANIMATION_KEY_RUNNING_BACKWARD:
        this.bot.setSpeed(this.speed.runningBackward).runningBackwardAnimation()
        break
      case Bot.ANIMATION_KEY_RUNNING:
      default:
        this.bot.setSpeed(this.speed.running).runningAnimation()
        break
    }
    return this
  }

  /**
   *
   * @param {Engine} engine
   * @returns {ControllerBot}
   * @private
   */
  _emmitBullet(engine) {
    const weaponPosition = this.bot.getWeaponPosition()
    const weaponDirection = this.bot.getWeaponDirection()
    new ControllerBullet(this.loader)
      .setPosition(weaponPosition)
      .setDirection(weaponDirection)
      .preset(engine, this.enemies)

    // Провацировать эффек выстрела.
    this.botEffect.emmitShotEffect(weaponPosition)
    this.botEffect.emmitMistEffect(weaponPosition)
    return this
  }

  /**
   *
   * @param {number} distance - Distance between bot position and target.
   * @returns {string|null}
   */
  area(distance) {
    if (distance > this.aimingArea.min && distance <= this.aimingArea.max) {
      return 'aiming-area'
    }
    if (distance > this.retreatArea.min && distance <= this.retreatArea.max) {
      return 'retreat-area'
    }
    if (distance > this.shootingArea.min && distance <= this.shootingArea.max) {
      return 'shooting-area'
    }
    return null
  }

  /**
   * @param {Engine} engine
   * @param {boolean} [usePhysicsWorld]
   * @returns {ControllerBot}
   */
  preset(engine, usePhysicsWorld = false) {
    if (usePhysicsWorld) {
      this.bot.setRigidBody(engine.physicsWorld)
    }
    this.bot
      .onStartMoving(() => {
        if (!this.target) {
          this._activateMoveAnimation(this._movingAnimation)
          return
        }

        const length = this.bot.position.distanceTo(this.target.position)
        if (this.area(length) === 'aiming-area' && !this.bot.isActiveAnimation(Bot.ANIMATION_KEY_RUNNING_FORWARD)) {
          // Move to point.
          this._activateMoveAnimation(Bot.ANIMATION_KEY_RUNNING_FORWARD)
          return
        }

        if (this.area(length) === 'retreat-area' && !this.bot.isActiveAnimation(Bot.ANIMATION_KEY_RUNNING_BACKWARD)) {
          // Move from point.
          this._activateMoveAnimation(Bot.ANIMATION_KEY_RUNNING_BACKWARD)
          return this
        }

        this._activateMoveAnimation(this._movingAnimation)
      })
      .onMoving((event) => {
        if (this._movingAnimationNeedUpdate) {
          this._movingAnimationNeedUpdate = false
          this._activateMoveAnimation(this._movingAnimation)
        }
        if (event.movingType !== 'direct') {
          // capture target can only if object look at in the same direction.
          return
        }

        if (!this.target) {
          return
        }

        const length = this.bot.position.distanceTo(this.target.position)

        // Прицеливаться.
        if (this.area(length) === 'aiming-area' && !this.bot.isActiveAnimation(Bot.ANIMATION_KEY_RUNNING_FORWARD)) {
          this._activateMoveAnimation(Bot.ANIMATION_KEY_RUNNING_FORWARD)
          return
        }

        // Стрелять.
        if (this.area(length) === 'shooting-area' && !this.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
          // Stay on the place and shooting to the target.
          this.bot.pauseMoving().shootingAnimation()
          this._emmitBullet(engine)
          return
        }

        // Отходить.
        if (this.area(length) === 'retreat-area' && !this.bot.isActiveAnimation(Bot.ANIMATION_KEY_RUNNING_BACKWARD)) {
          // Move from point.
          this._activateMoveAnimation(Bot.ANIMATION_KEY_RUNNING_BACKWARD)
        }
      })
      .onStopMoving(() => this.bot.idleAnimation())
      .idleAnimation()
      .setScale(0.2)
      .preset()

    this.bot.animation.mixer.addEventListener('finished', () => {
      if (this.enabled === false) {
        return
      }

      if (this.target && this.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
        this.bot.shootingAnimation()
        this._emmitBullet(engine)
      }
    })

    engine
      .add('bot', this.bot)
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
   * @param {Vector3} position
   * @returns {ControllerBot}
   */
  setPosition(position) {
    // this.bot.position.copy(position)
    // this.bot.position.setY(2)
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
  clearTarget() {
    this.target = null
    return this
  }

  /**
   * Use to set only one point.
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
   * @returns {ControllerBot}
   */
  clearPath() {
    this.bot.clearPath()
    return this
  }

  /**
   *
   * @param {Array.<Vector3>} points
   * @returns {ControllerBot}
   */
  setPath(points) {
    this.bot.setPath(points).playMoving()
    return this
  }

  /**
   *
   * @param {string} type
   * @returns {ControllerBot}
   */
  setPathType(type) {
    this.bot.setPathType(type)
    return this
  }
}