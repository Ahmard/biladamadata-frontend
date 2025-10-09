<template>

  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-sm-5 col-md-5">
        <card>
          <card-header :loading="is_fetching">
            <template #title>Beneficiary Information</template>
          </card-header>
          <card-body v-if="beneficiary">
            <div class="row mt-2">
              <div class="col-md-4">
                <div class="text-muted">Full Name</div>
                <div>{{ beneficiary.full_name }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Total Numbers</div>
                <div>{{ beneficiary.total_mobile_numbers }}</div>
              </div>
              <div class="col-md-4">
                <div class="text-muted">Timestamp</div>
                <div>{{ beneficiary.created_at }}</div>
              </div>
            </div>

            <div class="text-end mt-3">
              <dropdown>
                <template #items>
                  <dropdown-item icon="edit" @click="showBeneficiaryUpdateDialog">Edit</dropdown-item>
                  <dropdown-item icon="trash" @click="showBeneficiaryDeletionDialog">Delete</dropdown-item>
                </template>
              </dropdown>
            </div>
          </card-body>
        </card>
      </div>

      <div v-if="beneficiary" class="col-sm-7 col-md-7">
        <card>
          <card-header>
            <template #title>Beneficiary Numbers</template>
            <template #desc>
              <button class="btn btn-sm btn-outline-secondary" @click.prevent="showNumberAddDialog">
                <i class="bx bx-plus-circle"></i> Add Number
              </button>
            </template>
          </card-header>
          <card-body class="table-responsive table-responsive-md">
            <table id="mobile-numbers" class="mt-1 table table-hover text-sm-h6">
              <thead>
              <tr>
                <th>Mobile Number</th>
                <th>Network</th>
                <th>Added At</th>
                <th></th>
              </tr>
              </thead>
              <tbody></tbody>
            </table>
          </card-body>
        </card>
      </div>
    </div>

    <Confirm
      v-if="beneficiary"
      v-model="dialog_delete_beneficiary"
      :message="`Are you sure you want to delete <b>${beneficiary['full_name']}</b>?<br/>Please know that this cannot be reversed!`"
      title="Delete Beneficiary?"
      @confirmed="beneficiaryDeletionConfirmed"
    />

    <Confirm
      v-if="beneficiary"
      v-model="dialog_delete_mobile_number"
      :message="`Are you sure you want to remove <b>${current_mobile_number['mobile_number']}</b>?`"
      title="Remove Number?"
      @confirmed="numberDeletionConfirmed"
    />

    <BeneficiaryCreateUpdateForm
      :key="dialog_beneficiary_update_component_key"
      v-model="dialog_update_beneficiary"
      :beneficiary="beneficiary"
      :is_create_mode="is_create_mode"
      :is_update_mode="is_update_mode"
      endpoint-prefix="admin/"
      @updated="handleBeneficiaryUpdated"
    />

    <BeneficiaryMobileNumberAddUpdateForm
      :key="dialog_number_create_update_component_key"
      v-model="dialog_update_mobile_number"
      :beneficiary="beneficiary"
      :is_create_mode="is_create_mode"
      :is_update_mode="is_update_mode"
      :mobile_number="current_mobile_number"
      endpoint-prefix="admin/"
      @created="handleCreated"
      @updated="handleUpdated"
    />

    <table-responsive-modal
      v-model="dialog_number_small_screen"
      title="Mobile Number">
      <div class="list-group list-group-flush">
        <div class="list-group-item">
          <b>Number:</b> {{ current_mobile_number['mobile_number'] }}
        </div>
        <div class="list-group-item">
          <b>Network:</b> {{ current_mobile_number['np_name'] }}
        </div>
      </div>

      <template #footer>
        <dropdown>
          <template #items>
            <dropdown-item icon="edit" @click="showNumberUpdateDialog">Edit</dropdown-item>
            <dropdown-item icon="trash" @click="showNumberDeleteDialog">Delete</dropdown-item>
          </template>
          <template #button>
            <a
              class="btn btn-sm btn-outline-secondary dropdown-toggle me-3"
              data-bs-toggle="dropdown"
              href="#"
              type="button"
            >
              <i class="icon ni ni-chevron-down"></i> Action
            </a>
          </template>
        </dropdown>
        <a
          class="btn btn-sm btn-outline-secondary"
          data-bs-toggle="dropdown"
          href="#"
          type="button"
          @click="dialog_number_small_screen = false"
        >
          Close
        </a>
      </template>
    </table-responsive-modal>

  </div>
</template>

<script>
import {apiAdminUrl, isMobileDevice, startWorking, stopWorking} from "~/plugins/helpers/misc";
import {Beneficiary} from "~/plugins/models/beneficiary";
import {initDataTable} from "~/plugins/helpers/datatable";
import Alert from "~/plugins/helpers/alert";

export default {
  name: "BeneficiaryShow",
  data() {
    return {
      table: {},
      is_fetching: true,
      is_create_mode: false,
      is_update_mode: false,
      beneficiary_id: null,
      current_mobile_number: {},
      beneficiary: null,
      dialog_number_small_screen: false,
      dialog_update_mobile_number: false,
      dialog_update_beneficiary: false,
      dialog_delete_beneficiary: false,
      dialog_delete_mobile_number: false,
      dialog_number_create_update_component_key: Date.now(),
      dialog_beneficiary_update_component_key: 'ben-' + Date.now(),
      breadcrumbs: [
        {
          name: 'Beneficiaries',
          url: '/admin/beneficiaries'
        },
        {
          name: 'Info',
        },
      ],
    }
  },
  methods: {
    showBeneficiaryUpdateDialog() {
      this.dialog_beneficiary_update_component_key = 'ben-' + Date.now()

      this.is_update_mode = true
      this.is_create_mode = false
      this.dialog_update_beneficiary = true
    },
    showNumberAddDialog() {
      this.dialog_number_create_update_component_key = Date.now()

      this.is_update_mode = false
      this.is_create_mode = true
      this.dialog_update_mobile_number = true
    },

    showNumberUpdateDialog() {
      this.dialog_number_create_update_component_key = Date.now()

      this.is_update_mode = true
      this.is_create_mode = false
      this.dialog_update_mobile_number = true
    },

    showNumberDeleteDialog() {
      this.dialog_delete_mobile_number = true
    },

    showBeneficiaryDeletionDialog() {
      this.dialog_delete_beneficiary = true
    },

    handleBeneficiaryUpdated() {
      this.fetchInfo()
    },

    handleCreated() {
      this.table.ajax.reload()
    },

    handleUpdated(number) {
      this.current_mobile_number = number
      this.table.ajax.reload()
    },

    beneficiaryDeletionConfirmed() {
      startWorking('Deleting')
      this.xhrDelete(apiAdminUrl(`beneficiaries/${this.beneficiary['beneficiary_id']}`))
        .then(() => {
          Alert.success({
            title: 'Beneficiary',
            html: 'Beneficiary has been deleted successfully',
            redirect_url: '/admin/beneficiaries'
          })
        })
        .finally(stopWorking)
    },

    numberDeletionConfirmed() {
      startWorking('Deleting')
      this.xhrDelete(apiAdminUrl(`beneficiaries/${this.beneficiary['beneficiary_id']}/mobile-numbers/${this.current_mobile_number['bmn_id']}`))
        .then(() => {
          this.table.ajax.reload()
          this.dialog_number_small_screen = false

          Alert.success({
            title: 'Mobile Number',
            html: 'Mobile number has been deleted successfully'
          })
        })
        .finally(stopWorking)
    },

    async fetchInfo() {
      this.is_fetching = true
      const resp = await this.xhrGet(apiAdminUrl(`beneficiaries/${this.beneficiary_id}`));
      this.beneficiary = Beneficiary.fromData(resp.data.data).prepareData()
      this.is_fetching = false
    },

    fetchMobileNumbers() {
      initDataTable('table#mobile-numbers', {
        url: apiAdminUrl(`beneficiaries/${this.beneficiary_id}/mobile-numbers`),
        responsiveExpander: false,
        onInit: table => this.table = table,
        onRowClick: (e, row, data) => {
          console.log(isMobileDevice())
          if (isMobileDevice()) {
            this.current_mobile_number = data
            this.dialog_number_small_screen = true
          }
        },
        columns: [
          {data: 'mobile_number'},
          {data: 'np_name', name: 'network_providers.np_name'},
          {data: 'created_at'},
          {data: 'bmn_id'},
        ],
        columnDefs: [
          {targets: 0, responsivePriority: 1},
          {targets: 1, responsivePriority: 2},
          {targets: 3, responsivePriority: 3},
        ],
        dropdown: [
          {
            html: 'Edit',
            icon: 'edit',
            onClick: data => {
              this.current_mobile_number = data
              this.showNumberUpdateDialog()
            }
          },
          {
            html: 'Remove',
            icon: 'trash',
            onClick: data => {
              this.current_mobile_number = data
              this.showNumberDeleteDialog()
            }
          },
        ]
      })
    },
  },
  async mounted() {
    this.beneficiary_id = this.$route.params.id
    await this.fetchInfo()

    if (this.beneficiary) {
      this.fetchMobileNumbers()
    }
  }
}
</script>

<style scoped>

</style>
