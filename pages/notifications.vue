<template>
  <div class="row">
    <div class="col-md-12">
      <Breadcrumb :items="breadcrumbs"/>
    </div><!-- .nk-block-head -->
    <div class="nk-block nk-block-lg mb-1">
      <TableResponsiveFilter/>
    </div>

    <card>
      <card-header>
        <template v-slot:title>Notifications</template>
      </card-header>
      <div class="card-inner table-responsive table-responsive-md m-3">
        <Table id="notifications">
          <thead>
          <tr>
            <th>Status</th>
            <th>Title</th>
            <th>Content</th>
            <th>Date & Time</th>
          </tr>
          </thead>
          <tbody></tbody>
        </Table>
      </div>
    </card><!-- .card-preview -->
  </div> <!-- nk-block -->
</template>

<script>
import Vue from 'vue'
import {apiUrl, decodeHtml, serverUrl} from "@/plugins/helpers/misc";
import {initDataTable} from "~/plugins/helpers/datatable";
import {notification_status} from "~/plugins/status/notification_status";
import {Notification} from "~/plugins/models/notification";

export default Vue.extend({
  name: 'Notifications',
  middleware: ['auth'],
  head() {
    return {
      title: 'Notifications'
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'Notifications',
        },
      ],
      pending_notifications: []
    }
  },
  methods: {
    updateGlancedNotifications() {
      if (this.pending_notifications.length) {
        const ids = this.pending_notifications.map(n => n['notification_id'])
        Notification.updateGlancedNotifications(ids);
      }
    }
  },
  mounted() {
    initDataTable('table#notifications', {
      url: apiUrl(`notifications`),
      createdRow: (row, data) => {
        if (data['status'] === 'pending') {
          this.pending_notifications.push(data);
        }
      },
      onRowClick: function (e, tableRow, data,) {
        window.open(serverUrl(`notifications/${data['notification_id']}`), '_blank')
      },
      onDraw: () => {
        this.updateGlancedNotifications()
      },
      reInitTable: {onFilterChange: true},
      order: [[0, 'desc']],
      columns: [
        {data: 'status'},
        {data: 'title'},
        {data: 'content'},
        {data: 'created_at'},
      ],
      columnDefs: [
        {
          targets: 0,
          render(data, type, row) {
            return notification_status(row['status'])
          }
        },
        {
          targets: 1,
          render(data, type, row) {
            return decodeHtml(row['title'])
          }
        },
        {
          targets: 2,
          render(data, type, row) {
            return decodeHtml(row['content'])
          }
        },
      ]
    })
  }
})
</script>
