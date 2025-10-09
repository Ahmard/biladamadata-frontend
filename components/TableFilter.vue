<template>
  <div class="d-flex justify-content-start">
    <div class="form-group">
      <label for="start_date" class="form-label mb-0 text-muted">Start Date:</label>
      <input type="date" class="form-control re-init-table" name="start_date"
             v-model="form.start_date"
             id="start_date">
    </div>
    <div class="form-group ms-1">
      <label for="end_date" class="form-label mb-0 text-muted">End Date:</label>
      <input type="date" class="form-control re-init-table" name="end_date"
             v-model="form.end_date"
             id="end_date">
    </div>
    <div class="form-group ms-1" v-if="statuses && statuses.length">
      <label for="end_date" class="form-label mb-0 text-muted">Status:</label>
      <select v-model="form.status" name="status" :id="selectId" class="form-select re-init-table">
        <option v-for="status in statuses" :value="status.value">
          {{ status.name }}
        </option>
      </select>
      <!--      <Select2-->
      <!--        name="status"-->
      <!--        class-name="re-init-table"-->
      <!--        placeholder="Choose Status"-->
      <!--        label="Status:"-->
      <!--        :id="selectId"-->
      <!--        :items="statuses"-->
      <!--      ></Select2>-->
    </div>
  </div>
</template>

<script>

import {getPageQueries, mergePageQueries} from "~/plugins/helpers/misc";

export default {
  name: "TableFilter",
  props: {
    statuses: {default: []},
    id: {default: `table-filter-${Date.now()}`}
  },
  watch: {
    form: {
      deep: true,
      handler(form) {
        const route = this.$route.path
        const newQueries = mergePageQueries(form)
        const queries = $.param(newQueries)
        window.history.pushState({}, '', `/#${route}?${queries}`)
      }
    }
  },
  data() {
    const url_queries = getPageQueries();
    return {
      selectId: `status-${Date.now()}`,
      form: {
        start_date: url_queries.start_date,
        end_date: url_queries.end_date,
        status: url_queries.status ?? 'all',
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
