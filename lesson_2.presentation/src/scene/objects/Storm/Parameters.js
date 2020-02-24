import { Vector3 } from 'three'

const rayDirection = new Vector3(0, - 1, 0)
const vec1 = new Vector3()
const vec2 = new Vector3()

export default class Parameters {
  constructor() {
    this.radius0 = 1
    this.radius1 = 0.5
    this.minRadius = 0.3
    this.maxIterations = 7
    this.timeScale = 0.15
    this.propagationTimeFactor = 0.2
    this.vanishingTimeFactor = 0.9
    this.subrayPeriod = 4
    this.subrayDutyCycle = 0.6
    this.maxSubrayRecursion = 3
    this.ramification = 3
    this.recursionProbability = 0.4
    this.roughness = 0.85
    this.straightness = 0.65
  }

  onSubrayCreation(segment, parentSubray, childSubray, lightningStrike) {
      lightningStrike.subrayConePosition(segment, parentSubray, childSubray, 0.6, 0.6, 0.5)

      // Plane projection

      vec1.subVectors(childSubray.pos1, lightningStrike.rayParameters.sourceOffset)
      const proj = rayDirection.dot(vec1)
      vec2.copy(rayDirection).multiplyScalar(proj)
      vec1.sub(vec2)

      const rayLength = lightningStrike.rayParameters.sourceOffset.y
      const scale = proj / rayLength > 0.5 ? rayLength / proj : 1
      vec2.multiplyScalar(scale)
      vec1.add(vec2)

      childSubray.pos1.addVectors(vec1, lightningStrike.rayParameters.sourceOffset)
    }
}