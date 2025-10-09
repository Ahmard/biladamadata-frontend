<template>
  <label :for="htmlFor" class="form-label text-muted mb-0" style="padding-top: 1px" :class="className">
    <slot></slot>
  </label>
</template>

<script>
export default {
  name: "Label",
  props: ['htmlFor', 'className'],
}
</script>

<style scoped>

</style>
