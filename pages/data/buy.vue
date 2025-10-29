<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <card class="mb-4">
          <card-header :loading="isFetchingPlans" loading-message="fetching plans...">
            <template v-slot:title>
              <span class="text-uppercase">Buy Data Bundle</span>
            </template>
            <template #desc>
              <a class="" href="#" @click.prevent="showBeneficiaryDialog">
                <i class="bx bx-user-voice"></i> Beneficiaries
              </a>
            </template>
          </card-header>
          <card-body>
            <div v-if="payment.payer_id">
              <div class="text-center text-primary">
                <v-icon class="text-primary" large>fa fa-check</v-icon>
                <div class="fw-bold">
                  Payment has been initialized
                </div>
              </div>
            </div>

            <div v-if="!payment.payer_id" class="mt-2">
              <form @submit.prevent="showConfirmationDialog">
                <Select2
                  id="network_provider_id"
                  :items="network_providers"
                  class="mb-3"
                  label="Network Provider"
                  name="network_provider_id"
                  placeholder="Choose Network Provider"
                  @select="handleNetworkProviderSelection"
                />

                <Select2
                  id="data_plan_id"
                  v-model="form.data_plan_id"
                  :disabled="!networkProviderId || isFetchingPlans"
                  :items="dropdown_data_plans"
                  class="mb-3"
                  label="Data Plan"
                  name="data_plan_id"
                  placeholder="Choose Data Plan"
                >
                  <template #label-desc>
                    <span class="badge text-dark" style="font-size: 15px">{{ planPrice }}</span>
                  </template>
                </Select2>

                <div class="mb-3">
                  <div class="d-flex justify-content-between">
                    <Label for="mobile_number">Phone Number</Label>
                    <div v-if="chosen_beneficiary" class="badge text-dark">{{ chosen_beneficiary['full_name'] }}</div>
                  </div>
                  <input
                    id="mobile_number"
                    v-model="form.mobile_number"
                    autocomplete="off"
                    class="form-control"
                    maxlength="14"
                    minlength="9"
                    placeholder="Phone Number"
                    required
                    type="number"
                  />
                </div>

                <div class="d-flex justify-content-between">
                  <div class="checkbox-wrapper">
                    <div class="form-check form-switch">
                      <input id="validate_phone_number" v-model="form.validate_phone_number" class="form-check-input"
                             type="checkbox">
                      <label class="form-check-label" for="validate_phone_number">Validate Number</label>
                    </div>
                  </div>

                  <Button
                    :disabled="payment.payer_id || isFetchingPlans || !form.mobile_number || !can_be_submitted"
                    :loading="loading"
                    class="fw-bold"
                    color="primary"
                    loading-message="Buying Data..."
                    size="sm"
                  >
                    <i class="bx bx-bolt-circle"></i>
                    Buy Data
                  </Button>
                </div>
              </form>
            </div>

          </card-body>
        </card>
      </div>
    </div>

    <!-- CONFIRMATION DIALOG -->
    <template>
      <v-dialog v-model="dialog_buy_data" max-width="600px" persistent>
        <v-card>
          <v-card-title class="d-flex justify-content-between border-bottom border-light">
            <div class="text-uppercase animate__animated text-secondary animate__backInLeft">
              Buy Data?
            </div>
            <div class="animate__animated animate__backInRight btn small-box fw-bold">
              {{ planPrice }}
            </div>
          </v-card-title>

          <v-card-text class="animate__animated animate__backInRight my-3">
            Are you sure you want to buy <b>{{ chosen_data_plan_name }}</b> data bundle to <b>{{
              form.mobile_number
            }}?</b>
          </v-card-text>

          <v-card-actions class="border-top border-light" style="margin-top: -20px">
            <v-spacer></v-spacer>
            <v-btn depressedcolor="primary" text type="submit" @click="buyDataBundle">
              Buy Data
            </v-btn>
            <v-btn color="blue darken-1" text type="button" @click="dialog_buy_data = false">
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <!-- SUCCESS DIALOG -->
    <template>
      <v-dialog v-model="dialog_processed" max-width="500px" persistent>
        <v-card>
          <v-card-text v-if="data_transaction">
            <div class="text-end pt-2">
              <v-btn outlined text rounded style="border-radius: 405px!important;" @click="dialog_processed = false">
                <i class="bx bxs-x-circle"></i>
              </v-btn>
            </div>
            <div class="text-center pt-4">
              <div>
                <check-success v-if="data_transaction.status === 'processed'"/>
                <i class="bx bx-error" style="font-size: 60px; color: red" v-if="data_transaction.status === 'failed'"/>
                <i class="bx bx-shape-triangle" style="font-size: 60px; color: coral" v-if="data_transaction.status === 'processing'"/>
              </div>
              <div class="mt-3" style="font-size: 21px">Data Transaction</div>
              <div class="mt-3" style="font-size: 19px">{{ processed_message }}</div>

              <div class="mt-5 text-end" v-if="data_transaction.status === 'processed'">
                <a target="_blank" :href="data_transaction.pdf_print_url">
                  <v-btn outlined text>
                    <i class="bx bxs-file-pdf"></i> PDF
                  </v-btn>
                </a>
                <a target="_blank" :href="data_transaction.image_print_url">
                  <v-btn outlined text>
                    <i class="bx bxs-file-image"></i> Image
                  </v-btn>
                </a>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>

    <!-- BENEFICIARIES DIALOG -->
    <PurchaseFormBeneficiaryDialog
      v-model="dialog_beneficiaries"
      @beneficiary="handleChosenBeneficiary"
    />
  </div>
</template>

<script>
import {clearFormData, cloneFormData, formatInputValue} from "@/plugins/helpers/form";
import {apiUrl, formatKobo, startWorking, stopWorking} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";
import {network_providers} from "~/plugins/network_providers";
import {DataTransaction} from "~/plugins/models/data.transaction";

export default {
  name: "buy-data",
  middleware: ['isAuth'],
  head: {
    title: 'Buy Data'
  },
  watch: {
    'form.amount': function (amount) {
      this.form.amount = formatInputValue(amount)
    },
    'form.mobile_number': function () {
      this.chosen_beneficiary = null
    },
    'form.data_plan_id': function (id) {
      for (let i = 0; i < this.data_plans.length; i++) {
        if (parseInt(id) === this.data_plans[i].data_plan_id) {
          this.planPrice = this.data_plans[i].plan_price
          this.chosen_data_plan_name = this.id_indexed_data_plans[this.data_plans[i].data_plan_id]
        }
      }
    }
  },
  computed: {
    can_be_submitted() {
      if (this.form.mobile_number) {
        const length = this.form.mobile_number.toString().length;
        return length >= 10 && length <= 14;
      }

      return false
    }
  },
  data() {
    return {
      processed_message: '',
      data_transaction: null,
      dialog_processed: false,
      endpoint_data_plan: '',
      endpoint_network_provider: '',
      loader: null,
      loading: false,
      dialog_buy_data: false,
      dialog_beneficiaries: false,
      isFetchingPlans: false,
      networkProviderId: '',
      planPrice: '',
      data_plans: [],
      id_indexed_data_plans: {},
      dropdown_data_plans: [],
      chosen_data_plan_name: null,
      chosen_beneficiary: null,
      payment: {
        "payer_id": null,
      },
      form: {
        data_amount: '',
        mobile_number: null,
        data_plan_id: null,
        validate_phone_number: true,
      },
      network_providers: network_providers(),
      breadcrumbs: [
        {
          name: 'Data Bundle',
          url: '/data'
        },
        {
          name: 'Buy Data',
        },
      ],
    }
  },
  methods: {
    showConfirmationDialog() {
      this.dialog_buy_data = true
    },
    showBeneficiaryDialog() {
      this.dialog_beneficiaries = true
    },
    handleChosenBeneficiary(beneficiary) {
      this.form.mobile_number = beneficiary.chosen.mobile_number

      setTimeout(() => {
        this.chosen_beneficiary = beneficiary

        $('select#custom-select2-network_provider_id')
          .val(1)
          .trigger('change')

        this.handleNetworkProviderSelection(beneficiary.chosen.network_provider_id)

        this.dialog_beneficiaries = false
      }, 50)
    },
    handleNetworkProviderSelection(id) {
      this.networkProviderId = id
      this.isFetchingPlans = true
      this.endpoint_data_plan = apiUrl(`network-providers/${id}/data-plans`)

      this.xhrGet(apiUrl(`network-providers/${id}/buyable-plans`))
        .then(resp => {
          const plans = resp.data.data;

          this.data_plans = []
          this.dropdown_data_plans = plans.map(plan => {
            plan.plan_price = formatKobo(plan.plan_price);
            this.data_plans.push(plan)

            this.id_indexed_data_plans[plan['data_plan_id']] = plan['dp_name'];

            return {
              id: plan['data_plan_id'],
              text: plan['dp_name'],
            }
          });
        })
        .finally(() => this.isFetchingPlans = false)
    },
    buyDataBundle() {
      this.loading = true
      startWorking('Buying');
      this.dialog_buy_data = false

      const payload = cloneFormData(this.form);

      if (this.chosen_beneficiary) {
        payload.beneficiary_id = this.chosen_beneficiary['beneficiary_id']
      }

      const timeout = setTimeout(() => {
        stopWorking()

        Swal.fire({
          title: 'Data Transaction',
          html: 'Something is not right, please verify your data transaction manually!',
          icon: 'warning'
        }).then(() => {
          this.$router.push('/data')
        })
      }, 75000);

      this.xhrPost(apiUrl(`data`), payload)
        .then(resp => {
          this.loading = false

          this.data_transaction = DataTransaction.fromData(resp.data.data).prepareData()

          if (this.data_transaction.status === 'processed') {
            this.processed_message = 'Data transaction succeeded'
          } else if (this.data_transaction.status === 'processing') {
            this.processed_message = 'Your data transaction is being processed'
          } else {
            this.processed_message = 'Data transaction failed'
          }

          this.dialog_processed = true

          clearFormData(this.form)

          this.networkProviderId = ''
          this.planPrice = ''
          this.form.validate_phone_number = true
          $('select').val(null).trigger('change')
        })
        .finally(() => {
          this.loading = false
          stopWorking()
          clearTimeout(timeout)
        })
    },
  },
  mounted() {
    this.dataBankId = this.$route.query.did
    this.endpoint_network_provider = apiUrl('network-providers')
  }
}
</script>

<style scoped>

</style>
