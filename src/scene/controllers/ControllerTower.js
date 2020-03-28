import Loading from '@scene/loading/Loading'
import TowerEffect from '@scene/effects/TowerEffect'
import Tower from '@scene/units/Tower'
import { Vector3 } from 'three'

import { loading as loadingBullet, ControllerBullet } from './ControllerBullet'

const MODEL_TOWER = 'TOWER_MODEL_TOWER'
const AUDIO_TOWER_SHOT = 'TOWER_AUDIO_TOWER_SHOT'
const TEXTURE_SMOKE_PARTICLE = 'TOWER_TEXTURE_SMOKE_PARTICLE'

export const loading = new Loading()
  .addItem(Loading.TYPE_MODEL, MODEL_TOWER, '/models/tower/tower.glb')
  .addItem(Loading.TYPE_AUDIO, AUDIO_TOWER_SHOT, '/mp3/shot-1.mp3')
  .addItem(Loading.TYPE_TEXTURE, TEXTURE_SMOKE_PARTICLE, '/images/spe/smokeparticle.png')
  .addLoading(loadingBullet)

export class ControllerTower {
  /**
   *
   * @param {Loading} loader
   */
  constructor(loader) {
    this.loader = loader

    /**
     *
     * @type {TowerEffect}
     */
    this.towerEffect = new TowerEffect().createShootEffect(this.loader.getTexture(TEXTURE_SMOKE_PARTICLE))

    /**
     *
     * @type {Tower|Unit}
     */
    this.tower = new Tower(this.loader.getRawModel(MODEL_TOWER)).setScale(20)
  }

  /**
   *
   * @param {Engine} engine
   * @param {Array.<Object3D|Mesh|Group>} collisionObjects
   * @returns {ControllerTower}
   */
  preset(engine, collisionObjects = []) {
    engine
      .add('tower', this.tower) // Добавить на сцену башню.
      .add('tower-effect', this.towerEffect.getShootEffectMesh()) // Добавить на сцену эффекты

    const towerShotAudio = engine.createPositionalAudio(this.loader.getAudioBuffer(AUDIO_TOWER_SHOT))
    this.tower.add(towerShotAudio)

    this.tower.addEventListener(Tower.EVENT_ADD_BULLET, (event) => {
      const direction = event.gunOptions.model.getWorldDirection(new Vector3()).multiplyScalar(-1)
      const position = event.gunOptions.model.getWorldPosition(new Vector3())

      // Провацировать эффек выстрела.
      this.towerEffect.emmitShootEffect(position)

      new ControllerBullet(this.loader)
        .setPosition(position)
        .setDirection(direction)
        .preset(engine, collisionObjects)

      // Добавить звук выстрела
      if (!towerShotAudio.isPlaying) {
        towerShotAudio.setVolume(100)
        towerShotAudio.play()
      }
    })

    engine.updates.push((delta) => {
      this.tower.update(delta) // вращение башни
      this.towerEffect.update(delta)
    })
    return this
  }

  /**
   *
   * @param mesh
   * @returns {ControllerTower}
   */
  setTarget(mesh) {
    this.tower.setTarget(mesh)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {ControllerTower}
   */
  setPosition(position) {
    this.tower.setPosition(position)
    return this
  }
}