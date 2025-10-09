<template>
  <div :class="controlClass" class="card-header bg-white text-uppercase border-bottom border-light d-flex justify-content-between">
    <div class="mb-0">
      <slot name="title" class="text-uppercase fw-bold"></slot>
    </div>
    <div>
      <div v-if="loading">
        <Spinner color="primary" class="ms-3" :spin="loading" v-if="useSpinner"/>
        <span class="text-primary" v-html="loadingMessage"></span>
        <span class="text-primary" v-if="!useSpinner">...</span>
      </div>

      <small v-if="!loading" class="text-muted float-end">
        <slot name="desc"></slot>
      </small>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardHeader",
  props: {
    loading: {
      default: false
    },
    hasControls: {
      default: true
    },
    useSpinner: {
      default: true
    },
    loadingMessage: {
      default: 'fetching information'
    },
  },
  data(){
    return {
      controlClass: ''
    }
  },
  mounted() {
    this.controlClass = this.hasControls ? 'card-header-control' : ''
  }
}
</script>

<style scoped>

</style>
