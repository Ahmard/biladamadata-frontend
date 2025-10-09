<template>
  <div class="card-body">
    <slot />
  </div>
</template>

<script>
import {reinitializeDropdowns} from "~/plugins/helpers/misc";

export default {
  name: "CardBody",
  mounted() {
    setTimeout(() => reinitializeDropdowns('<card-body>'), 1000)
  }
}
</script>

<style scoped>

</style>
