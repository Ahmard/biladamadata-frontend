<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-content-between border-bottom border-light">
        <div v-html="title" class="text-uppercase"></div>
      </v-card-title>

      <v-card-text class="my-3">
        <slot />
      </v-card-text>

      <v-card-actions style="margin-top: -20px" class="border-top border-light">
        <v-spacer></v-spacer>
        <slot name="footer">
          <slot name="footer-item"></slot>
          <v-btn color="blue darken-1" text @click="dialog = false" type="button">
            Close
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TableResponsiveModal",
  props: {
    value: {default: true},
    title: {default: 'Information'}
  },
  watch: {
    value(val) {
      this.dialog = val
    },
    dialog(val) {
      this.$emit('input', val)
    }
  },
  data() {
    return {
      dialog: this.value,
    }
  }
}
</script>

<style scoped>

</style>
