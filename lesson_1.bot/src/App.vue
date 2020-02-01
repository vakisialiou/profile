<template>
  <div id="app">
    <HelloWorld msg="Welcome to Lesson 1 App"/>
    <div id="container" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Engine from './scene/Engine'
import { Vector3 } from 'three'
import { map } from './map'

const engine = Engine.get()

export default {
  name: 'app',
  mounted: function () {
    const container = document.getElementById('container')
    const lightPosition = new Vector3(70, 70, 70)
    const cameraPosition = new Vector3(100, 100, 100)
    engine
      .setDirLight(lightPosition)
      .setHemiLight(lightPosition)
      .setPointLight(lightPosition)
      .setCamera(cameraPosition, lightPosition)
      .startPlay(map)
      .render(container)
      .setLightHelper()
      .renderDebugPanel()
      .setAxesHelper(500)
      .registerEvents()
      .animate()
  },
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#container {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
