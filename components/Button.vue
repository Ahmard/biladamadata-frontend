<template>
  <button
    :class="`btn btn-${size} btn-${color} ${className} text-white`"
    :disabled="loading"
    :type="type ? type : 'submit'"
    @click="handleClick">
    <slot v-if="!loading"/>
    <span v-if="loading">
      {{ loadingMessage ?? 'Submitting...' }}
    </span>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: ['color', 'size', 'loading', 'loadingMessage', 'type', 'className'],
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style scoped>

</style>
