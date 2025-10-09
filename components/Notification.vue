<template>
  <div>
    <div style="font-size: 16px" class="fw-bold text-uppercase" v-html="title"></div>
    <div v-html="message"></div>
  </div>
</template>

<script>
export default {
  name: "Notification",
  props: {
    title: {default: null},
    message: {default: null},
    display: {default: false},
    timeout: {default: 2500}
  },
}
</script>

<style scoped>

</style>
