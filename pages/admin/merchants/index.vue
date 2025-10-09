<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <TableResponsiveFilter :statuses="filterStatuses"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template v-slot:title>Merchants</template>
        <template v-slot:desc>
          <TableRefreshButton :table="table"></TableRefreshButton>
          <NuxtLink class="btn btn-sm btn-primary fw-bold" to="merchants/add">
            <i class='bx bx-plus'></i> Create Merchant
          </NuxtLink>
        </template>
      </card-header>
      <card-body class="table-responsive table-responsive-md">
        <data-table id="merchants" :key="component_table_key">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Wallet Balance</th>
            <th>Status</th>
            <th>Created At</th>
            <th></th>
          </tr>
          </thead>
          <tbody></tbody>
        </data-table>
      </card-body>
    </card><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
import {apiAdminUrl, formatKobo} from "@/plugins/helpers/misc";
import {initDataTable} from "@/plugins/helpers/datatable";
import Swal from "sweetalert2";
import {User} from "@/plugins/models/user";
import {user_status} from "~/plugins/status/user_status";

export default {
  name: "AdminMerchantList",
  middleware: ['isAdmin'],
  head: {
    title: 'Merchants'
  },
  data() {
    return {
      table: null,
      component_table_key: Date.now(),
      breadcrumbs: [
        {
          name: 'Merchants',
        },
      ],
      filterStatuses: [
        {name: 'All', value: 'all'},
        {name: 'Active', value: 'active'},
        {name: 'Inactive', value: 'inactive'},
      ],
    }
  },
  mounted() {
    const $nuxt = this
    initDataTable('table#merchants', {
      ajax: {
        url: apiAdminUrl('merchants'),
        data: {}
      },
      reInitTable: {
        onFilterChange: true,
      },
      columns: [
        {data: 'id'},
        {data: 'username'},
        {data: 'full_name'},
        {data: 'email', name: 'users.email'},
        {data: 'phone_number', name: 'users.phone_number'},
        {data: 'wallet_balance', searchable: false},
        {data: 'status', name: 'users.status'},
        {data: 'created_at', name: 'users.created_at'},
        {data: 'id', name: 'users.id'},
      ],
      columnDefs: [
        {
          targets: 2,
          render(data, type, row) {
            return User.fromData(row).fullName()
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return formatKobo(row['wallet_balance'])
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return user_status(row['status'])
          }
        }
      ],
      onRowClickRedirect: data => `/admin/merchants/${data['id']}`,
      dropdown: [
        {
          html: 'Edit',
          icon: 'edit-alt',
          onClick: data => {
            this.$router.push(`/admin/merchants/${data['id']}/edit`)
          }
        },
        {
          html: 'Delete',
          icon: 'trash-alt',
          onClick: data => {
            Swal.fire({
              title: 'Remove Merchant?',
              text: "You won't be able to revert this",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, remove!'
            }).then((result) => {
              if (result.isConfirmed) {
                $nuxt.xhrDelete(apiAdminUrl(`merchants/${data['id']}`)).then(() => {
                  Swal.fire(
                    'Merchant',
                    'Merchant has been removed',
                    'success'
                  ).then(() => this.table.ajax.reload())
                })
              }
            })
          }
        },
      ]
    }).then($t => this.table = $t)
  }
}
</script>

<style scoped>

</style>
