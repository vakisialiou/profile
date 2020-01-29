import { Scene, Vector3 } from 'three'
import Map from './map/Map'
import Bot from './map/Bot'
import Charge from './map/Charge'

export default class PlayController {
  /**
   *
   * @param {Scene} scene
   */
  constructor(scene) {
    /**
     *
     * @type {Scene}
     */
    this.scene = scene

    /**
     *
     * @type {Map}
     */
    this.map = new Map()

    /**
     *
     * @type {Array.<Bot>}
     */
    this.bots = []

    /**
     *
     * @type {Array.<Charge>}
     */
    this.charges = []

    /**
     *
     * @type {{tmp: number, interval: number, enabled: boolean}}
     */
    this.waveBotsOptions = { interval: 30, enabled: false, tmp: 0 }
  }

  /**
   *
   * @param {Bot} bot
   * @returns {PlayController}
   */
  addBot(bot) {
    if (!this.bots.includes(bot)) {
      this.bots.push(bot)
      this.scene.add(bot)
    }
    return this
  }

  /**
   *
   * @param {Bot} bot
   * @returns {PlayController}
   */
  removeBot(bot) {
    const index = this.bots.indexOf(bot)
    if (index !== -1) {
      this.bots.splice(index, 1)
      this.scene.remove(bot)
    }
    return this
  }

  /**
   *
   * @param {Charge} charge
   * @returns {PlayController}
   */
  addCharge(charge) {
    if (!this.charges.includes(charge)) {
      this.charges.push(charge)
      this.scene.add(charge)
    }
    return this
  }

  /**
   *
   * @param {Charge} charge
   * @returns {PlayController}
   */
  removeCharge(charge) {
    const index = this.charges.indexOf(charge)
    if (index !== -1) {
      this.charges.splice(index, 1)
      this.scene.remove(charge)
    }
    return this
  }

  /**
   *
   * @param {Object} rawMap
   * @returns {PlayController}
   */
  renderMap(rawMap) {
    this.map.preset(rawMap)
    for (const team of this.map.teams) {
      this.scene.add(team.base)
      for (const tower of team.towers) {
        this.scene.add(tower)
      }
    }

    for (const road of this.map.roads) {
      this.scene.add(road)
    }
    return this
  }

  /**
   *
   * @returns {PlayController}
   */
  startRenderWaveBots() {
    this.waveBotsOptions.enabled = true
    this.waveBotsOptions.tmp = 0
    return this
  }

  /**
   *
   * @returns {PlayController}
   */
  stopRenderWaveBots() {
    this.waveBotsOptions.enabled = false
    this.waveBotsOptions.tmp = 0
    return this
  }

  /**
   *
   * @returns {PlayController}
   */
  renderWaveBots() {
    for (const team of this.map.teams) {
      for (const road of this.map.roads) {
        const bot = new Bot(team, road.points, team.base.position)
        bot.shotEvent((shotOptions) => {
          const charge = new Charge(bot, shotOptions.position, shotOptions.direction)
          charge.collisionEvent((options) => {
            const hitBot = options.intersections[0]['object']
            hitBot.hit(charge)
            // console.log('collisionOptions', options, hitBot)
            charge.dispatchDestroyEvent()
          })

          charge.destroyEvent(() => this.removeCharge(charge))
          this.addCharge(charge)
        })
        bot.destroyEvent(() => this.removeBot(bot))
        this.addBot(bot)
      }
    }
    return this
  }

  /**
   *
   * @param {Team} activeTeam
   * @returns {Bot[]}
   */
  getEnemyBots(activeTeam) {
    return this.bots.filter((bot) => bot.team.name !== activeTeam.name)
  }

  /**
   *
   * @param {Team} activeTeam
   * @returns {(ModelBase|ModelTower)[]}
   */
  getEnemyBuilds(activeTeam) {
    let builds = []
    for (const team of this.map.teams) {
      if (team.name === activeTeam.name) {
        continue
      }
      builds = builds.concat(team.towers)
      builds.push(team.base)
    }
    return builds
  }

  /**
   *
   * @param {number} delta
   * @returns {PlayController}
   */
  update(delta) {
    for (const bot of this.bots) {
      bot.update(delta)
      const bots = this.getEnemyBots(bot.team)
      const builds = this.getEnemyBuilds(bot.team)
      bot.tryCaptureTarget(bots, builds)
    }

    for (const charge of this.charges) {
      const bots = this.getEnemyBots(charge.bot.team)
      const builds = this.getEnemyBuilds(charge.bot.team)
      charge.update(delta, [...bots, ...builds])
    }

    if (!this.waveBotsOptions.enabled) {
      return this
    }
    this.waveBotsOptions.tmp += delta
    if (this.waveBotsOptions.tmp >= this.waveBotsOptions.interval) {
      this.waveBotsOptions.tmp = 0
      this.renderWaveBots()
    }
    return this
  }
}