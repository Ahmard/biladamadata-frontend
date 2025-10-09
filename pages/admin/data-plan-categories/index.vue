<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="text-end">
      <nuxt-link class="btn btn-sm btn-primary" to="/admin/data-plan-categories/create">
        <i class="bx bx-plus-circle"></i> Create DPC
      </nuxt-link>
    </div>

    <card class="mt-2">
      <card-body class="mx-4 table-responsive table-responsive-xl mt-2">
        <data-table id="data-plan-categories">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Name</th>
            <th>Desc</th>
            <th>Status</th>
            <th>Added By</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody></tbody>
        </data-table>
      </card-body>
    </card><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
import {apiAdminUrl, startWorking, stopWorking} from "@/plugins/helpers/misc";
import {initDataTable} from "@/plugins/helpers/datatable";
import {User} from "@/plugins/models/user";
import Swal from "sweetalert2";
import {network_provider_status} from "~/plugins/status/network_provider_status";

export default {
  name: "AdminDataPlanCategoryList",
  middleware: ['isAdmin'],
  head: {
    title: 'Data Plan Categories'
  },
  data() {
    return {
      $table: null,
      breadcrumbs: [
        {
          name: 'Data Plan Categories',
        },
      ],
    }
  },
  mounted() {
    initDataTable('table#data-plan-categories', {
      ajax: {
        url: apiAdminUrl('data-plan-categories'),
        data: {}
      },
      reInitTable: {
        onFilterChange: true,
      },
      columns: [
        {data: 'dpc_id'},
        {data: 'dpc_name'},
        {data: 'dpc_desc'},
        {data: 'status'},
        {data: 'creator_full_name', searchable: false},
        {data: 'created_at'},
        {data: 'dpc_id'},
      ],
      columnDefs: [
        {
          targets: 3,
          render(data, type, row) {
            return network_provider_status(row['status'])
          }
        },
      ],
      onRowClick: (e, tableRow, rowData) => {
        this.$router.push(`/admin/data-plan-categories/${rowData['dpc_id']}`)
      },
      dropdown: [
        {
          html: 'Edit',
          icon: 'edit-alt',
          onClick: data => {
            this.$router.push(`/admin/data-plan-categories/${data['dpc_id']}/edit`)
          }
        },
        {
          html: 'Enable',
          icon: 'check',
          showIf: {status: 'inactive'},
          onClick: data => {
            Swal.fire({
              title: 'Enable DPC?',
              text: "Are you sure to enable this network provider",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, enable!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Activating');
                this.xhrPatch(apiAdminUrl(`data-plan-categories/${data['dpc_id']}/activate`))
                  .then(() => {
                    Swal.fire(
                      'DPC',
                      'Network provider has been enabled',
                      'success'
                    ).then(() => this.$table.ajax.reload())
                  })
                  .finally(() => stopWorking())
              }
            })
          }
        },
        {
          html: 'Deactivate',
          icon: 'radar',
          showIf: {status: 'active'},
          onClick: data => {
            Swal.fire({
              title: 'Disable DPC?',
              text: "Are you sure to disable this network provider",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, disable!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Deactivating');
                this.xhrPatch(apiAdminUrl(`data-plan-categories/${data['dpc_id']}/deactivate`))
                  .then(() => {
                    Swal.fire(
                      'DPC',
                      'Network provider has been disabled',
                      'success'
                    ).then(() => this.$table.ajax.reload())
                  })
                  .finally(() => stopWorking())
              }
            })
          }
        },
      ]
    }).then($t => this.$table = $t)
  }
}
</script>

<style scoped>

</style>
