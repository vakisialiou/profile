<script>
  import { BFormInput } from 'bootstrap-vue'

  export default {
    name: 'FormRangeVector3',
    components: { BFormInput },
    props: {
      label: {
        type: String,
        default: null
      },
      min: {
        type: Number,
        default: -1000
      },
      max: {
        type: Number,
        default: 1000
      },
      step: {
        type: Number,
        default: 10
      },
      value: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        model: {
          x: this.value.length > 0 ? this.value[0] : null,
          y: this.value.length > 0 ? this.value[1] : null,
          z: this.value.length > 0 ? this.value[2] : null,
        }
      }
    },
    methods: {
      input() {
        this.$emit('input', [Number(this.model.x), Number(this.model.y), Number(this.model.z)])
      },
      change() {
        this.$emit('change', [Number(this.model.x), Number(this.model.y), Number(this.model.z)])
      },
    }
  }
</script>

<template>
  <div>
    <label v-if="label">{{ label }}</label>

    <div class="row">
      <div class="col-12">
        <small class="text-dark font-weight-bold">x: {{ Number(model.x) }}</small>
        <BFormInput type="range" v-model="model.x" :min="min" :max="max" :step="step" key="0" @input="input" @change="change" />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <small class="text-dark font-weight-bold">y: {{ Number(model.y) }}</small>
        <BFormInput type="range" v-model="model.y" :min="min" :max="max" :step="step" key="1" @input="input" @change="change" />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <small class="text-dark font-weight-bold">z: {{ Number(model.z) }}</small>
        <BFormInput type="range" v-model="model.z" :min="min" :max="max" :step="step" key="2" @input="input" @change="change" />
      </div>
    </div>
  </div>
</template>
