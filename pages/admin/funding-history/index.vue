<template>
  <div class="row">
    <div class="col-md-12">
      <Breadcrumb :items="breadcrumbs"/>
    </div><!-- .nk-block-head -->
    <div class="nk-block nk-block-lg">
      <TableResponsiveFilter :statuses="filterStatuses"/>
    </div>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template #title>Received Payments</template>
        <template v-slot:desc>
          <TableRefreshButton
            :auto-refresh-interval="1000 * 20"
            :table="table">
          </TableRefreshButton>
        </template>
      </card-header>
      <card-body class="table-responsive table-responsive-md">
        <table id="admin-payments" class="table table-hover">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Payer</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Charges</th>
            <th>Beneficial</th>
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
</template>

<script>
import {apiAdminUrl, formatKobo} from "@/plugins/helpers/misc";
import {initDataTable} from "@/plugins/helpers/datatable";
import {payment_status} from "~/plugins/status/payment_status";
import {Payment} from "~/plugins/models/payment";
import {badge} from "~/plugins/helpers/html";

export default {
  name: "index",
  middleware: ['isAdmin'],
  head: {
    title: 'Funding History'
  },
  data() {
    return {
      table: {},
      wallet: {amount: ''},
      breadcrumbs: [
        {
          name: 'Funding History',
        },
      ],
      filterStatuses: [
        {name: 'All', value: 'all'},
        {name: 'Paid', value: 'paid'},
        {name: 'Pending', value: 'pending'},
        {name: 'Canceled', value: 'canceled'},
      ],
    }
  },
  mounted() {
    initDataTable('table#admin-payments', {
      url: apiAdminUrl('payments'),
      onRowClickRedirect: data => `/admin/funding-history/${data['payment_id']}`,
      reInitTable: {onFilterChange: true},
      onInit: $table => this.table = $table,
      order: [[0, 'desc']],
      columns: [
        {data: 'payment_id'},
        {data: 'full_name'},
        {data: 'amount'},
        {data: 'reference'},
        {data: 'charges'},
        {data: 'computed_amount'},
        {data: 'is_direct_transfer'},
        {data: 'status'},
        {data: 'paid_at'},
      ],
      columnDefs: [
        {
          targets: 1,
          render(data, type, row) {
            return Payment.fromData(row).prepareData(true).payer_view_page
          }
        },
        {
          targets: 2,
          render(data, type, row) {
            return formatKobo(row['amount'])
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return formatKobo(row['charges'])
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return formatKobo(row['computed_amount'])
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return Payment.fromData(row).prepareData().direct_transfer_formatted
          }
        },
        {
          targets: 7,
          render(data, type, row) {
            return payment_status(row['status'])
          }
        },
        {
          targets: 8,
          render(data, type, row) {
            return row['paid_at'] ?? 'N/A'
          }
        },
      ]
    })
  }
}
</script>

<style scoped>

</style>
