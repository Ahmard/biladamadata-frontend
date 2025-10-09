<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <card class="mt-2">
      <card-header>
        <template v-slot:title>Data Plans</template>
      </card-header>
      <card-body>
        <div class="mx-4 table-responsive table-responsive-md table-responsive-xl mt-2">
          <table id="plans" class="table table-hover">
            <thead>
            <tr>
              <th>#ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Expiration(In Days)</th>
            </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </card-body>
    </card><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
import {apiMerchantUrl, formatKobo} from "~/plugins/helpers/misc";
import {initDataTable} from "~/plugins/helpers/datatable";

export default {
  name: "MerchantDataPlans",
  middleware: ['isMerchant'],
  head: {
    title: 'Data Plans'
  },
  data() {
    return {
      $table: null,
      breadcrumbs: [
        {
          name: 'Data Plans',
        },
      ],
    }
  },
  mounted() {
    initDataTable('#plans', {
      url: apiMerchantUrl('data-plans'),
      pageLength: 10,
      reInitTable: {
        onFilterChange: true,
      },
      onRowClickRedirect: data => `/merchant/data-plans/${data['data_plan_id']}`,
      columns: [
        {data: 'data_plan_id'},
        {data: 'dp_name'},
        {data: 'plan_price'},
        {data: 'dp_desc'},
        {data: 'expired_in'},
      ],
      columnDefs: [
        {
          targets: 2,
          render: (data, type, row) => formatKobo(row['plan_price'])
        }
      ]
    }).then($t => this.$table = $t)
  }
}
</script>

<style scoped>

</style>
