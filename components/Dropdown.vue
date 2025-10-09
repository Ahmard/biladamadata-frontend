<template>
  <div class="dropdown" :id="identifier">
    <slot name="button">
      <a
        :class="`btn-${btnSize}`"
        class="btn btn-primary dropdown-toggle text-white"
        href="#"
        type="button"
        data-bs-toggle="dropdown"
      >
        <i class="icon ni ni-chevron-down"></i> {{ btnText }}
      </a>
    </slot>
    <div class="dropdown-menu">
      <slot name="items"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  props: {
    btnSize: {default: 'sm'},
    btnText: {default: 'Action'},
  },
  data() {
    return {
      identifier: `dp-${Date.now()}`
    }
  },
}
</script>

<style scoped>

</style>
