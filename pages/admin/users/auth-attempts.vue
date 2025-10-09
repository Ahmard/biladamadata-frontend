<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <TableResponsiveFilter :statuses="filterStatuses"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template #title>System Authentication Attempts</template>
        <template #desc>
          <TableRefreshButton :table="table"></TableRefreshButton>
        </template>
      </card-header>
      <card-body class="mx-4 table-responsive table-responsive-xl mt-2">
        <UserAuthAttempts
          :key="component_table_key"
          :endpoint="apiAdminUrl('auth-attempts')"
          :with-page-length="10"
        />
      </card-body>
    </card><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
import {apiAdminUrl} from "@/plugins/helpers/misc";

export default {
  name: "AdminAuthAttemptList",
  methods: {apiAdminUrl},
  middleware: ['isAdmin'],
  head: {
    title: 'Auth Attempts'
  },
  data() {
    return {
      table: null,
      component_table_key: Date.now(),
      breadcrumbs: [
        {
          name: 'Users',
          url: '/admin/users'
        },
        {
          name: 'Auth Attempts'
        }
      ],
      filterStatuses: [
        {name: 'All', value: 'all'},
        {name: 'Success', value: 'success'},
        {name: 'Failure', value: 'failure'},
      ],
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
