<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <TableResponsiveFilter :statuses="filterStatuses"/>

    <card class="mt-2">
      <CardHeader>
        <template v-slot:title>Resellers</template>
        <template v-slot:desc>
          <NuxtLink class="btn btn-sm btn-primary fw-bold" to="resellers/add">
            <i class='bx bx-plus'></i> Create Reseller
          </NuxtLink>
        </template>
      </CardHeader>
      <div class="mx-4 table-responsive table-responsive-md table-responsive-xl mt-2">
        <table id="users" class="table table-hover">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </card><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
import {apiMerchantUrl} from "@/plugins/helpers/misc";
import {initDataTable} from "@/plugins/helpers/datatable";
import Swal from "sweetalert2";
import {user_status} from "~/plugins/status/user_status";
import {User} from "~/plugins/models/user";

export default {
  name: "MerchantResellerList",
  middleware: ['isMerchant'],
  head: {
    title: 'Resellers'
  },
  data() {
    return {
      showFilters: false,
      $table: null,
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
    initDataTable('table#users', {
      ajax: {
        url: apiMerchantUrl('resellers'),
        data: {}
      },
      reInitTable: {
        onFilterChange: true,
      },
      onRowClickRedirect: (data) => {
        return `resellers/${data['id']}`
      },
      columns: [
        {data: 'id', name: 'reseller.id'},
        {data: 'first_name', name: 'reseller.first_name'},
        {data: 'email', name: 'reseller.email'},
        {data: 'phone_number', name: 'reseller.phone_number'},
        {data: 'status', name: 'reseller.status'},
        {data: 'created_at', name: 'reseller.created_at'},
        {data: 'id', name: 'reseller.id'},
      ],
      columnDefs: [
        {
          targets: 1,
          render(data, type, row) {
            return User.fromData(row).fullName()
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return user_status(row['status'])
          }
        }
      ],
      dropdown: [
        {
          html: 'Edit',
          icon: 'edit-alt',
          onClick: data => {
            this.$router.push(`/merchant/resellers/${data['id']}/edit`)
          }
        },
        {
          html: 'Activate',
          icon: 'check-circle',
          showIf: {status: 'inactive'},
          onClick: data => {
            Swal.fire({
              title: 'Activate Reseller',
              text: "Are you sure you want activate this user?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, activate!'
            }).then((result) => {
              if (result.isConfirmed) {
                this.xhrPatch(apiMerchantUrl(`resellers/${data['id']}/activate`)).then(() => {
                  this.$table.ajax.reload()
                  Swal.fire(
                    'Reseller',
                    'Reseller has been activated',
                    'success'
                  )
                })
              }
            })
          }
        },
        {
          html: 'Deactivate',
          icon: 'check-circle',
          showIf: {status: 'active'},
          onClick: data => {
            Swal.fire({
              title: 'Deactivate Reseller',
              text: "Are you sure you want deactivate this user?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, deactivate!'
            }).then((result) => {
              if (result.isConfirmed) {
                this.xhrPatch(apiMerchantUrl(`resellers/${data['id']}/deactivate`)).then(() => {
                  this.$table.ajax.reload()
                  Swal.fire(
                    'Reseller',
                    'Reseller has been deactivated',
                    'success'
                  )
                })
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
