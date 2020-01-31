import { Scene } from 'three'
import Map from './map/Map'
import Bot from './map/units/Bot'
import Charge from './map/units/Charge'

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
    this.map = new Map(scene)

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
   * @param {Object} rawMap
   * @returns {PlayController}
   */
  renderMap(rawMap) {
    this.map.preset(rawMap)
    for (const team of this.map.teams) {
      for (const tower of team.towers) {
        tower.destroyEvent(() => this.map.removeTower(tower))
      }
      for (const base of team.bases) {
        base.destroyEvent(() => this.map.removeBase(base))
      }
    }
    return this
  }

  /**
   *
   * @returns {PlayController}
   */
  renderWaveBots() {
    for (const team of this.map.teams) {
      if (team.defeat) {
        continue
      }
      for (const road of this.map.roads) {
        for (const base of team.bases) {
          const bot = new Bot(team, road.points, base.position)
          bot.shotEvent((shotOptions) => {
            const charge = new Charge(bot, shotOptions.position, shotOptions.direction)
            charge.collisionEvent((options) => {
              const hitBot = options.intersections[0]['object']
              hitBot.hit(charge)
              // console.log('collisionOptions', options, hitBot)
              charge.dispatchDestroyEvent()
            })

            charge.destroyEvent(() => this.map.removeCharge(charge))
            this.map.addCharge(charge)
          })
          bot.destroyEvent(() => this.map.removeBot(bot))
          this.map.addBot(bot)
        }
      }
    }
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {PlayController}
   */
  update(delta) {
    const teams = this.map.getTeams()
    if (teams.length === 1) {
      // Game finished
      return this
    }

    for (const bot of this.map.bots) {
      bot.update(delta)
      const units = this.map.getEnemyUnits(bot.team)
      bot.tryCaptureTarget(units)
    }

    for (const charge of this.map.charges) {
      const units = this.map.getEnemyUnits(charge.bot.team)
      charge.update(delta, units)
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