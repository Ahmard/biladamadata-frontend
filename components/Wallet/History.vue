<template>
  <div>
    <card v-if="withCard">
      <card-header>
        <template v-slot:title>Wallet History</template>
      </card-header>
      <card-body class="table-responsive table-responsive-md">
        <data-table :id="theTableId">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Balance Before</th>
            <th>Txn Amount</th>
            <th>Balance After</th>
            <th>Narration</th>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
          </thead>
          <tbody></tbody>
        </data-table>
      </card-body>
    </card>

    <table v-if="!withCard" class="table table-hover" :id="theTableId">
      <thead>
      <tr>
        <th>#ID</th>
        <th>Balance Before</th>
        <th>Txn Amount</th>
        <th>Balance After</th>
        <th>Narration</th>
        <th>Action</th>
        <th>Timestamp</th>
      </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiUrl, decodeHtml, formatKobo} from "~/plugins/helpers/misc";
import {badge} from "~/plugins/helpers/html";

export default {
  name: "History",
  props: {
    pageLength: {default: 10,},
    url: {default: null},
    title: {default: 'My Wallet'},
    tableId: {default: null},
    withCard: {default: true},
  },
  data() {
    return {
      theTableId: '',
    }
  },
  watch: {
    theTableId(id) {
      this.theTableId = id ?? `wallet-history-${this.$auth.user.id}`
    }
  },
  mounted() {
    this.theTableId = this.tableId ?? `wallet-history-${this.$auth.user.id}`
    initDataTable(`table#${this.theTableId}`, {
      url: this.url ?? apiUrl('wallet/history'),
      pageLength: this.pageLength,
      reInitTable: {onFilterChange: true},
      order: [[0, 'desc']],
      columns: [
        {data: 'wallet_history_id'},
        {data: 'amount_before'},
        {data: 'amount'},
        {data: 'amount_after'},
        {data: 'narration'},
        {data: 'action'},
        {data: 'created_at'},
      ],
      columnDefs: [
        {
          targets: 1,
          render: (data, type, row) => {
            return formatKobo(row['amount_before'])
          }
        },
        {
          targets: 2,
          render(data, type, row) {
            let amount = formatKobo(row['amount']);
            const textColorClass = row['action'] === 'credit' ? 'text-success' : 'text-danger';
            amount = row['action'] === 'credit' ? `+${amount}` : `-${amount}`

            return `<span class="${textColorClass}">${amount}</span>`
          }
        },
        {
          targets: 3,
          render: (data, type, row) => {
            return formatKobo(row['amount_after'])
          }
        },
        {
          targets: 4,
          render: (data, type, row) => {
            return decodeHtml(row['narration'])
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            if ('credit' === row['action']) {
              return badge('primary-dim text-success', row['action'])
            }

            return badge('primary-dim text-danger', row['action'])
          }
        }
      ]
    })
  }
}
</script>

<style scoped>

</style>
