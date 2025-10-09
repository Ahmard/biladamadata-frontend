<template>
  <div class="checkbox-wrapper shadow-sm">
    <div class="form-check form-switch">
      <input v-model="state" class="form-check-input" type="checkbox" role="switch" id="filter-switch">
      <label class="form-check-label" for="filter-switch">Show Filters</label>
    </div>
  </div>
</template>

<script>

export default {
  name: "TableFilterVisibility",
  watch: {
    state(val) {
      this.$emit('input', val)
    }
  },
  data() {
    return {
      state: false
    }
  }
}
</script>

<style scoped>

</style>
