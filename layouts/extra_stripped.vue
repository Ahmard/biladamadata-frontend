<template>
  <Nuxt />
</template>

<script>
import {initMisc} from "~/plugins/helpers/misc";

export default {
  name: "extra_stripped",
  mounted() {
    initMisc(this.$nuxt, window.$)
  }
}
</script>

<style scoped>

</style>
