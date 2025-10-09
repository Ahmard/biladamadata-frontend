<template>
  <div>
    <data-table :id="tableId">
      <thead>
      <tr>
        <th>#ID</th>
        <th>User</th>
        <th>Airtime Amount</th>
        <th>Phone Number</th>
        <th>Network</th>
        <th>Cost</th>
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
import {apiAdminUrl, startWorking, stopWorking} from "~/plugins/helpers/misc";
import {AirtimeTransaction} from "~/plugins/models/airtime.transaction";
import Swal from "sweetalert2";

export default {
  name: "TransactionList",
  props: {
    endpoint: {default: null},
    withOwner: {default: false},
    withPageLength: {default: 5},
    tableId: {default: 'admin-airtime-transactions'},
  },
  mounted() {
    initDataTable(`table#${this.tableId}`, {
      url: apiAdminUrl('airtime/transactions'),
      onInit: table => {
        this.table = table
        this.$emit('init', table)
      },
      reInitTable: {onFilterChange: true},
      pageLength: this.withPageLength,
      order: [[0, 'desc']],
      columns: [
        {data: 'airtime_transaction_id'},
        {data: 'full_name'},
        {data: 'airtime_amount'},
        {data: 'mobile_number'},
        {data: 'np_name', name: 'network_providers.np_name'},
        {data: 'airtime_computed_price'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'airtime_transaction_id'},
      ],
      columnDefs: [
        {
          targets: 1,
          render(data, type, row) {
            return AirtimeTransaction.fromData(row).prepareData().full_name_view_page
          }
        },
        {
          targets: 2,
          render(data, type, row) {
            return AirtimeTransaction.fromData(row).prepareData().airtime_amount_formatted
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return AirtimeTransaction.fromData(row).prepareData().np_name_view_page
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return AirtimeTransaction.fromData(row).prepareData().airtime_original_price_formatted
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return AirtimeTransaction.fromData(row).prepareData().status_view_page
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
          onClick: data => AirtimeTransaction.fromData(data).receipt_url(true, false),
        },
        {
          html: 'Receipt (Image)',
          icon: 'printer',
          showIfAny: [
            {status: 'processing'},
            {status: 'processed'},
          ],
          onClick: data => AirtimeTransaction.fromData(data).receipt_url(true, true),
        },
        {
          html: 'Resend Airtime',
          icon: 'redo',
          showIfAny: [
            {status: 'processed'},
            {status: 'processing'},
            {status: 'reprocessing_requested'},
          ],
          onClick: data => {
            Swal.fire({
              title: 'Resend Airtime?',
              text: "Are you sure you want to resend this airtime?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, resend!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Resending')
                this.xhrPatch(apiAdminUrl(`airtime/transactions/${data['airtime_transaction_id']}/resend`))
                  .then(() => {
                    this.table.ajax.reload()
                    Swal.fire(
                      'Airtime Transaction',
                      'Airtime has been resent',
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
                this.xhrPatch(apiAdminUrl(`airtime/transactions/${data['airtime_transaction_id']}/mark-as-processed`))
                  .then(() => {
                    this.table.ajax.reload()
                    Swal.fire(
                      'Airtime Transaction',
                      'Airtime has been resent',
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
                this.xhrPatch(apiAdminUrl(`airtime/transactions/${data['airtime_transaction_id']}/mark-as-canceled`))
                  .then(() => {
                    this.table.ajax.reload()
                    Swal.fire(
                      'Airtime Transaction',
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
