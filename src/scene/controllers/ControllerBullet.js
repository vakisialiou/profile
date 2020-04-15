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
      .createTraceEffect(loader.getTexture(TEXTURE_SMOKE_PARTICLE))

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
    const bulletCollisionAudio = engine.createPositionalAudio(this.loader.getAudioBuffer(AUDIO_BULLET_COLLISION))

    const update = (delta) => {
      this.bullet.update(delta)
      this.bulletEffect.update(delta)
      this.bulletEffect.emmitTraceEffect(this.bullet.position)
    }

    const destroy = () => {
      // Удалить снаряд со сцены.
      engine.remove(this.bullet)

      setTimeout(() => {
        // После завершения всех анимаций:
        // 1. Удалить обновление анимации эффектов т.к. снаряд уничтожен.
        engine.removeUpdate(update)
        // 2. Удалить объекты эффектов со сцены.
        engine.remove(this.bulletEffect.getShockWaveMesh())
        engine.remove(this.bulletEffect.getMistMesh())
        engine.remove(this.bulletEffect.getTraceMesh())
        engine.remove(bulletCollisionAudio)
      }, 6000)
    }

    this.bullet.setCollisionObjects(collisionObjects)
    this.bullet.addEventListener(Bullet.EVENT_DESTROY, () => destroy())

    this.bullet.addEventListener(Bullet.EVENT_COLLISION, () => {
      // Провацировать эффек взрывной волны.
      this.bulletEffect.emmitShockWaveEffect(this.bullet.position)
      // Провацировать дым.
      this.bulletEffect.emmitMistEffect(this.bullet.position)
      // Остановить эффек следа
      this.bulletEffect.stopTraceEffect()

      // Добавить звук попадания.
      engine.add('bullet-audio', bulletCollisionAudio)
      bulletCollisionAudio.position.copy(this.bullet.position)
      bulletCollisionAudio.setVolume(60)
      bulletCollisionAudio.play()

      destroy()
    })

    engine
      .add('bullet', this.bullet)
      .add('bullet-effect', this.bulletEffect.getShockWaveMesh())
      .add('bullet-effect', this.bulletEffect.getMistMesh())
      .add('bullet-effect', this.bulletEffect.getTraceMesh())

    engine.addUpdate(update)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {ControllerBullet}
   */
  setPosition(position) {
    this.bullet.setPosition(position)
    this.bulletEffect.emmitTraceEffect(position)
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