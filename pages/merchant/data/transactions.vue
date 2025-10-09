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
              <TableRefreshButton :table="table"></TableRefreshButton>
            </template>
          </card-header>
          <card-body>
            <div class="table-responsive table-responsive-md">
              <table id="transactions" class="table table-hover">
                <thead>
                <tr>
                  <th>#ID</th>
                  <th>Plan</th>
                  <th>Phone Number</th>
                  <th>Network</th>
                  <th>Amount</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th></th>
                </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import {apiMerchantUrl, apiUrl, formatKobo, startWorking, stopWorking} from "@/plugins/helpers/misc";
import {initDataTable} from "@/plugins/helpers/datatable";
import Swal from "sweetalert2";
import {data_transaction_status} from "~/plugins/status/data_transaction_status";
import {nuxtLink} from "~/plugins/helpers/html";
import {DataTransaction} from "~/plugins/models/data.transaction";

export default {
  name: "index",
  middleware: ['isMerchant'],
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
    initDataTable('table#transactions', {
      url: apiMerchantUrl('data/transactions'),
      onInit: $table => this.table = $table,
      reInitTable: {onFilterChange: true},
      order: [[0, 'desc']],
      columns: [
        {data: 'data_transaction_id'},
        {data: 'dp_name', name: 'data_plans.dp_name'},
        {data: 'mobile_number'},
        {data: 'np_name', name: 'network_providers.np_name'},
        {data: 'data_computed_price'},
        {data: 'full_name'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'data_transaction_id'},
      ],
      columnDefs: [
        {
          targets: 1,
          responsivePriority: 1,
          render(data, type, row) {
            return row['dp_name']
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return formatKobo(row['data_computed_price'])
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return nuxtLink(`merchant/resellers/${row['user_id']}`, row['full_name'], '')
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return data_transaction_status(row['status'])
          }
        },
        {
          targets: 8,
          responsivePriority: 1,
          render(data, type, row) {
            return row['status']
          }
        },
      ],
      dropdown: [
        {
          html: 'Generate Receipt',
          icon: 'printer',
          showIfAny: [
            {status: 'processing'},
            {status: 'processed'},
          ],
          onClick: data => DataTransaction.fromData(data).receipt_url(false),
        },
        {
          html: 'Request Reprocessing',
          icon: 'help-circle',
          showIf: {
            status: 'processing',
            has_requested_reprocessing: 0
          },
          onClick: data => {
            Swal.fire({
              title: 'Request Reprocessing?',
              text: "Are you sure your customer has not received this data?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, request!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Requesting')

                this.xhrPatch(apiUrl(`data/${data['data_transaction_id']}/request-reprocessing`))
                  .then(() => {
                    this.table.ajax.reload()
                    Swal.fire(
                      'Data Transaction',
                      'Data transaction reprocessing has been requested',
                      'success'
                    )
                  })
                  .finally(() => {
                    stopWorking()
                    this.table.ajax.reload()
                  })
              }
            })
          }
        },
      ]
    })
  }
}
</script>

<style scoped>

</style>
