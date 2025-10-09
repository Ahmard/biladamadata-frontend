<template>
  <div>
    <table class="mt-1 table table-hover" :id="tableId">
      <thead>
      <tr>
        <th>#ID</th>
        <th>Full Name</th>
        <th v-if="withOwner">Owner</th>
        <th>Mobile Number</th>
        <th>Total Numbers</th>
        <th>Created At</th>
        <th></th>
      </tr>
      </thead>
      <tbody></tbody>
    </table>

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
      @confirmed="deletionConfirmed"
      title="Delete Beneficiary?"
      :message="dialog_deletion_message"
    />

    <BeneficiaryCreateUpdateForm
      v-model="dialog_update_info"
      :key="dialog_created_update_component_key"
      :is_create_mode="is_create_mode"
      :is_update_mode="is_update_mode"
      :beneficiary="current_beneficiary"
      endpoint-prefix="admin/"
      @updated="handleUpdated"
    />
  </div>
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiUrl, startWorking, stopWorking} from "~/plugins/helpers/misc";
import {Beneficiary} from "~/plugins/models/beneficiary";
import Alert from "~/plugins/helpers/alert";

export default {
  name: "List",
  props: {
    userId: {default: null},
    withOwner: {default: null},
    tableId: {default: 'beneficiaries'},
    withPageLength: {default: 5},
    endpoint: {default: null},
    redirectAfterDeletion: {default: false},
  },
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
    handleUpdated() {
      this.table.ajax.reload()
    },

    deletionConfirmed() {
      startWorking('Deleting')
      this.xhrDelete(apiUrl(`admin/beneficiaries/${this.current_beneficiary['beneficiary_id']}`))
        .then(() => {
          this.table.ajax.reload()
          Alert.success({
            title: 'Beneficiary',
            html: 'Beneficiary has been deleted successfully',
            redirect_url: this.redirectAfterDeletion
              ? '/beneficiaries'
              : undefined
          })
        })
        .finally(stopWorking)
    }
  },
  mounted() {
    initDataTable(`table#${this.tableId}`, {
      url: this.endpoint,
      responsiveExpander: false,
      pageLength: this.withPageLength,
      onInit: table => {
        this.table = table
        this.$emit('tableInit', table)
      },
      onRowClickRedirect: data => `/admin/beneficiaries/${data['beneficiary_id']}`,
      order: [[0, 'desc']],
      columns: [
        {data: 'beneficiary_id'},
        {data: 'full_name'},
        {data: 'owner_full_name', showIfOnly: () => this.withOwner},
        {data: 'first_mobile_number', searchable: false},
        {data: 'total_mobile_numbers', searchable: false},
        {data: 'created_at'},
        {data: 'beneficiary_id'},
      ],
      columnDefs: [
        {targets: 1, responsivePriority: 1},
        {
          targets: 2,
          responsivePriority: 2,
          searchable: false,
          showIfOnly: () => this.withOwner,
          render(data, type, row) {
            return Beneficiary.fromData(row).prepareData().owner_full_name_view_page
          }
        },
        {targets: 3, responsivePriority: 3},
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
