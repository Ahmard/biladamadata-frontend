<template>
  <div>
    <div class="card">
      <slot name="head"></slot>
      <slot v-if="!loading"></slot>

      <div class="p-4 text-center" v-if="loading">
        <Spinner color="primary" :spin="loading" :small-icon="false"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    loading: {default: false}
  }
}
</script>

<style scoped>

</style>
