<script>
import WrapperView from '@components/WrapperView'
import Engine from '@scene/Engine'
import { Color, Vector3 } from 'three'
import Storm from '@scene/objects/Storm'
import SkyBox from '@scene/objects/SkyBox'
import Planet from '@scene/objects/Planet'
import Star from '@scene/objects/Star'
import LoadingTextures from '@scene/loading/LoadingTextures'
import AppRoutes from './../../routes/AppRoutes'
import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

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
  name: 'HomePage',
  computed: {
    menuItems: () => {
      return new AppRoutes().homePageMenuRoutes()
    },
  },
  data: () => {
    return {
      containerId: 'home-page'
    }
  },
  destroyed() {
    engine.destroy()
  },
  mounted() {
    engine = Engine.create(this.containerId)
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
        .preset(document.getElementById(this.containerId))
        .enableOutline(true)
        .registerEvents()
        .animate()

      engine.scene.add(sky)
      engine.scene.add(storm)
      storm.position.copy(stormPosition)

      engine.updates.push((delta) => {
        storm.update(delta)
        sky.setPosition(engine.mapControls.target).update(delta)

        engine.dirLight.position.copy(engine.camera.position)
        engine.pointLight.position.copy(engine.camera.position)
      })

      engine.createOutline({ visibleEdgeColor: new Color(0x6A9EE6) }).setMeshes(storm.lightningsMeshes)
      engine.createOutline({ visibleEdgeColor: new Color(0xFFFFFF), edgeGlow: 2.4, pulsePeriod: 20, edgeThickness: 4.4, edgeStrength: 1.5 }).setMeshes([planet])
    })
  },
  components: {
    WrapperView
  }
}
</script>

<template>
  <WrapperView :bgId="containerId">
    <div class="container-fluid">

      <div class="row p-2">
        <div class="col-md-6 col-lg-4 px-0" v-for="(item, index) in menuItems" :key="index">

          <div class="card flex-md-row box-shadow bg-dark m-2">
            <div class="card-body d-flex flex-column align-items-start p-2">

              <h3 class="mb-2">
                <RouterLink :to="{ name: item.name }" :key="index" v-slot="{ href, navigate }">
                  <a :href="href" @click="navigate" class="text-light">{{ item.title }}</a>
                </RouterLink>
              </h3>
              <p class="card-text mb-auto text-light">{{ item.description }}</p>

              <RouterLink :to="{ name: item.name }" :key="index" v-slot="{ href, navigate }">
                <a :href="href" @click="navigate" class="btn btn-dark border-light btn-sm">Open</a>
              </RouterLink>

            </div>
            <div>
              <img class="card-img-right flex-auto d-none d-md-block" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20250%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17196979987%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A13pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17196979987%22%3E%3Crect%20width%3D%22200%22%20height%3D%22250%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2255.6015625%22%20y%3D%22131%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" data-holder-rendered="true" style="width: 150px; height: 150px;">
            </div>
          </div>

        </div>

      </div>

    </div>
  </WrapperView>
</template>