<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <TableResponsiveFilter :statuses="filterStatuses"/>

    <div class="mt-2 row">
      <div class="col-md">
        <card>
          <card-header :has-controls="true">
            <template #title>Data Transactions</template>
            <template v-slot:desc>
              <TableRefreshButton
                :auto-refresh-interval="1000 * 30"
                :table="table">
              </TableRefreshButton>
            </template>
          </card-header>
          <card-body class="table-responsive table-responsive-sm table-responsive-md table-responsive-lg mt-2">
            <DataTransactionList
              :endpoint="apiAdminUrl('data/transactions')"
              :with-owner="true"
              :with-page-length="10"
              @init="t => table = t"
            />
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import List from "~/components/Data/TransactionList.vue";
import {apiAdminUrl} from "~/plugins/helpers/misc";

export default {
  name: "index",
  methods: {apiAdminUrl},
  components: {List},
  middleware: ['isAdmin'],
  head: {
    title: 'Data Transactions'
  },
  data() {
    return {
      table: {},
      networkProviders: [],
      breadcrumbs: [
        {
          name: 'Data Transactions',
        },
      ],
      filterStatuses: [
        {name: 'All', value: 'all'},
        {name: 'Processed', value: 'processed'},
        {name: 'Processing', value: 'processing'},
        {name: 'Failed', value: 'failed'},
        {name: 'Requested Reprocessing', value: 'reprocessing_requested'},
      ],
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
