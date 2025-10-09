<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <card class="mt-2">
      <!--      <CardHeader class="d-flex justify-content-between">-->
      <!--        <div class="fw-bold">Network Providers</div>-->
      <!--        <NuxtLink to="merchants/add" class="btn btn-sm btn-primary">-->
      <!--          <i class='bx bx-plus'></i> Add Network Provider-->
      <!--        </NuxtLink>-->
      <!--      </CardHeader>-->
      <card-body class="mx-4 table-responsive table-responsive-xl mt-2">
        <data-table id="network-providers">
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
  name: "AdminMerchantList",
  middleware: ['isAdmin'],
  head: {
    title: 'Merchants'
  },
  data() {
    return {
      $table: null,
      breadcrumbs: [
        {
          name: 'Network Providers',
        },
      ],
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
    initDataTable('table#network-providers', {
      ajax: {
        url: apiAdminUrl('network-providers'),
        data: {}
      },
      reInitTable: {
        onFilterChange: true,
      },
      columns: [
        {data: 'network_provider_id'},
        {data: 'np_name'},
        {data: 'np_desc'},
        {data: 'status'},
        {data: 'first_name', name: 'users.first_name'},
        {data: 'created_at'},
        {data: 'network_provider_id'},
      ],
      columnDefs: [
        {
          targets: 3,
          render(data, type, row) {
            return network_provider_status(row['status'])
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return User.fromData(row).viewPageLink('admin', 'created_by')
          }
        },
      ],
      onRowClick: (e, tableRow, rowData) => {
        this.$router.push(`/admin/network-providers/${rowData['network_provider_id']}`)
      },
      dropdown: [
        {
          html: 'Edit',
          icon: 'edit-alt',
          onClick: data => {
            this.$router.push(`/admin/network-providers/${data['network_provider_id']}/edit`)
          }
        },
        {
          html: 'Enable',
          icon: 'check',
          showIf: {status: 'inactive'},
          onClick: data => {
            Swal.fire({
              title: 'Enable Network Provider?',
              text: "Are you sure to enable this network provider",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, enable!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Activating');
                this.xhrPatch(apiAdminUrl(`network-providers/${data['network_provider_id']}/activate`))
                  .then(() => {
                    Swal.fire(
                      'Network Provider',
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
              title: 'Disable Network Provider?',
              text: "Are you sure to disable this network provider",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, disable!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Deactivating');
                this.xhrPatch(apiAdminUrl(`network-providers/${data['network_provider_id']}/deactivate`))
                  .then(() => {
                    Swal.fire(
                      'Network Provider',
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
