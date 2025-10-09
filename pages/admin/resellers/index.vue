<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <TableResponsiveFilter :statuses="filterStatuses"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template v-slot:title>Resellers</template>
        <template v-slot:desc>
          <TableRefreshButton :table="table"></TableRefreshButton>
          <NuxtLink class="btn btn-sm btn-primary fw-bold" to="resellers/add">
            <i class='bx bx-plus'></i> Create Reseller
          </NuxtLink>
        </template>
      </card-header>
      <card-body class="mx-4 table-responsive table-responsive-xl mt-2">
        <table id="resellers" class="table table-hover">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Merchant</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Created At</th>
            <th></th>
          </tr>
          </thead>
          <tbody></tbody>
        </table>
      </card-body>
    </card><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
import {apiAdminUrl} from "@/plugins/helpers/misc";
import {initDataTable} from "@/plugins/helpers/datatable";
import Swal from "sweetalert2";
import {nuxtLink} from "~/plugins/helpers/html";
import {user_status} from "~/plugins/status/user_status";

export default {
  name: "AdminResellerList",
  middleware: ['isAdmin'],
  head: {
    title: 'Resellers'
  },
  data() {
    return {
      table: null,
      breadcrumbs: [
        {
          name: 'Resellers',
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
    initDataTable('table#resellers', {
      ajax: {
        url: apiAdminUrl('resellers'),
        data: {}
      },
      reInitTable: {
        onFilterChange: true,
      },
      columns: [
        {data: 'id', name: 'reseller.id'},
        {data: 'username', name: 'reseller.username'},
        {data: 'full_name'},
        {data: 'merchant_full_name'},
        {data: 'email', name: 'reseller.email'},
        {data: 'phone_number', name: 'reseller.phone_number'},
        {data: 'status', name: 'reseller.status'},
        {data: 'created_at', name: 'reseller.created_at'},
        {data: 'id', name: 'reseller.id'},
      ],
      columnDefs: [
        {
          targets: 3,
          render(data, type, row) {
            return nuxtLink(`admin/merchants/${row['merchant_id']}`, row['merchant_full_name'], '')
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return user_status(row['status'])
          }
        }
      ],
      onRowClick: (e, tableRow, rowData) => {
        this.$router.push(`/admin/resellers/${rowData['id']}`)
      },
      dropdown: [
        {
          html: 'Edit',
          icon: 'edit-alt',
          onClick: data => {
            this.$router.push(`/admin/resellers/${data['id']}/edit`)
          }
        },
        {
          html: 'Delete',
          icon: 'trash-alt',
          onClick: data => {
            Swal.fire({
              title: 'Remove Reseller?',
              text: "You won't be able to revert this",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, remove!'
            }).then((result) => {
              if (result.isConfirmed) {
                this.xhrDelete(apiAdminUrl(`resellers/${data['id']}`)).then(() => {
                  Swal.fire(
                    'Reseller',
                    'Reseller has been removed',
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
