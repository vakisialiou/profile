<script>
import './index.css'
import { BCarousel, BCarouselSlide, BImg, BRow, BCol, BBadge } from 'bootstrap-vue'


export default {
  name: 'Carousel',
  data: () => {
    return {
      slide: 0,
      sliding: null,
    }
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    }
  },
  components: {
    BCarousel, BCarouselSlide, BImg, BRow, BCol, BBadge
  }
}
</script>

<template>
  <div id="hp-container">
    <div id="hp-container-carousel">
      <BCarousel
        v-model="slide"
        :interval="18000"
        controls
        indicators
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <BCarouselSlide
          caption="Valery Kiseliou"
          text="Full Stack Engineer at Big Data Technologies."
          class="hp-carousel-slide"
        >
          <div class="hp-carousel-slide-content">
            <br/>
            <BImg src="/images/pages/home-page/hello.svg" />
          </div>
        </BCarouselSlide>

        <BCarouselSlide
          caption="Technical Skills"
          class="hp-carousel-slide"
        >
          <div class="hp-carousel-slide-content">
            <BRow>
              <BCol>
                <div class="m-4" />
                <div class="m-2">NodeJS: <span class="text-muted">Express, Socket.io</span></div>
                <div class="m-2">Front-end: <span class="text-muted">Less, Bootstrap 3|4, CSS, HTML</span></div>
                <div class="m-2">JavaScript: <span class="text-muted">React, Vue, Three.js, WebPack, Gulp (es 6)</span></div>
                <div class="m-2">Databases: <span class="text-muted">MySQL, PostgreSQL, Oracle, SQLite, MongoDB, Redis</span></div>
                <div class="m-2">Services: <span class="text-muted">Beanstalkd, AWS, SQS</span></div>
                <div class="m-2">PHP: <span class="text-muted">Sumfony, Yii2, Laravel</span></div>
                <div class="m-2">OS: <span class="text-muted">Linux, Docker</span></div>
                <div class="m-2">Mobile: <span class="text-muted">Java, Cordova.js</span></div>
              </BCol>
            </BRow>
          </div>
        </BCarouselSlide>

        <BCarouselSlide
          caption="Work experience"
          class="hp-carousel-slide"
        >
          <div class="hp-carousel-slide-content">
            <BRow>
              <BCol>
                <div class="m-4" />
                <div class="m-2">
                  <b>Full Stack Engineer:</b> Big Data Technologies
                  <div class="text-muted">Jan 2018 – Present time</div>
                </div>

                <div class="m-2">
                  <b>Mentor:</b> IT Academy
                  <div class="text-muted">Oct 2017 – Mar 2018</div>
                </div>

                <div class="m-2">
                  <b>PHP developer:</b> Aristek Systems
                  <div class="text-muted">Jan 2016 – Jan 2018</div>
                </div>

                <div class="m-2">
                  <b>PHP developer:</b> Protobase Laboratories
                  <div class="text-muted">Jan 2015 – Jan 2016</div>
                </div>
              </BCol>
            </BRow>
          </div>
        </BCarouselSlide>

        <BCarouselSlide class="hp-carousel-slide">
          <div class="hp-carousel-slide-content">
            <BRow>
              <BCol class="mt-5">
                <h4 class="mt-lg-5">Contact</h4>
                <div>v.a.kiselyov@gmail.com</div>
                <div class="m-2 text-muted">
                  <a href="https://github.com/kiselyou" target="_blank" class="text-muted">Github</a>
                  <span class="text-muted"> / </span>
                  <a href="https://www.linkedin.com/in/valery-kiseliou-b17287a3/" target="_blank" class="text-muted">LinkedIn</a>
                  <span class="text-muted"> / </span>
                  <a href="https://t.me/valery_kisliou" target="_blank" class="text-muted">Telegram</a>
                </div>
              </BCol>
            </BRow>
          </div>
        </BCarouselSlide>

      </BCarousel>
    </div>
  </div>
</template>