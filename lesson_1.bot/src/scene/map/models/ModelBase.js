import { BoxGeometry, MeshBasicMaterial } from 'three'
import Model from './base/Model'
import ModelOptionsBase from './base/ModelOptionsBase'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class ModelBase extends Model {
  /**
   *
   * @param {Team} team
   */
  constructor(team) {
    super(team, new ModelOptionsBase().setHealth(800))

    /**
     *
     * @type {BoxGeometry}
     */
    this.geometry = new BoxGeometry(60, 10, 60)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color, transparent: true, opacity: 0 })

    const loader = new GLTFLoader()
    loader.load('/models/base.glb', (glb) => {
      const mesh = glb.scene.children[0]
      mesh.scale.set(15,15,15)
      // console.log(mesh)
      this.add(mesh)
      this.position.setY(0)
    })
  }
}