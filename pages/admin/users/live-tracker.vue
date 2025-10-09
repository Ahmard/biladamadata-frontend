<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template v-slot:title>Users - Live Tracking</template>
      </card-header>
      <card-body class="mx-4 table-responsive table-responsive-xl mt-2">
        <v-data-table
          :headers="headers"
          :items="updates"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item.user="{ item }">
            <nuxt-link :to="`/admin/users/${item.user.user_id}`">{{ item.user.full_name }}</nuxt-link>
          </template>
        </v-data-table>
      </card-body>
    </card><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
export default {
  name: "live-tracker",
  data() {
    return {
      table: {},
      users: [],
      updates: [],
      wsTrackerRoom: {},
      breadcrumbs: [
        {
          name: 'Users',
          url: '/admin/users'
        },
        {
          name: 'Live Tracking'
        }
      ],
      headers: [
        {
          text: 'User',
          align: 'start',
          sortable: false,
          value: 'user',
        },
        {text: 'From', value: 'from', sortable: false},
        {text: 'To', value: 'to', sortable: false},
        {text: 'Timestamp', value: 'timestamp', sortable: false},
      ],
    }
  },
  mounted() {
    this.wsTrackerRoom = this.$wsPhoenix.joinRoom('live_tracker');

    this.wsTrackerRoom.on('position_update', event => {
      let updates = [{
        from: event.data.from,
        to: event.data.to,
        user: event.sender.info,
        timestamp: new Date().toLocaleString()
      }]

      updates = updates.concat(this.updates)

      if (updates.length > 10) {
        updates = updates.slice(0, 10)
      }

      this.updates = updates;
    })
  }
}
</script>

<style scoped>

</style>
