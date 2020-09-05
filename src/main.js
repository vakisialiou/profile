import Vue from 'vue'
import App from './App.vue'
import { IconsPlugin, VBTogglePlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(IconsPlugin)
Vue.use(VBTogglePlugin)
Vue.config.productionTip = process.env.NODE_ENV === 'production'

new Vue({
  render: h => h(App),
}).$mount('#index-container')
