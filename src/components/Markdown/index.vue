<script>
  import './index.less'
  import showdown from 'showdown'

  const converter = new showdown.Converter()

  export default {
    name: 'Markdown',
    props: {
      height: {
        type: [String, Number],
        default: '100%'
      },
      str: {
        type: String,
        required: true
      }
    },
    computed: {
      htmlStyles: function () {
        return {
          height: typeof this.height === 'number' ? `${this.height}px` : this.height
        }
      },
      html: function () {
        return converter.makeHtml(this.str)
      }
    },
  }
</script>

<template>
  <article class="markdown-body" :style="htmlStyles" v-html="html" />
</template>
