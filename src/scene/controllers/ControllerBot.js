import Bot from '@scene/units/Bot'
import Loading from '@scene/loading/Loading'

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

  }

  /**
   * @param {Engine} engine
   * @param {Array.<Object3D|Mesh|Group>} collisionObjects
   * @returns {ControllerBot}
   */
  preset(engine, collisionObjects = []) {
    this.bot
      .setScale(20)
      .preset()
      .idleAnimation()

    engine.add('bot', this.bot)

    engine.addUpdate((delta) => {
      this.bot.update(delta)
    })
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {ControllerBot}
   */
  setPosition(position) {
    this.bot.setPosition(position)
    return this
  }

  /**
   *
   * @param {Vector3} direction
   * @returns {ControllerBot}
   */
  setDirection(direction) {
    this.bot.setDirection(direction)
    return this
  }
}