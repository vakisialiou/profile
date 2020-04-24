<script>
  import {
    BImg, BButton
  } from 'bootstrap-vue'

  export default {
    name: 'GitHubIcon',
    props: {
      domain: {
        type: String,
        default: 'https://github.com'
      },
      user: {
        type: String,
        default: 'kiselyou'
      },
      repository: {
        type: String,
        default: 'profile'
      },
      path: {
        type: String,
        required: true
      },
    },
    computed: {
      href: function () {
        return `${this.domain}/${this.user}/${this.repository}/tree/master/${this.path}`
      }
    },
    components: {
      BImg, BButton
    }
  }
</script>

<template>
  <BButton :href="href" size="sm" variant="link" target="_blank">
    <BImg src="/svg/git-hub.svg" :style="{ width: '30px', }" />
  </BButton>
</template>
