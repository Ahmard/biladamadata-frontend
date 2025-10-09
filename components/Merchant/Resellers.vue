<template>
  <div>
    <card>
      <card-header>
        <template class="text-uppercase" #title>Merchant Resellers</template>
      </card-header>
      <card-body class="table-responsive table-responsive-xl">
        <data-table id="merchant-resellers">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
          </thead>
          <tbody></tbody>
        </data-table>
      </card-body>
    </card>
  </div>
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiAdminUrl} from "~/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import Swal from "sweetalert2";

export default {
  name: "Resellers",
  props: {
    merchantId: {default: ''},
    pageLength: {default: 5},
  },
  mounted() {
    const $nuxt = this
    initDataTable('table#merchant-resellers', {
      ajax: {
        url: apiAdminUrl(`merchants/${this.merchantId}/resellers`),
        data: {}
      },
      reInitTable: {
        onFilterChange: true,
      },
      pageLength: this.pageLength,
      columns: [
        {data: 'id', name: 'users.id'},
        {data: 'first_name', name: 'reseller.first_name'},
        {data: 'email', name: 'reseller.email'},
        {data: 'phone_number', name: 'reseller.phone_number'},
        {data: 'status', name: 'reseller.status'},
        {data: 'created_at', name: 'reseller.created_at'},
      ],
      columnDefs: [
        {
          targets: 1,
          render(data, type, row) {
            return User.fromData(row).fullName()
          }
        },
      ],
      onRowClick: (e, tableRow, rowData) => {
        this.$router.push(`/admin/resellers/${rowData['id']}`)
      },
    }).then($t => this.$table = $t)
  }
}
</script>

<style scoped>

</style>
