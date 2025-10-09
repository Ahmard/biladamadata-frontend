<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <TableResponsiveFilter :statuses="filterStatuses"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template #title>User Wallets</template>
        <template #desc>
          <TableRefreshButton :table="table"></TableRefreshButton>
        </template>
      </card-header>
      <card-body class="mx-4 table-responsive table-responsive-xl mt-2">
        <Table id="wallets" :key="component_table_key" class="table table-hover">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Wallet Balance</th>
            <th>Status</th>
            <th>Opened At</th>
            <th>Last Transaction At</th>
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
import {apiAdminUrl, formatKobo} from "~/plugins/helpers/misc";
import {initDataTable} from "~/plugins/helpers/datatable";
import {walle_status} from "~/plugins/status/walle_status";

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
          name: 'Wallets',
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
    initDataTable('table#wallets', {
      url: apiAdminUrl('wallets'),
      reInitTable: {
        onFilterChange: true,
        onInit: table => this.table = table,
        onEvent: {
          name: 'change',
          selectors: [
            {'select#status': 'filter.status'},
          ]
        }
      },
      onInit: table => this.table = table,
      onRowClickRedirect: data => `/admin/wallets/${data['wallet_id']}`,
      columns: [
        {data: 'wallet_id'},
        {data: 'username', name: 'users.username'},
        {data: 'full_name'},
        {data: 'amount'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'updated_at'},
        {data: 'wallet_id'},
      ],
      columnDefs: [
        {
          targets: 3,
          render(data, type, row) {
            return formatKobo(row['amount'])
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return walle_status(row['status'])
          }
        }
      ],
      dropdown: [
        {
          html: 'View Profile',
          icon: 'user',
          href: data => `/admin/users/${data['owner_id']}`,
        },
        {
          html: 'Activate',
          icon: 'check-circle',
          showIfAny: [
            {status: 'inactive'},
            {status: 'pending'},
          ],
          href: data => `/admin/wallets/${data['wallet_id']}/activate`,
        },
        {
          html: 'Deactivate',
          icon: 'block',
          showIf: {status: 'active'},
          href: data => `/admin/wallets/${data['wallet_id']}/deactivate`,
        },
      ]
    })
  }
}
</script>

<style scoped>

</style>
