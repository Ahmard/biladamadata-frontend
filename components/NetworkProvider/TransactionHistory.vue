<template>
  <div class="card">
    <div class="card-body table-responsive table-responsive-md">
      <table class="table table-hover" id="history">
        <thead>
        <tr>
          <th>#ID</th>
          <th>User</th>
          <th>Amount</th>
          <th>Narration</th>
          <th>Action</th>
          <th>Created At</th>
        </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiAdminUrl, formatKobo, formatMoneyAmount} from "~/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import {badge} from "~/plugins/helpers/html";

export default {
  name: "TransactionHistory",
  props: ['networkProviderId'],
  mounted() {
    initDataTable('table#history', {
      url: apiAdminUrl(`network-providers/${this.networkProviderId}/transaction-history`),
      pageLength: 5,
      reInitTable: {
        onFilterChange: true,
      },
      columns: [
        {data: 'dbh_id'},
        {data: 'first_name'},
        {data: 'amount'},
        {data: 'narration'},
        {data: 'action'},
        {data: 'created_at'},
      ],
      columnDefs: [
        {
          targets: 1,
          render(data, type, row) {
            return User.fromData(row).viewPageLink('admin', 'user_id')
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
          targets: 4,
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
