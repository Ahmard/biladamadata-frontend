<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <TableResponsiveFilter :statuses="filterStatuses"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template #title>Virtual Account Number Requests</template>
        <template #desc>
          <TableRefreshButton
            :auto-refresh-interval="1000 * 30"
            :table="table">
          </TableRefreshButton>
        </template>
      </card-header>
      <card-body class="mx-4 table-responsive table-responsive-xl mt-2">
        <Table id="requests" class="table table-hover">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Requester</th>
            <th>Reason</th>
            <th>Rejection Reason</th>
            <th>Is VAN Generated?</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody></tbody>
        </Table>
      </card-body>
    </card><!-- .card-preview -->

    <confirm
      v-model="dialog_confirm_approval"
      confirm-text="Approve"
      max-width="500px"
      message="Are you sure you want to approve this request?"
      title="Approve Request?"
      @confirmed="approvalConfirmed"
    />

    <v-dialog v-model="dialog_reject_request" max-width="600px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-content-between">
          <span class="text-h5 text-uppercase text-secondary">
            Reject VAN Request
          </span>
        </v-card-title>

        <v-card-text class="mt-3">
          <v-textarea
            v-model="form.reason"
            label="Why are you rejecting this request?"
            outlined
            rows="4"
          ></v-textarea>
        </v-card-text>


        <v-card-actions style="margin-top: -30px">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text type="button" @click="rejectRequest">
            Submit
          </v-btn>
          <v-btn color="blue darken-1" text type="button" @click="dialog_reject_request = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div><!-- wrapper -->
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiAdminUrl} from "~/plugins/helpers/misc";
import Alert from "~/plugins/helpers/alert";
import {van_request_status} from "~/plugins/status/van_request_status";
import {badge} from "~/plugins/helpers/html";

export default {
  name: "index",
  head: {
    title: 'VAN Requests'
  },
  data() {
    return {
      table: {},
      current_van_request: {},
      dialog_reject_request: false,
      dialog_confirm_approval: false,
      form: {
        reason: null
      },
      breadcrumbs: [
        {
          name: 'Users',
        },
      ],
      filterStatuses: [
        {name: 'All', value: 'all'},
        {name: 'Pending', value: 'pending'},
        {name: 'Approved', value: 'approved'},
        {name: 'Rejected', value: 'rejected'},
      ],
    }
  },
  methods: {
    approvalConfirmed() {
      this.xhrPatch(apiAdminUrl(`van-requests/${this.current_van_request['user_van_request_id']}/approve`))
        .then(() => {
          this.table.ajax.reload()

          Alert.success({
            title: 'VAN Request',
            html: 'Request has been approved successfully'
          })
        })
    },

    rejectRequest() {
      this.xhrPatch(apiAdminUrl(`van-requests/${this.current_van_request['user_van_request_id']}/reject`), this.form)
        .then(() => {
          this.table.ajax.reload()

          Alert.success({
            title: 'VAN Request',
            html: 'Request has been rejected successfully'
          })

          this.dialog_reject_request = false
        })
    }
  },
  mounted() {
    initDataTable('table#requests', {
      url: apiAdminUrl('van-requests'),
      order: [[0, 'desc']],
      onInit: table => this.table = table,
      reInitTable: {onFilterChange: true},
      columns: [
        {data: 'user_van_request_id'},
        {data: 'creator_full_name'},
        {data: 'reason'},
        {data: 'rejection_reason'},
        {data: 'is_acc_num_generated'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'user_van_request_id'},
      ],
      columnDefs: [
        {
          targets: 4,
          render(data, type, row) {
            return row['is_acc_num_generated']
              ? badge('success-dim text-success', 'Yes')
              : badge('info-dim text-info', 'No')
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return van_request_status(row['status'])
          }
        }
      ],
      dropdown: [
        {
          html: 'View Profile',
          icon: 'user',
          href: data => `/admin/users/${data['user_id']}`,
        },
        {
          html: 'Approve',
          icon: 'check-circle',
          showIf: {status: 'pending'},
          onClick: data => {
            this.current_van_request = data
            this.dialog_confirm_approval = true
          }
        },
        {
          html: 'Reject',
          icon: 'x-circle',
          showIf: {status: 'pending'},
          onClick: data => {
            this.current_van_request = data
            this.dialog_reject_request = true
          }
        },
      ]
    })
  }
}
</script>

<style scoped>

</style>
