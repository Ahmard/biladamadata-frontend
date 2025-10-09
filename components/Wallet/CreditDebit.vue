<template>
  <div class="flex-grow-1 container-p-y">

    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0 text-uppercase">{{ action }} Wallet</h5>
          </div>
          <div class="card-body">

            <div v-if="!payment.payer_id">
              <form @submit.prevent="save">
                <div class="alert alert-warning shadow-sm fw-bold" role="alert">
                  <div class="d-flex justify-content-between">
                    <span>
                      <i class="bx bx-info-circle"></i>
                      Be careful, you are tempering with real money here!
                    </span>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label mb-0" for="amount">Amount</label>
                  <input v-model="form.amount" type="text" class="form-control form-control-lg" id="amount"
                         placeholder="Amount" required/>
                </div>

                <div class="mb-3">
                  <label class="form-label mb-0" for="amount">Narration</label>
                  <textarea v-model="form.narration" class="form-control form-control-lg" id="desc"
                            placeholder="Narration" required></textarea>
                </div>

                <div class="text-end">
                  <Button
                    class="fw-bold"
                    color="primary"
                    :loading="loading"
                    :disabled="payment.payer_id"
                    size="md"
                    :loading-message="`${action}ing`"
                  >
                    <v-icon small class="text-white">fas fa-wallet</v-icon>
                    {{ action_title }} Wallet
                  </Button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {cloneFormData, formatInputValue, removeCommas} from "@/plugins/helpers/form";
import {apiAdminUrl, formatKobo, redirect} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";
import _ from "lodash";

export default {
  name: "CreditDebit",
  watch: {
    'form.amount': function (amount) {
      this.form.amount = formatInputValue(amount)
    }
  },
  props: {
    ownerId: {default: null},
    action: {default: null},
    redirectUrl: {default: null},
  },
  data() {
    return {
      loader: null,
      loading: false,
      action_title: '',
      payment: {payer_id: null,},
      form: {
        amount: '',
        narration: '',
      },
    }
  },
  methods: {
    formatKobo,
    save() {
      this.loading = true

      const payload = cloneFormData(this.form);
      payload.amount = removeCommas(payload.amount);

      this.xhrPost(apiAdminUrl(`wallets/${this.action}-by-user-id/${this.ownerId}`), payload)
        .then(resp => {
          Swal.fire({
            title: `Wallet ${this.action_title}`,
            html: `Provided amount has been ${this.action}ed`,
            icon: 'success'
          }).then(() => redirect(this.redirectUrl))
        })
        .finally(() => this.loading = false)
    },
  },
  mounted() {
    this.action_title = _.upperFirst(this.action)
    this.dataBankId = this.$route.query.did
  }
}
</script>

<style scoped>

</style>
