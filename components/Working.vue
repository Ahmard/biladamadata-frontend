<template>
  <v-overlay :value="value" class="text-warning">
    <v-progress-circular
      indeterminate
      size="120"
      color="primary"
      width="5"
    >
      <h5 v-html="message" class="text-warning fw-bold"></h5>
    </v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: "Working",
  props: {
    value: {default: true},
    message: {default: '<i class="fw-bold">Working</i>'},
  }
}
</script>

<style scoped>

</style>
