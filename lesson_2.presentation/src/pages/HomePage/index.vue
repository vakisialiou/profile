<script>
import './index.css'
import WrapperFreeArea from './../../components/WrapperFreeArea'
import Engine from './../../scene/Engine'
import { Color, TextureLoader, Vector3 } from 'three'
import Storm from '../../scene/objects/Storm'
import SkyBox from '../../scene/objects/SkyBox'
import Planet from '../../scene/objects/Planet'
import Star from '../../scene/objects/Star'

const engine = Engine.get()
const storm = new Storm(new Color(0x6A9EE6))
const sky = new SkyBox(new TextureLoader().load('/images/galaxy/1.jpg'))

const texturePlanet = new TextureLoader().load('/images/planets/0.5k/1.jpg')
sky.addParticle(new Planet(texturePlanet))

const textureStar1 = new TextureLoader().load('/images/stars/1.png')
sky.addParticle(new Star(textureStar1).setScale(45).setPosition(new Vector3(600, 100, 200)))

const textureStar2 = new TextureLoader().load('/images/stars/2.png')
sky.addParticle(new Star(textureStar2).setScale(45).setPosition(new Vector3(600, 100, -600)))

const textureStar3 = new TextureLoader().load('/images/stars/3.png')
sky.addParticle(new Star(textureStar3).setScale(85).setPosition(new Vector3(300, -400, -900)))

const textureStar4 = new TextureLoader().load('/images/stars/4.png')
sky.addParticle(new Star(textureStar4).setScale(65).setPosition(new Vector3(-300, 200, -900)))

const textureStar5 = new TextureLoader().load('/images/stars/5.png')
sky.addParticle(new Star(textureStar5).setScale(75).setPosition(new Vector3(-700, 300, 700)))

const textureStar6 = new TextureLoader().load('/images/stars/6.png')
sky.addParticle(new Star(textureStar6).setScale(400).setPosition(new Vector3(-200, -100, -900)))

const textureStar7 = new TextureLoader().load('/images/stars/7.png')
sky.addParticle(new Star(textureStar7).setScale(80).setPosition(new Vector3(-900, -200, 800)))

export default {
  name: 'HomePage',
  data: () => {
    return {

    }
  },
  mounted() {
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
        .registerEvents()
        .animate()

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