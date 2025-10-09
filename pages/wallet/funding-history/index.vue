<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="mt-2 row">
      <div class="col-md">
        <card>
          <card-header :has-controls="true">
            <template #title>My Wallet Funding History</template>
            <template #desc>
              <TableRefreshButton :table="table"/>
            </template>
          </card-header>
          <card-body class="table-responsive table-responsive-md">
            <table id="payments" class="table table-hover">
              <thead>
              <tr>
                <th>#ID</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Reference</th>
                <th>Direct Transfer?</th>
                <th>Status</th>
                <th>Paid At</th>
              </tr>
              </thead>
              <tbody></tbody>
            </table>
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import {apiUrl, formatKobo} from "~/plugins/helpers/misc";
import {initDataTable} from "~/plugins/helpers/datatable";
import {payment_status} from "~/plugins/status/payment_status";
import {Payment} from "~/plugins/models/payment";

export default {
  name: "index",
  middleware: ['isAuth'],
  head: {
    title: 'External Payments'
  },
  data() {
    return {
      table: {},
      wallet: {amount: ''},
      breadcrumbs: [
        {
          name: 'Wallet',
          url: '/wallet'
        },
        {
          name: 'Funding History',
        },
      ],
    }
  },
  mounted() {
    initDataTable('table#payments', {
      url: apiUrl('payments'),
      onRowClickRedirect: data => `/wallet/funding-history/${data['payment_id']}`,
      onInit: $table => this.table = $table,
      reInitTable: {onFilterChange: true},
      order: [[1, 'desc']],
      columns: [
        {data: 'payment_id'},
        {data: 'computed_amount'},
        {data: 'purpose'},
        {data: 'reference'},
        {data: 'is_direct_transfer'},
        {data: 'status'},
        {data: 'paid_at'},
      ],
      columnDefs: [
        {
          targets: 1,
          responsivePriority: 1,
          render(data, type, row) {
            return formatKobo(row['computed_amount'])
          }
        },
        {
          targets: 2,
          render(data, type, row) {
            return Payment.fromData(row).prepareData().formatted_purpose
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return Payment.fromData(row).prepareData().direct_transfer_formatted
          }
        },
        {
          targets: 5,
          responsivePriority: 2,
          render(data, type, row) {
            return payment_status(row['status'])
          }
        },
      ]
    })
  }
}
</script>

<style scoped>

</style>
