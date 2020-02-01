import {Scene, Mesh, SphereGeometry, CylinderGeometry, MeshBasicMaterial, PlaneGeometry, Vector3, DoubleSide} from 'three'
import { World } from 'oimo'
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

    /**
     *
     * @type {World}
     */
    this.world = new World({
      timestep: 1 / 60,
      iterations: 8,
      broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
      worldscale: 1, // scale full world
      random: true,  // randomize sample
      info: false,   // calculate statistic or not
      gravity: [0, -59.8, 0],
    })

    const geom = new CylinderGeometry(10, 10, 32)
    const mat = new MeshBasicMaterial({ color: 0x299806 })
    this._mesh = new Mesh(geom, mat)
    this.scene.add(this._mesh)

    this._body = this.world.add({
      type:'cylinder', // type of shape : sphere, box, cylinder
      size:[10,32,10], // size of shape
      pos:[0,150,0], // start position in degree
      rot:[0,0,0], // start rotation in degree
      move:true, // dynamic or statique
      density: 1,
      friction: 0.2,
      restitution: 0.2,
      belongsTo: 1, // The bits of the collision groups to which the shape belongs.
      collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
    })

    this._m = []
    this._b = []

    // let i = 0
    // const id = setInterval(() => {
    //   const geom = new SphereGeometry(10, 32, 32)
    //   const mat = new MeshBasicMaterial({ color: 0x299806 })
    //   const mesh = new Mesh(geom, mat)
    //   this._m.push(mesh)
    //   this.scene.add(mesh)
    //
    //   const b = this.world.add({
    //     type:'sphere', // type of shape : sphere, box, cylinder
    //     size:[10,10,10], // size of shape
    //     pos:[0,150,0], // start position in degree
    //     rot:[0,0,0], // start rotation in degree
    //     move:true, // dynamic or statique
    //     density: 1,
    //     friction: 0.2,
    //     restitution: 0.2,
    //     belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    //     collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
    //   })
    //   this._b.push(b)
    //
    //   i++
    //   if (i > 5) {
    //     clearInterval(id)
    //   }
    //
    // }, 1000)


    const geomGr = new PlaneGeometry(1000, 1000)
    const matGr = new MeshBasicMaterial({ color: 0x666666, side: DoubleSide, opacity: 0.9, transparent: true })
    this._meshGr = new Mesh(geomGr, matGr)
    this._meshGr.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2)
    // this._ground = this.world.add({type:'plane', pos:[0,0,0], density:1, friction:0.9, restitution:0.9 });
    this._ground = this.world.add({size:[1000, 0.1, 1000], pos:[0,0,0], rot:[0,0,0], density:1 });
    // this.scene.add(this._meshGr)
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
    this.world.step()
    this._mesh.position.copy(this._body.getPosition())
    this._mesh.quaternion.copy(this._body.getQuaternion())

    for (let i = 0; i < this._m.length; i++) {
      this._m[i].position.copy(this._b[i].getPosition())
      this._m[i].quaternion.copy(this._b[i].getQuaternion())
    }

    // this._meshGr.position.copy(this._ground.getPosition())

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