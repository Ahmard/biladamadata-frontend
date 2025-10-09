<template>
    <div class="step-item">
      <button class="step-button text-center" type="button" data-bs-toggle="collapse"
              :data-bs-target="`#collapse-${number}`" :aria-expanded="active" :aria-controls="`collapse-${number}`">
        {{number}}
      </button>
      <div class="step-title">
        {{title}}
      </div>
    </div>
</template>

<script>
export default {
  name: "StepperItem",
  props: {
    number: {default: null},
    title: {default: null},
    active: {default: false},
  }
}
</script>

<style scoped>

</style>
