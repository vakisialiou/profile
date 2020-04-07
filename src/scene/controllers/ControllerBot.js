import Bot from '@scene/units/Bot'
import Loading from '@scene/loading/Loading'

import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three'

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

    const geometry = new BoxGeometry(10, 10, 10)
    const material = new MeshBasicMaterial({ color: 0xcccccc })
    this.bot.point = new Mesh(geometry, material)

  }

  /**
   * @param {Engine} engine
   * @param {Array.<Object3D|Mesh|Group>} collisionObjects
   * @returns {ControllerBot}
   */
  preset(engine, collisionObjects = []) {
    this.bot.setScale(20).preset().idleAnimation()

    engine.add('bot', this.bot)
    engine.add('bot-helper', this.bot.point)

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
   * @param {Vector3} p
   * @returns {ControllerBot}
   */
  setPoint(p) {
    this.bot.setPoint(p)
    return this
  }
}