<script>
import './index.less'
import Carousel from './containers/Carousel'
import WrapperView from '@components/WrapperView'
import Engine from '@scene/Engine'
import { Color, Vector3 } from 'three'
import Storm from '@scene/objects/Storm'
import SkyBox from '@scene/objects/SkyBox'
import Planet from '@scene/objects/Planet'
import Star from '@scene/objects/Star'
import LoadingTextures from '@scene/loading/LoadingTextures'

const textures = new LoadingTextures()
textures.addItem('sky-box-galaxy', '/images/galaxy/1.jpg')
textures.addItem('planet-1', '/images/planets/0.5k/1.jpg')
textures.addItem('star-1', '/images/stars/1.png')
textures.addItem('star-2', '/images/stars/2.png')
textures.addItem('star-3', '/images/stars/3.png')
textures.addItem('star-4', '/images/stars/4.png')
textures.addItem('star-5', '/images/stars/5.png')
textures.addItem('star-6', '/images/stars/6.png')
textures.addItem('star-7', '/images/stars/7.png')

let engine = null

export default {
  name: 'ProfilePage',
  data: () => {
    return {

    }
  },
  destroyed() {
    engine.destroy()
  },
  mounted() {
    engine = Engine.create('home-page-canvas')
    textures.preset().then(() => {
      const storm = new Storm(new Color(0x6A9EE6))
      const sky = new SkyBox(textures.getTexture('sky-box-galaxy'))

      const planet = new Planet(textures.getTexture('planet-1')).setPosition(new Vector3(300, - 160, 20))
      sky.addParticle(planet)
      sky.addParticle(new Star(textures.getTexture('star-1')).setScale(45).setPosition(new Vector3(600, 100, 200)))
      sky.addParticle(new Star(textures.getTexture('star-2')).setScale(45).setPosition(new Vector3(600, 100, -600)))
      sky.addParticle(new Star(textures.getTexture('star-3')).setScale(85).setPosition(new Vector3(300, -400, -900)))
      sky.addParticle(new Star(textures.getTexture('star-4')).setScale(65).setPosition(new Vector3(-300, 200, -900)))
      sky.addParticle(new Star(textures.getTexture('star-5')).setScale(75).setPosition(new Vector3(-700, 300, 700)))
      sky.addParticle(new Star(textures.getTexture('star-6')).setScale(400).setPosition(new Vector3(-200, -100, -900)))
      sky.addParticle(new Star(textures.getTexture('star-7')).setScale(80).setPosition(new Vector3(-900, -200, 800)))

      const stormPosition = new Vector3(0, 0, 0)
      const cameraPosition = new Vector3(0, 0, -600)

      engine
        .setDirLight(cameraPosition)
        .setPointLight(cameraPosition)
        .setCamera(cameraPosition, stormPosition)
        .enableAutoRotate(true)
        .enableMousePan(false)
        .enableMouseRotate(false)
        .enableMouseZoom(false)
        .preset(document.getElementById('home-page-canvas'))
        .enableOutline(true)
        .registerEvents()
        .animate()

      engine.scene.add(sky)
      engine.scene.add(storm)
      storm.position.copy(stormPosition)

      let i = 0
      engine.updates.push((delta) => {
        storm.update(delta)
        sky.setPosition(engine.mapControls.target).update(delta)

        engine.dirLight.position.copy(engine.camera.position)
        engine.pointLight.position.copy(engine.camera.position)
      })

      engine.createOutline(storm.lightningsMeshes, { visibleEdgeColor: new Color(0x6A9EE6) })
      engine.createOutline([planet], { visibleEdgeColor: new Color(0xFFFFFF), edgeGlow: 1.4, pulsePeriod: 20, edgeThickness: 4.4, edgeStrength: 1.5 })
    })
  },
  components: {
    WrapperView, Carousel
  }
}
</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="home-page-canvas" :autofill="true" />
    <WrapperView class="home-page-content d-none d-md-block" :autofill="true">
      <Carousel />
    </WrapperView>
  </WrapperView>
</template>