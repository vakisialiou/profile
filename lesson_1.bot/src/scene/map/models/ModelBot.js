import { CylinderGeometry, MeshBasicMaterial, Group, ObjectLoader, AnimationMixer } from 'three'
import Model from './base/Model'
import ModelOptionsBot from './base/ModelOptionsBot'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import AnimationBot from './animation/AnimationBot'

export default class ModelBot extends Model {
  /**
   *
   * @param {Team} team
   * @param {GLTF} gltf
   */
  constructor(team, gltf) {
    super(team, new ModelOptionsBot().setHealth(200))

    /**
     *
     * @type {CylinderGeometry}
     */
    this.geometry = new CylinderGeometry(2, 2, 10)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color, transparent: true, opacity: 0 })

    /**
     *
     * @type {AnimationBot}
     */
    this.animation = new AnimationBot(gltf)

    // this.updates = []

//     const loader = new GLTFLoader()
//     loader.load('/models/bot.glb', (gltf) => {
//       const model = gltf.scene.children[0]
//       model.scale.set(0.1, 0.1, 0.1)
//       this.add(model)
// // console.log(gltf.scene.children, gltf.animations)
//       const mixer = new AnimationMixer(model)
//       const actionWalk = mixer.clipAction(gltf.animations[0])
//       actionWalk.enabled = true
//       actionWalk.setEffectiveTimeScale(1)
//       actionWalk.setEffectiveWeight(1)
//       actionWalk.play()
//
//       const actionShot = mixer.clipAction(gltf.animations[1])
//
//       setTimeout(() => {
//         actionWalk.paused = false
//         actionShot.paused = false
//         actionShot.enabled = true
//         actionShot.setEffectiveTimeScale(1)
//         actionShot.setEffectiveWeight(1)
//         actionShot.time = 0
//         actionWalk.crossFadeTo(actionShot, 0.4, true)
//         actionShot.play()
//       }, 10000)
//
//       const actionDying = mixer.clipAction(gltf.animations[2])
//
//       setTimeout(() => {
//         actionShot.paused = false
//         actionDying.paused = false
//         actionDying.enabled = true
//         actionDying.setEffectiveTimeScale(1)
//         actionDying.setEffectiveWeight(1)
//         actionDying.time = 0
//         actionShot.crossFadeTo(actionDying, 0.4, true)
//         actionDying.play()
//       }, 20000)
//
//       this.updates.push((delta) => {
//         mixer.update(delta)
//       })
//     })

    gltf.model.scale.set(0.1, 0.1, 0.1)
    this.add(gltf.model)
  }

  update(delta) {
    this.animation.update(delta)
  }
}