<template>
  <div>
    <data-table :id="tableId">
      <thead>
      <tr>
        <th>#ID</th>
        <th>User</th>
        <th>Data Plan</th>
        <th>Network</th>
        <th>Mobile Number</th>
        <th>Price</th>
        <th>Original Price</th>
        <th>Status</th>
        <th>Timestamp</th>
        <th></th>
      </tr>
      </thead>
      <tbody></tbody>
    </data-table>
  </div>
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiAdminUrl, formatKobo, startWorking, stopWorking} from "~/plugins/helpers/misc";
import {DataTransaction} from "~/plugins/models/data.transaction";
import Swal from "sweetalert2";

export default {
  name: "TransactionList",
  props: {
    endpoint: {default: null},
    withOwner: {default: false},
    withPageLength: {default: 5},
    tableId: {default: 'admin-data-transactions'},
  },
  mounted() {
    initDataTable(`table#${this.tableId}`, {
      url: this.endpoint,
      onInit: table => {
        this.table = table
        this.$emit('init', table)
      },
      reInitTable: {onFilterChange: true},
      pageLength: this.withPageLength,
      order: [[0, 'desc']],
      columns: [
        {data: 'data_transaction_id'},
        {data: 'full_name'},
        {data: 'dp_name', name: 'data_plans.dp_name'},
        {data: 'np_name', name: 'network_providers.np_name'},
        {data: 'mobile_number'},
        {data: 'data_computed_price'},
        {data: 'data_original_price'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'data_transaction_id'},
      ],
      columnDefs: [
        {
          targets: 1,
          render(data, type, row) {
            return DataTransaction.fromData(row).prepareData().full_name_view_page
          }
        },
        {
          targets: 2,
          render(data, type, row) {
            return DataTransaction.fromData(row).prepareData().dp_name_view_page
          }
        },
        {
          targets: 3,
          render(data, type, row) {
            return DataTransaction.fromData(row).prepareData().np_name_view_page
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return formatKobo(row['data_computed_price'])
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return DataTransaction.fromData(row).prepareData().data_original_price_formatted
          }
        },
        {
          targets: 7,
          render(data, type, row) {
            return DataTransaction.fromData(row).prepareData().status_view_page
          }
        },
      ],
      dropdown: [
        {
          html: 'Receipt (PDF)',
          icon: 'printer',
          showIfAny: [
            {status: 'processing'},
            {status: 'processed'},
          ],
          onClick: data => DataTransaction.fromData(data).receipt_url(true, false),
        },
        {
          html: 'Receipt (Image)',
          icon: 'printer',
          showIfAny: [
            {status: 'processing'},
            {status: 'processed'},
          ],
          onClick: data => DataTransaction.fromData(data).receipt_url(true, true),
        },
        {
          html: 'Resend Data',
          icon: 'redo',
          showIfAny: [
            {status: 'processing'},
            {status: 'reprocessing_requested'},
          ],
          onClick: data => {
            Swal.fire({
              title: 'Resend Data?',
              text: "Are you sure you want to resend this data?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, resend!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Resending')
                this.xhrPatch(apiAdminUrl(`data/transactions/${data['data_transaction_id']}/resend`))
                  .then(() => {
                    this.table.ajax.reload()
                    Swal.fire(
                      'Data Transaction',
                      'Data has been resent',
                      'success'
                    )
                  })
                  .finally(() => stopWorking())
              }
            })
          }
        },
        {
          html: 'Mark as processed',
          icon: 'check-double',
          showIfAny: [
            {status: 'processing'},
            {status: 'reprocessing_requested'},
          ],
          onClick: data => {
            Swal.fire({
              title: 'Mark Transaction?',
              text: "Are you sure you want to mark this transaction as processed?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, mark!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Processing')
                this.xhrPatch(apiAdminUrl(`data/transactions/${data['data_transaction_id']}/mark-as-processed`))
                  .then(() => {
                    this.table.ajax.reload()
                    Swal.fire(
                      'Data Transaction',
                      'Data has been resent',
                      'success'
                    )
                  })
                  .finally(() => stopWorking())
              }
            })
          }
        },
        {
          html: 'Mark as canceled',
          icon: 'x',
          showIfAny: [
            {status: 'processing'},
            {status: 'reprocessing_requested'},
          ],
          onClick: data => {
            Swal.fire({
              title: 'Cancel Transaction?',
              text: "Are you sure you want to mark this transaction as canceled?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, mark!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Cancelling')
                this.xhrPatch(apiAdminUrl(`data/transactions/${data['data_transaction_id']}/mark-as-canceled`))
                  .then(() => {
                    this.table.ajax.reload()
                    Swal.fire(
                      'Data Transaction',
                      'Transaction has been canceled and refund has been made to the customer',
                      'success'
                    )
                  })
                  .finally(() => stopWorking())
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
