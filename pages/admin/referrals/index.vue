<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <TableResponsiveFilter :statuses="filterStatuses"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template v-slot:title>Referrals</template>
        <template v-slot:desc>
          <NuxtLink class="btn btn-sm btn-primary text-white fw-bold" to="referrals/create">
            <v-icon class="text-white" small>fas fa-plus</v-icon>
            Create Referral
          </NuxtLink>
        </template>
      </card-header>
      <card-body class="mx-4 table-responsive table-responsive-xl mt-2">
        <table id="referrals" class="table table-hover">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Created By</th>
            <th>Beneficiary Type</th>
            <th>Type</th>
            <th>Bonus Amount</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody></tbody>
        </table>
      </card-body>
    </card><!-- .card-preview -->
  </div><!-- wrapper -->
</template>

<script>
import {apiAdminUrl, formatKobo} from "@/plugins/helpers/misc";
import {initDataTable} from "@/plugins/helpers/datatable";
import Swal from "sweetalert2";
import {User} from "@/plugins/models/user";
import {Referral} from "~/plugins/models/referral";

export default {
  name: "AdminReferralList",
  middleware: ['isAdmin'],
  head: {
    title: 'Referrals'
  },
  data() {
    return {
      $table: null,
      breadcrumbs: [
        {
          name: 'Referrals',
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
    const $nuxt = this;

    initDataTable('table#referrals', {
      ajax: {
        url: apiAdminUrl('referrals'),
        data: {}
      },
      reInitTable: {
        onFilterChange: true,
      },
      columns: [
        {data: 'referral_id'},
        {data: 'creator_first_name', name: 'creator.first_name'},
        {data: 'beneficiary_type'},
        {data: 'type'},
        {data: 'bonus_amount'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'referral_id'},
      ],
      columnDefs: [
        {
          targets: 1,
          render(data, type, row) {
            return User.fromData(row).viewPageLink('admin', 'created_by', 'creator')
          }
        },
        {
          targets: 3,
          render(data, type, row) {
            return Referral.fromData(row).displayableType()
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return formatKobo(row['bonus_amount'])
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return Referral.fromData(row).statusBadge()
          }
        },
      ],
      onRowClick: (e, tableRow, rowData) => {
        this.$router.push(`/admin/referrals/${rowData['referral_id']}`)
      },
      dropdown: [
        {
          html: 'Edit',
          icon: 'edit-alt',
          showIf: {status: 'active'},
          onClick: data => {
            this.$router.push(`/admin/referrals/${data['referral_id']}/edit`)
          }
        },
        {
          html: 'Disable',
          icon: 'trash-alt',
          showIf: {status: 'active'},
          onClick: data => {
            Swal.fire({
              title: 'Disable Referral?',
              text: "You won't be able to revert this",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, disable!'
            }).then((result) => {
              if (result.isConfirmed) {
                $nuxt.xhrPatch(apiAdminUrl(`referrals/${data['referral_id']}/deactivate`)).then(() => {
                  Swal.fire(
                    'Referral',
                    'Referral has been disabled',
                    'success'
                  ).then(() => this.$table.ajax.reload())
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
