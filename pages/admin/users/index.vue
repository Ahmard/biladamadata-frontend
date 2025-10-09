<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <TableResponsiveFilter :statuses="filterStatuses"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template v-slot:title>System Users</template>
        <template v-slot:desc>
          <TableRefreshButton :table="table"></TableRefreshButton>
        </template>
      </card-header>
      <card-body class="mx-4 table-responsive table-responsive-xl mt-2">
        <Table id="users" :key="component_table_key" class="table table-hover">
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
            <th>Action</th>
          </tr>
          </thead>
          <tbody></tbody>
        </Table>
      </card-body>
    </card><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
import {apiAdminUrl, formatKobo} from "@/plugins/helpers/misc";
import {initDataTable} from "@/plugins/helpers/datatable";
import {User} from "@/plugins/models/user";
import {user_status} from "~/plugins/status/user_status";

export default {
  name: "AdminUserList",
  middleware: ['isAdmin'],
  head: {
    title: 'Users'
  },
  data() {
    return {
      table: null,
      component_table_key: Date.now(),
      breadcrumbs: [
        {
          name: 'Users',
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
    initDataTable('table#users', {
      url: apiAdminUrl('users'),
      reInitTable: {
        onFilterChange: true,
        onInit: table => this.table = table,
        onEvent: {
          name: 'change',
          selectors: [
            {'select#status': 'filter.status'},
            {'select#role': 'filter.role'},
          ]
        }
      },
      onInit: table => this.table = table,
      onRowClickRedirect: data => `/admin/users/${data['id']}`,
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
      dropdown: [
        {
          html: 'Edit',
          icon: 'edit-alt',
          href: data => `/admin/users/${data['id']}/edit`
        },
        {
          html: 'Activate',
          icon: 'check-circle',
          showIfAny: [
            {status: 'inactive'},
            {status: 'pending'},
          ],
          href: data => `/admin/users/${data['id']}/activate`,
        },
        {
          html: 'Deactivate',
          icon: 'block',
          showIf: {status: 'active'},
          href: data => `/admin/users/${data['id']}/deactivate`,
        },
        {
          html: 'Change Password',
          icon: 'lock',
          href: data => `/admin/users/${data['id']}/reset_password`,
        },
      ]
    })
  }
}
</script>

<style scoped>

</style>
