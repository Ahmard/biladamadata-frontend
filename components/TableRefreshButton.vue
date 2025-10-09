<template>
  <span>
    <button
      :ref="buttonId"
      class="btn fw-bold btn-sm btn-primary btn-table-refresh"
      @click="handleClick" :disabled="isLoading"
    >
    <span v-if="!isLoading">
      <i class="bx bx-refresh"></i> Refresh
    </span>
    <span v-if="isLoading">Refreshing...</span>
  </button>
  </span>
</template>

<script>
export default {
  name: "TableRefreshButton",
  props: {
    table: {default: {}},
    autoRefreshInterval: {default: null}
  },
  data() {
    return {
      hasLoaded: false,
      isLoading: false,
      buttonId: `btn-table-refresh-${Date.now()}`,
    }
  },
  watch: {
    table(tbl) {
      if (tbl) {
        tbl.on('draw', () => {
          if (this.isLoading) {
            console.log('Table refreshed')
          }
          this.isLoading = false
        })
      }
    }
  },
  methods: {
    handleClick(e) {
      this.isLoading = true
      this.table.ajax.reload()
      this.$emit('click', e)
    }
  },
  mounted() {
    if (this.autoRefreshInterval) {
      let interval = setInterval(() => {
        const button = this.$refs[this.buttonId];
        this.isLoading = false

        if (!button) {
          console.log('DT Table auto-refresh out of context, clearing interval...')
          clearInterval(interval);
        }

        if (button) {
          button.click();
        }
      }, this.autoRefreshInterval)
    }
  }
}
</script>

<style scoped>

</style>
