<template>
  <div
    class="list-group-item d-flex justify-content-between"
    @mouseover="showActionButton"
    @mouseleave="hideActionButton">
    <div class="ms-2 me-auto">
      <div>
        <div class="fw-bold">{{ title }}</div>
        {{ desc }}
      </div>
    </div>
    <div>
      <div class="d-flex justify-content-end">
        <div v-if="!isEditMode" class="fw-bold text-indigo">{{ theValue }}</div>
        <input v-if="isEditMode && isUpdatable" v-model="theValue" type="number" class="form-control form-control-sm w-90">
      </div>
      <div class="d-flex justify-content-end mt-1" v-if="isUpdatable">
        <a v-if="!isEditMode" class="edit d-none btn btn-sm btn-outline-primary" href="#" @click.prevent="editValue">
          <i class="ni ni-edit-alt"></i> Edit
        </a>
        <a v-if="isEditMode" class="edit d-none btn btn-sm btn-outline-primary" href="#" @click.prevent="doneEditing">
          <i class="ni ni-check"></i> Done
        </a>
        <a v-if="isEditMode" class="ms-1 edit d-none btn btn-sm btn-outline-primary" href="#" @click.prevent="resetValue">
          <i class="ni ni-reload"></i> Reset
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {hideActionButton, showActionButton} from "~/plugins/helpers/setting";
import {toKobo} from "~/plugins/helpers/misc";

export default {
  name: "InputItem",
  props: {
    title: {default: null},
    desc: {default: null},
    value: {default: null},
    isUpdatable: {default: true},
    isFloat: {default: false},
  },
  data() {
    return {
      isEditMode: false,
      theValue: this.value,
      originalValue: this.value,
    }
  },
  methods: {
    hideActionButton,
    showActionButton,
    editValue() {
      this.isEditMode = true
    },
    resetValue() {
      this.theValue = this.originalValue
    },
    doneEditing() {
      this.isEditMode = false
      this.$emit('input', this.isFloat ? toKobo(this.theValue) : this.theValue)
    },
  },
}
</script>

<style scoped>

</style>
