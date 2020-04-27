import { Water } from 'three/examples/jsm/objects/Water'
import { Group, RepeatWrapping, Vector3 } from 'three'

export default class WaterPieces extends Group {
  constructor() {
    super()

    /**
     *
     * @type {Water[]}
     */
    this.waterPieces = []
  }

  /**
   *
   * @param {BufferGeometry} geometry
   * @param {Texture} texture
   * @param {Vector3} sunDirection
   * @returns {Water}
   */
  renderWater(geometry, texture, sunDirection) {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping

    const water = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: texture,
      alpha: 1.0,
      sunDirection: sunDirection,
      sunColor: 0xffffff,
      waterColor: 0x00BEFF,
      distortionScale: 3.7,
      fog: false
    })

    water.rotation.x = - Math.PI / 2
    this.waterPieces.push(water)
    this.add(water)
    return water
  }

  /**
   *
   * @returns {WaterPieces}
   */
  update() {
    for (const water of this.waterPieces) {
      water.material.uniforms['time'].value += 1.0 / 60.0
    }
    return this
  }
}