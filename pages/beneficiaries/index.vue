<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template #title>Beneficiaries</template>
        <template #desc>
          <button class="btn btn-sm btn-outline-secondary" @click.prevent="showAddDialog">
            <i class="bx bx-plus-circle"></i> Add Beneficiary
          </button>
        </template>
      </card-header>
      <card-body class="table-responsive table-responsive-md">
        <table id="beneficiaries" class="mt-1 table table-hover">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Full Name</th>
            <th>Mobile Number</th>
            <th>Created At</th>
            <th></th>
          </tr>
          </thead>
          <tbody></tbody>
        </table>
      </card-body>
    </card>

    <table-responsive-modal v-model="dialog_show_info" title="Beneficiary Information">
      <div class="list-group list-group-flush">
        <div class="list-group-item">
          <b>Full Name:</b> {{ current_beneficiary['full_name'] }}
        </div>
        <div class="list-group-item">
          <b>Mobile Number:</b> {{ current_beneficiary['full_name'] }}
        </div>
      </div>
    </table-responsive-modal>

    <Confirm
      v-model="dialog_delete_beneficiary"
      :message="dialog_deletion_message"
      title="Delete Beneficiary?"
      @confirmed="deletionConfirmed"
    />

    <BeneficiaryCreateUpdateForm
      :key="dialog_created_update_component_key"
      v-model="dialog_update_info"
      :beneficiary="current_beneficiary"
      :is_create_mode="is_create_mode"
      :is_update_mode="is_update_mode"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>


<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiUrl, startWorking, stopWorking} from "~/plugins/helpers/misc";
import BeneficiaryDialog from "~/components/PurchaseForm/BeneficiaryDialog.vue";
import Alert from "~/plugins/helpers/alert";

export default {
  name: "index",
  components: {BeneficiaryDialog},
  data() {
    return {
      table: {},
      is_read_mode: true,
      is_create_mode: false,
      is_update_mode: false,
      current_beneficiary: {},
      dialog_show_info: false,
      dialog_update_info: false,
      dialog_delete_beneficiary: false,
      dialog_title: 'Beneficiary Information',
      dialog_deletion_message: null,
      dialog_created_update_component_key: Date.now(),
      breadcrumbs: [
        {
          name: 'Beneficiaries'
        }
      ]
    }
  },
  methods: {
    showAddDialog() {
      this.is_update_mode = false
      this.is_create_mode = true
      this.dialog_update_info = true

      this.dialog_created_update_component_key = Date.now()
    },

    handleCreated() {
      this.table.ajax.reload()
    },

    handleUpdated() {
      this.table.ajax.reload()
    },

    deletionConfirmed() {
      startWorking('Deleting')
      this.xhrDelete(apiUrl(`beneficiaries/${this.current_beneficiary['beneficiary_id']}`))
        .then(() => {
          this.table.ajax.reload()
          Alert.success({
            title: 'Beneficiary',
            html: 'Beneficiary has been deleted successfully',
            redirect_url: '/beneficiaries'
          })
        })
        .finally(stopWorking)
    }
  },
  mounted() {
    initDataTable('table#beneficiaries', {
      url: apiUrl('beneficiaries'),
      responsiveExpander: false,
      order: [[0, 'desc']],
      onInit: table => this.table = table,
      // onRowClick: (e, row, data) => {
      //   this.dialog_show_info = false
      //
      //   if (isMobileDevice()) {
      //     setTimeout(() => {
      //       this.current_beneficiary = data;
      //       this.dialog_show_info = true
      //     }, 200)
      //   }
      // },
      onRowClickRedirect: data => `/beneficiaries/${data['beneficiary_id']}`,
      columns: [
        {data: 'beneficiary_id'},
        {data: 'full_name'},
        {data: 'first_mobile_number'},
        {data: 'created_at'},
        {data: 'beneficiary_id'},
      ],
      columnDefs: [
        {targets: 1, responsivePriority: 1},
        {targets: 2, responsivePriority: 2, searchable: false},
        {targets: 4, responsivePriority: 3},
      ],
      dropdown: [
        {
          html: 'Edit',
          icon: 'edit',
          onClick: data => {
            this.dialog_created_update_component_key = Date.now()

            this.is_update_mode = true
            this.is_create_mode = false
            this.current_beneficiary = data
            this.dialog_update_info = true
          }
        },
        {
          html: 'Delete',
          icon: 'trash',
          onClick: data => {
            this.dialog_deletion_message = `Are you sure you want to delete <b>${data['full_name']}</b>?<br/>Please know that this cannot be reversed!`
            this.current_beneficiary = data
            this.dialog_delete_beneficiary = true
          }
        },
      ]
    })
  }
}
</script>

<style scoped>

</style>
