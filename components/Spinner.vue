<template>
  <div :class="`text-${color} ${smallIcon ? 'spinner-border-sm' : 'spinner-border'}`" class="spinner-border" role="status" v-if="spin">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<script>
export default {
  name: "Spinner",
  props: {
    spin: {
      default: true
    },
    smallIcon: {
      default: true
    },
    color: {
      default: 'azure'
    },
  }
}
</script>
