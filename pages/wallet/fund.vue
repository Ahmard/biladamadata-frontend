<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-9">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0 text-uppercase">Fund Wallet</h5>
            <small class="text-muted float-end fw-bold text-uppercase">
              <span class="" style="color: #ce6a6a" v-html="htmlCharges"></span>
              <span class="" style="color: #ce6a6a">Charges</span>
            </small>
          </div>
          <div class="card-body">
            <div v-if="payment.payer_id">
              <div class="text-center text-primary">
                <v-icon class="text-primary" large>fa fa-check</v-icon>
                <div class="fw-bold">
                  Payment has been initialized
                </div>
              </div>
            </div>

            <div v-if="!payment.payer_id">
              <form @submit.prevent="save">
                <div v-if="payment_gateway === 'paystack'" class="alert alert-warning fw-bold" role="alert"
                     style="box-shadow: 0 0.125rem 0.25rem rgb(161 172 184 / 20%) !important;">
                  <div class="d-flex justify-content-between">
                    <span>
                      <i class="bx bx-info-circle"></i>
                      We advice you fund your wallet with amount below {{ warningMoney }} for lower charges
                    </span>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="d-flex justify-content-between">
                    <label class="form-label mb-0" for="amount">Amount</label>
                    <div>
                      <span>Beneficial:</span>
                      <span class="text-primary fw-bold" v-html="htmlBeneficialAmount"></span>
                    </div>
                  </div>
                  <input id="amount" v-model="form.amount" class="form-control form-control-lg" placeholder="Amount of money"
                         required type="text"/>
                </div>
                <div class="text-end">
                  <Button
                    :disabled="payment.payer_id || !can_be_submitted"
                    :loading="loading"
                    class="fw-bold"
                    color="primary"
                    loading-message="Funding..."
                    size="md"
                  >
                    <v-icon class="text-white" small>fas fa-wallet</v-icon>
                    Fund Wallet
                  </Button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-9">
        <AccountNumbers
          v-if="acc_nums.length"
          :acc-nums="acc_nums"
          :endpoint="apiUrl('profile/van')"
          card-height="360px"
          col-size="4"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {cloneFormData, formatInputValue, removeCommas} from "@/plugins/helpers/form";
import {apiUrl, formatKobo, toKobo} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";
import {Payment} from "~/plugins/models/payment";
import AccountNumbers from "~/components/Wallet/AccountNumbers.vue";

export default {
  name: "fund",
  components: {AccountNumbers},
  middleware: ['isAuth'],
  head: {
    title: 'Fund Wallet'
  },
  watch: {
    'form.amount': function (amount) {
      this.form.amount = formatInputValue(amount)
      const cleanedAmount = Math.round(removeCommas(amount))

      if (cleanedAmount > 1_000_000) {
        this.form.amount = "1000000"
        return;
      }

      if (cleanedAmount >= 50) {
        const calculated_price = Payment.calculatePrice(this.$auth.user.app_settings, cleanedAmount)

        this.can_be_submitted = true
        this.htmlCharges = formatKobo(calculated_price.charges)
        this.htmlBeneficialAmount = formatKobo(calculated_price.beneficial)

      } else {
        this.can_be_submitted = false
        this.htmlBeneficialAmount = 'N/A'
      }
    }
  },
  data() {
    return {
      loader: null,
      loading: false,
      acc_nums: [],
      can_be_submitted: false,
      is_fetching_acc_num: true,
      dataBankId: '',
      htmlBeneficialAmount: '',
      htmlCharges: formatKobo(toKobo(15)),
      warningMoney: formatKobo(250_000, 0),
      payment_gateway: 'paystack',
      payment: {
        "payer_id": null,
      },
      form: {
        amount: '',
      },
      breadcrumbs: [
        {
          name: 'Wallet',
          url: '/wallet'
        },
        {
          name: 'Fund Wallet',
        },
      ],
    }
  },
  methods: {
    apiUrl,
    formatKobo,
    save() {
      this.loading = true

      const payload = cloneFormData(this.form);
      payload.amount = removeCommas(payload.amount);

      this.xhrPost(apiUrl(`payments/init`), payload)
        .then(resp => {
          this.loading = false
          const payment = Payment.fromData(resp.data.data)
          this.payment = payment

          Swal.fire({
            title: 'Payment',
            html: 'Payment has been initialized',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/wallet/funding-history/${payment.payment_id}`)
          })
        })
        .catch(() => this.loading = false)
    },
  },
  mounted() {
    this.dataBankId = this.$route.query.did

    this.payment_gateway = this.$auth.user.app_settings.payment_gateway

    this.htmlCharges = this.payment_gateway === 'paystack'
      ? formatKobo(toKobo(50))
      : formatKobo(toKobo(15));

    this.acc_nums = this.$auth.user.acc_nums
  }
}
</script>

<style scoped>
</style>
