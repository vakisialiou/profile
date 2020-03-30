import Bullet from '@scene/units/Bullet'
import Loading from '@scene/loading/Loading'
import BulletEffect from '@scene/effects/BulletEffect'

const AUDIO_BULLET_COLLISION = 'BULLET_AUDIO_BULLET_COLLISION'
const TEXTURE_SMOKE_PARTICLE = 'BULLET_TEXTURE_SMOKE_PARTICLE'

export const loading = new Loading()
  .addItem(Loading.TYPE_AUDIO, AUDIO_BULLET_COLLISION, '/mp3/collision-1.mp3')
  .addItem(Loading.TYPE_TEXTURE, TEXTURE_SMOKE_PARTICLE, '/images/spe/smokeparticle.png')

export class ControllerBullet {
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
     * @type {BulletEffect}
     */
    this.bulletEffect = new BulletEffect()
      .createShockWaveEffect(loader.getTexture(TEXTURE_SMOKE_PARTICLE))
      .createMistEffect(loader.getTexture(TEXTURE_SMOKE_PARTICLE))

    /**
     *
     * @type {Bullet}
     */
    this.bullet = new Bullet()
  }

  /**
   * @param {Engine} engine
   * @param {Array.<Object3D|Mesh|Group>} collisionObjects
   * @returns {ControllerBullet}
   */
  preset(engine, collisionObjects = []) {
    this.bullet.setCollisionObjects(collisionObjects)
    this.bullet.addEventListener(Bullet.EVENT_DESTROY, () => engine.remove(this.bullet))

    const bulletCollisionAudio = engine.createPositionalAudio(this.loader.getAudioBuffer(AUDIO_BULLET_COLLISION))
    this.bullet.add(bulletCollisionAudio)

    this.bullet.addEventListener(Bullet.EVENT_COLLISION, () => {
      // Провацировать эффек взрывной волны.
      this.bulletEffect.emmitShockWaveEffect(this.bullet.position)
      // Провацировать дыма.
      this.bulletEffect.emmitMistEffect(this.bullet.position)
      // Удалить снаряд, он уже не нужен.
      engine.remove(this.bullet)
      // Добавить звук попадания
      if (!bulletCollisionAudio.isPlaying) {
        bulletCollisionAudio.setVolume(60)
        bulletCollisionAudio.play()
      }
    })

    engine
      .add('bullet', this.bullet)
      .add('bullet-effect', this.bulletEffect.getShockWaveMesh())
      .add('bullet-effect', this.bulletEffect.getMistMesh())

    engine.updates.push((delta) => {
      this.bullet.update(delta)
      this.bulletEffect.update(delta)
    })

    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {ControllerBullet}
   */
  setPosition(position) {
    this.bullet.setPosition(position)
    return this
  }

  /**
   *
   * @param {Vector3} direction
   * @returns {ControllerBullet}
   */
  setDirection(direction) {
    this.bullet.setDirection(direction)
    return this
  }
}