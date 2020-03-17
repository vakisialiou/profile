import { SPE } from '@scene/libs/SPE'
import { AdditiveBlending, Color, Vector3 } from 'three'

export default class TowerEffect {
  constructor() {

    this.shootEffectSettings = {
      type: SPE.distributions.SPHERE,
      position: {
        spread: new Vector3(10),
        radius: 1,
      },
      velocity: {
        value: new Vector3( 10 )
      },
      size: {
        value: [ 30, 0 ]
      },
      opacity: {
        value: [1, 0]
      },
      color: {
        value: [new Color('yellow'), new Color('red')]
      },
      particleCount: 10,
      alive: true,
      duration: 0.05,
      maxAge: {
        value: 0.5
      }
    };

    this.groups = {}
  }

  /**
   *
   * @param {string} groupName
   * @param {Texture} texture
   * @returns {TowerEffect}
   */
  createShootEffect(groupName, texture) {
    if (this.groups.hasOwnProperty(groupName)) {
      throw new Error(`Effect '${groupName}' has already created in TowerEffects`)
    }
    const particleGroup = new SPE.Group({
      texture: { value: texture },
      blending: AdditiveBlending,
      maxParticleCount: 200
    })

    particleGroup.addPool(10, this.shootEffectSettings, false)
    this.groups[groupName] = particleGroup
    return this
  }

  /**
   *
   * @param {string} groupName
   * @param {Vector3} position
   * @returns {TowerEffect}
   */
  emmitEffect(groupName, position) {
    if (!this.groups.hasOwnProperty(groupName)) {
      throw Error(`Unknown group ${groupName}. Look at TowerEffects.emmitEffect`)
    }

    const particleGroup = this.groups[groupName]
    particleGroup.triggerPoolEmitter(1, position)
    return this
  }

  /**
   *
   * @param groupName
   * @returns {Mesh}
   */
  getMesh(groupName) {
    if (!this.groups.hasOwnProperty(groupName)) {
      throw Error(`Unknown group ${groupName}. Look at TowerEffects.getMesh`)
    }
    return this.groups[groupName]['mesh']
  }

  /**
   *
   * @param {number} delta
   * @returns {TowerEffect}
   */
  update(delta) {
    for (const groupName in this.groups) {
      if (!this.groups.hasOwnProperty(groupName)) {
        continue
      }
      const particleGroup = this.groups[groupName]
      particleGroup.tick(delta)
    }
    return this
  }
}