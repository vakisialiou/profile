<script>
import './index.css'
import WrapperFreeArea from './../../components/WrapperFreeArea'
import Engine from './../../scene/Engine'
import { Color, Vector3 } from 'three'
import Storm from '../../scene/objects/Storm'
import SkyBox from '../../scene/objects/SkyBox'
import Planet from '../../scene/objects/Planet'
import Star from '../../scene/objects/Star'
import LoadingTextures from './../../scene/loading/LoadingTextures'

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

const engine = Engine.get()

export default {
  name: 'HomePage',
  data: () => {
    return {

    }
  },
  activated() {
    engine.registerEvents().animate()
  },
  deactivated() {
    engine.destroy()
  },
  destroyed() {
    engine.destroy()
  },
  mounted() {
    textures.presetTextures().then(() => {
      const storm = new Storm(new Color(0x6A9EE6))
      const sky = new SkyBox(textures.get('sky-box-galaxy'))

      sky.addParticle(new Planet(textures.get('planet-1')))
      sky.addParticle(new Star(textures.get('star-1')).setScale(45).setPosition(new Vector3(600, 100, 200)))
      sky.addParticle(new Star(textures.get('star-2')).setScale(45).setPosition(new Vector3(600, 100, -600)))
      sky.addParticle(new Star(textures.get('star-3')).setScale(85).setPosition(new Vector3(300, -400, -900)))
      sky.addParticle(new Star(textures.get('star-4')).setScale(65).setPosition(new Vector3(-300, 200, -900)))
      sky.addParticle(new Star(textures.get('star-5')).setScale(75).setPosition(new Vector3(-700, 300, 700)))
      sky.addParticle(new Star(textures.get('star-6')).setScale(400).setPosition(new Vector3(-200, -100, -900)))
      sky.addParticle(new Star(textures.get('star-7')).setScale(80).setPosition(new Vector3(-900, -200, 800)))

      const stormPosition = new Vector3(0, 0, 0)
      const cameraPosition = new Vector3(-600, 0, 600)
      engine.preset().then(() => {
        engine
          .setDirLight()
          .setHemiLight()
          .setPointLight()
          .setCamera(cameraPosition, stormPosition)
          .enableAutoRotate(true)
          .enableMousePan(false)
          .enableMouseRotate(false)
          .enableMouseZoom(false)
          .render(document.getElementById('home-page-canvas'))

        engine.scene.add(sky)
        engine.scene.add(storm)
        storm.position.copy(stormPosition)
        engine.updates.push((delta) => {
          storm.update(delta)
          sky.setPosition(engine.mapControls.target).update(delta)
        })

        engine.createOutline(storm.lightningsMeshes, new Color(0x6A9EE6))
        engine.createOutline(sky.planets, new Color(0xFFFFFF))
      })
    })
  },
  components: {
    WrapperFreeArea
  }
}
</script>

<template>
  <WrapperFreeArea>
    <WrapperFreeArea id="home-page-canvas" />
    <WrapperFreeArea class="home-page-content">
      Home page
    </WrapperFreeArea>
  </WrapperFreeArea>
</template>