<template>
  <div>
    <Table class="table table-hover" :id="tableId">
      <thead>
      <tr>
        <th>#ID</th>
        <th v-if="withOwner">Full Name</th>
        <th>Email</th>
        <th>IP Address</th>
        <th>User Agent</th>
        <th>Status</th>
        <th>Created At</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody></tbody>
    </Table>
  </div>
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {User} from "~/plugins/models/user";
import {auth_attempt_status} from "~/plugins/status/auth_attempt_status";

export default {
  name: "AuthAttempts",
  props: {
    endpoint: {default: null},
    withOwner: {default: false},
    withPageLength: {default: 5},
    tableId: {default: 'admin-auth-attempts'},
  },
  mounted() {
    initDataTable(`table#${this.tableId}`, {
      url: this.endpoint,
      order: [[0, 'desc']],
      pageLength: this.withPageLength,
      reInitTable: {onFilterChange: true},
      columns: [
        {data: 'auth_attempt_id'},
        {data: 'full_name', showIfOnly: () => this.withOwner},
        {data: 'email'},
        {data: 'ip_address'},
        {data: 'user_agent'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'auth_attempt_id'},
      ],
      columnDefs: [
        {
          targets: 1,
          showIfOnly: () => this.withOwner,
          render(data, type, row) {
            if (!row.user_id) {
              return 'N/A'
            }

            return User.fromData(row).viewPageLink(
              'admin',
              'user_id',
              null,
              true
            )
          }
        },
        {
          targets: this.withOwner ? 5 : 4,
          render(data, type, row) {
            return auth_attempt_status(row['status'])
          }
        }
      ],
      dropdown: [
        {
          html: 'View Profile',
          icon: 'user',
          showIfOnly: data => data['user_id'] !== null,
          onClick: data => {
            this.$router.push(`/admin/users/${data['id']}`)
          }
        },
      ]
    }).then($t => this.table = $t)
  }
}
</script>

<style scoped>

</style>
