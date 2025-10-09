<template>
  <div>
    <button :type="type" v-if="showPrevButton" class="btn btn-sm btn-light" @click="prevTab">Previous</button>
    <button :type="type" v-if="showNextButton" class="btn btn-sm btn-gray text-white" @click="nextTab">Next</button>
  </div>
</template>

<script>
export default {
  name: "TabNavButtons",
  props: ['currentTab', 'targets', 'form'],
  data() {
    return {
      type: 'button',
      showPrevButton: true,
      showNextButton: true,
    }
  },
  methods: {
    getTabs() {
      return $(this.targets)
        .parentsUntil('div.v-tabs')
        .parent()
        .find('div.v-tabs-bar')
        .find('div.v-tab')
    },
    validateForm() {
      if (!this.form) return true;

      return  $(this.form)[0].checkValidity();
    },
    nextTab() {
      const parsley = $(this.form).parsley();
      parsley.validate();

      if (parsley.isValid()) {
        this.getTabs().eq(parseInt(this.currentTab) + 1).click()
      }
    },
    prevTab() {
      this.getTabs().eq(parseInt(this.currentTab) - 1).click()
    }
  },
  mounted() {
    this.showNextButton = this.getTabs().length - 1 > parseInt(this.currentTab)
    this.showPrevButton = parseInt(this.currentTab) !== 0
  }
}
</script>

<style scoped>

</style>
