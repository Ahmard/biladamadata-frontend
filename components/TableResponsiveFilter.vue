<template>
  <div>
    <div class="show-mobile">
      <div class="d-flex justify-content-end">
        <TableFilterVisibility v-model="showFilters"/>
      </div>
    </div>

    <div class="show-computer">
      <TableFilter :statuses="statuses"/>
    </div>

    <div class="d-flex justify-content-start">
      <div v-if="showFilters">
        <TableFilter :statuses="statuses"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "TableResponsiveFilter",
  props: {
    statuses: {default: () => []}
  },
  data() {
    return {
      showFilters: false
    }
  }
}
</script>

<style scoped>

</style>
