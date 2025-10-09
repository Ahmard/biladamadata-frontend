<template>
  <div class="">
    <div class="d-flex justify-content-start mt-3">
      <div>
        <TableFilter :statuses="filterStatuses"/>
      </div>
      <div class="form-group ms-1">
        <Select2
          v-if="endpoint_units"
          :url="endpoint_units"
          name="unit"
          id="unit"
          placeholder="Choose Unit"
          label="Unit:"/>
      </div>
    </div>

    <div class="card card-bordered card-preview">
      <div class="card-header bg-white border-bottom border-light text-uppercase d-flex justify-content-between">
        <div>Users</div>
      </div>
      <div class="card-inner table-responsive table-responsive-md mt-2">
        <table class="nowrap table table-hover" id="users">
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
        </table>
      </div>
    </div><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
import {apiAdminUrl, apiUrl} from "@/plugins/helpers/misc";
import {initDataTable} from "@/plugins/helpers/datatable";

export default {
  name: "UserList",
  data() {
    return {
      endpoint_units: apiUrl('misc/units?purpose=form_select'),
      filterStatuses: [
        {name: 'All', value: 'all'},
        {name: 'Paid', value: 'paid'},
        {name: 'Approved', value: 'approved'},
        {name: 'Pending Approval', value: 'forwarded'},
        {name: 'Rejected', value: 'rejected'},
      ],
    }
  },
  mounted() {
    initDataTable('table#users', {
      ajax: {
        url: apiAdminUrl('users'),
        data: {}
      },
      columns:[]
    })
  }
}
</script>

<style scoped>

</style>
