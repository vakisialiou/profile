<script>
import WrapperView from '@components/WrapperView'
import Markdown from '@components/Markdown'
import 'github-markdown-css'
import DOCKER from './DOCKER.md'

let engine = null
export default {
  name: 'MarkdownPage',
  computed: {
    str: function () {
      switch (this.$route.params.md) {
        case 'docker':
          return DOCKER
        default:
          return '```Not data.```'
      }
    },
  },
  data: () => {
    return {
      containerId: 'markdown-page',
    }
  },
  components: {
    WrapperView, Markdown
  }
}
</script>

<template>
  <WrapperView :bgId="containerId">
    <Markdown v-if="str" :str="str" />
  </WrapperView>
</template>