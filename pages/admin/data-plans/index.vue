<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <NetworkProviderDataPlans
      :endpoint="apiAdminUrl('data-plans')"
      :page-length="10"
      table-id="admin-data-plan-list"
    />
  </div>
</template>

<script>
import {apiAdminUrl} from "~/plugins/helpers/misc";

export default {
  name: "index",
  methods: {apiAdminUrl},
  data() {
    return {
      breadcrumbs: [
        {
          name: 'Data Plans',
        },
      ],
    }
  }
}
</script>

<style scoped>

</style>
