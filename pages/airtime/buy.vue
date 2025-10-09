<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <card class="mb-4">
          <card-header>
            <template #title>
              <span class="text-uppercase">Buy Airtime</span>
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
                  v-if="false"
                  id="airtime_type"
                  v-model="form.airtime_type"
                  :disabled="!form.network_provider_id"
                  :items="dropdown_airtime_types"
                  class="mb-2"
                  label="Airtime Type"
                  name="airtime_type"
                  placeholder="Choose Airtime Type"
                />

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

                <div class="mb-3">
                  <div class="d-flex justify-content-between">
                    <Label for="airtime_amount">Airtime Amount</Label>
                    <div v-if="chosen_beneficiary" class="badge text-dark">{{ airtimePrice }}</div>
                  </div>
                  <input
                    id="airtime_amount"
                    v-model="form.airtime_amount"
                    :disabled="!form.network_provider_id"
                    autocomplete="off"
                    class="form-control"
                    placeholder="N100"
                    required
                  />
                </div>

                <div class="d-flex justify-content-between">
                  <div class="checkbox-wrapper">
                    <div class="form-check form-switch mb-2">
                      <input id="validate_phone_number" v-model="form.validate_phone_number" class="form-check-input"
                             type="checkbox">
                      <label class="form-check-label" for="validate_phone_number">Validate Number</label>
                    </div>
                  </div>

                  <Button
                    :disabled="payment.payer_id || !form.mobile_number || !can_be_submitted"
                    :loading="loading"
                    class="fw-bold"
                    color="primary"
                    loading-message="Buying Airtime..."
                    size="sm"
                  >
                    <i class="bx bx-bolt-circle"></i>
                    Buy Airtime
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
              Buy Airtime?
            </div>
            <div class="animate__animated animate__backInRight btn small-box fw-bold">
              {{ airtimePrice }}
            </div>
          </v-card-title>

          <v-card-text class="animate__animated animate__backInRight my-3">
            Are you sure you want to buy <b>{{ formatted_airtime_amount }}</b> airtime to
            <b>{{ form.mobile_number }}?</b>
          </v-card-text>

          <v-card-actions class="border-top border-light" style="margin-top: -20px">
            <v-spacer></v-spacer>
            <v-btn depressedcolor="primary" text type="submit" @click="buyAirtime">
              Buy Airtime
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
          <v-card-text v-if="airtime_transaction">
            <div class="text-end pt-2">
              <v-btn outlined text rounded style="border-radius: 405px!important;" @click="dialog_processed = false">
                <i class="bx bxs-x-circle"></i>
              </v-btn>
            </div>
            <div class="text-center pt-4">
              <div>
                <check-success/>
              </div>
              <div class="mt-3" style="font-size: 21px">Airtime Transaction</div>
              <div class="mt-3" style="font-size: 19px">{{ processed_message }}</div>

              <div class="mt-5 text-end">
                <a target="_blank" :href="airtime_transaction.pdf_print_url">
                  <v-btn outlined text>
                    <i class="bx bxs-file-pdf"></i> PDF
                  </v-btn>
                </a>
                <a target="_blank" :href="airtime_transaction.image_print_url">
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
import {clearFormData, cloneFormData, formatInputValue, removeCommas} from "@/plugins/helpers/form";
import {apiUrl, formatMoneyAmount, startWorking, stopWorking} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";
import {AirtimeTransaction} from "~/plugins/models/airtime.transaction";

export default {
  name: "buy-data",
  head: {
    title: 'Buy Airtime'
  },
  watch: {
    'form.airtime_amount': function (amount) {
      if (amount) {
        this.form.airtime_amount = formatInputValue(amount)
        this.formatted_airtime_amount = formatMoneyAmount(removeCommas(amount))
        this.calculatePrice()
      }
    },
    'form.mobile_number': function () {
      this.chosen_beneficiary = null
    },
    'form.airtime_type': function (id) {
      this.calculatePrice()
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
      airtime_transaction: null,
      dialog_processed: false,
      endpoint_data_plan: '',
      endpoint_network_provider: '',
      loader: null,
      loading: false,
      dialog_buy_data: false,
      dialog_beneficiaries: false,
      networkProviderId: '',
      airtimePrice: '',
      data_plans: [],
      chosen_beneficiary: null,
      formatted_airtime_amount: null,
      payment: {
        "payer_id": null,
      },
      form: {
        airtime_amount: '',
        mobile_number: '',
        airtime_type: 'VTU',
        network_provider_id: null,
        validate_phone_number: true,
      },
      network_providers: [
        {
          "id": 1,
          "text": "MTN"
        },
        {
          "id": 2,
          "text": "Airtel"
        },
        {
          "id": 3,
          "text": "9mobile"
        },
        {
          "id": 4,
          "text": "GLO"
        }
      ],
      dropdown_airtime_types: [],
      breadcrumbs: [
        {
          name: 'Airtime',
          url: '/airtime'
        },
        {
          name: 'Buy Airtime',
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
      this.form.network_provider_id = id
      this.networkProviderId = id

      if (parseInt(id) === 1) {
        this.dropdown_airtime_types = [
          {
            id: 'VTU',
            text: 'VTU',
          },
          {
            id: 'Share and Sell',
            text: 'Share and Sell',
          }
        ]
      } else {
        this.dropdown_airtime_types = [
          {
            id: 'VTU',
            text: 'VTU',
          },
        ]
      }
    },
    calculatePrice() {
      const cleanedAirtimeAmount = removeCommas(this.form.airtime_amount)
      if (cleanedAirtimeAmount) {
        if (cleanedAirtimeAmount >= 50) {
          const percentAirtimeAmount = cleanedAirtimeAmount / 100

          if (this.form.airtime_type === 'VTU') {
            this.airtimePrice = formatMoneyAmount(cleanedAirtimeAmount - (percentAirtimeAmount * 3))
          }
        } else {
          this.airtimePrice = null
        }
      }
    },
    buyAirtime() {
      this.loading = true
      startWorking('Buying');
      this.dialog_buy_data = false

      const payload = cloneFormData(this.form);
      console.log(payload)
      payload.airtime_amount = removeCommas(payload.airtime_amount)

      if (this.chosen_beneficiary) {
        payload.beneficiary_id = this.chosen_beneficiary['beneficiary_id']
      }

      const timeout = setTimeout(() => {
        stopWorking()

        Swal.fire({
          title: 'Airtime Transaction',
          html: 'Something is not right, please verify your airtime transaction manually!',
          icon: 'warning'
        }).then(() => {
          this.$router.push('/airtime')
        })
      }, 75000);

      this.xhrPost(apiUrl(`airtime`), payload)
        .then(resp => {
          this.loading = false

          this.processed_message = resp.data.data.status === 'processing'
            ? 'Your airtime transaction is being processed'
            : 'Airtime transaction succeeded'

          this.airtime_transaction = AirtimeTransaction.fromData(resp.data.data).prepareData()

          this.dialog_processed = true

          clearFormData(this.form)

          this.airtimePrice = ''
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
    this.endpoint_network_provider = apiUrl('network-providers')
  }
}
</script>

<style scoped>

</style>
