<template>
  <v-snackbar
    v-model="shouldDisplay"
    :timeout="theTimeout"
    color="primary"
    right
  >
    <slot/>

    <template v-slot:action="{ attrs }">
      <v-btn
        color="blue"
        text
        v-bind="attrs"
        @click="display = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "Toast",
  props: {
    value: {
      default: false
    },
    timeout: {
      default: 2500
    }
  },
  watch: {
    value(value) {
      this.shouldDisplay = value

      if (value) {
        this.handleTimeout()
      }

      return this.default
    }
  },
  data() {
    return {
      shouldDisplay: this.value,
      theTimeout: this.timeout
    }
  },
  methods: {
    handleTimeout() {
      setTimeout(() => {
        this.shouldDisplay = false
        this.$emit('input', false)
      }, this.timeout)
    }
  },
  mounted() {
    this.theTimeout = this.timeout
    this.handleTimeout()
  }
}
</script>

<style scoped>

</style>
