import { PlaneBufferGeometry } from 'three'
import { Fire } from 'three/examples/jsm/objects/Fire'

export default class Bonfire extends Fire {
  constructor() {
    const plane = new PlaneBufferGeometry( 20, 20 )
    super(plane, {
      textureWidth: 512,
      textureHeight: 512,
      debug: false
    })

    // this.debug = true
    // this.textureWidth = 512
    // this.textureHeight = 512
    this.color1.set(0xffdcaa)
    this.color2.set(0xffa000)
    this.color3.set(0x000000)
    this.windX = 0.0
    this.windY = 0.75
    this.colorBias = 0.9
    this.burnRate = 1.0
    this.diffuse = 1.33
    this.viscosity = 0.25
    this.expansion = 0.0
    this.swirl = 50.0
    this.drag = 0.35
    this.airSpeed = 10.0
    this.speed = 500.0
    this.massConservation = false

    this.clearSources();
    this.addSource( 0.45, 0.1, 0.1, 0.5, 0.0, 1.0 );
    this.addSource( 0.55, 0.1, 0.1, 0.5, 0.0, 1.0 );
  }
}