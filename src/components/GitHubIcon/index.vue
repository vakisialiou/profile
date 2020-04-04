<script>
  import './index.less'
  import {
    BImg, BLink
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
      BImg, BLink
    }
  }
</script>

<template>
  <BLink :href="href" class="git-hub-icon git-hub-icon--bottom" target="_blank">
    <BImg src="/svg/git-hub.svg" />
  </BLink>
</template>
