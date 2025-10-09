<template>
  <v-dialog v-model="dialog" persistent :max-width="maxWidth">
    <v-card>
      <v-card-title class="d-flex justify-content-between" :class="withTopBorder ? 'border-bottom border-light' : null">
        <div class="text-uppercase animate__animated text-secondary animate__backInLeft">{{ title }}</div>
        <div
          v-if="titleDesc"
          v-html="titleDesc"
          class="animate__animated animate__backInRight btn small-box fw-bold">
        </div>
      </v-card-title>

      <v-card-text v-html="message" class="animate__animated animate__backInRight my-3"></v-card-text>

      <v-card-actions style="margin-top: -20px" :class="withBottomBorder ? 'border-top border-light' : null">
        <v-spacer></v-spacer>
        <v-btn depressedcolor="primary" text @click="handleConfirm" type="button">{{ confirmText }}</v-btn>
        <v-btn color="blue darken-1" text @click="handleCancel" type="button">{{ cancelText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Confirm",
  props: {
    value: {default: false},
    maxWidth: {default: '400px'},
    withTopBorder: {default: false},
    withBottomBorder: {default: false},
    title: {default: 'Are you sure?'},
    titleDesc: {default: null},
    confirmText: {default: 'Yes'},
    cancelText: {default: 'No'},
    message: {default: 'Really wanna go with this?'},
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
      dialog: false
    }
  },
  methods: {
    handleConfirm(e) {
      this.dialog = false
      this.$emit('confirmed', e)
    },
    handleCancel(e) {
      this.dialog = false
      this.$emit('canceled', e)
    },
  }
}
</script>

<style scoped>

</style>
