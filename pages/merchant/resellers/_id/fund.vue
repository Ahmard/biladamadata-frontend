<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0 text-uppercase">Transfer Money to Reseller</h5>
            <small class="text-muted float-end">
              <b>Your Balance: <span class="text-info">{{ merchantWalletBalance }}</span></b>
            </small>
          </div>
          <div class="card-body">
            <div v-if="isTransferCompleted">
              <div class="text-center text-primary">
                <v-icon class="text-primary" large>fa fa-check</v-icon>
                <div class="fw-bold">
                  Transaction successful
                </div>
              </div>
            </div>

            <div v-if="!isTransferCompleted">
              <form @submit.prevent="save">
                <div class="mb-3">
                  <label class="form-label mb-0" for="basic-default-amount">Amount</label>
                  <div class="input-group">
                    <input id="basic-default-amount" v-model="form.amount" class="form-control" placeholder="Amount of money"
                           required type="text"/>
                    <div class=""></div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label mb-0" for="narration">Narration</label>
                  <textarea id="narration" v-model="form.narration" class="form-control" maxlength="150"
                            minlength="3" placeholder="Narration" required/>
                </div>

                <div class="text-end">
                  <Button
                    :disabled="payment.payer_id"
                    :loading="loading"
                    class="fw-bold"
                    color="primary"
                    loading-message="Transferring"
                    size="sm"
                  >
                    <v-icon class="text-white" small>fas fa-wallet</v-icon>
                    Transfer Money
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
import {apiMerchantUrl, apiUrl, formatKobo, redirect} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "credit-money",
  middleware: ['isMerchant'],
  head: {
    title: 'Credit Money'
  },
  watch: {
    'form.amount': function (amount) {
      this.form.amount = formatInputValue(amount)
    }
  },
  data() {
    return {
      loader: null,
      loading: false,
      isTransferCompleted: false,
      resellerId: '',
      merchantWalletBalance: '',
      payment: {
        "payer_id": null,
      },
      form: {
        amount: '',
        narration: '',
      },
      breadcrumbs: [],
    }
  },
  methods: {
    save() {
      this.loading = true

      const payload = cloneFormData(this.form);
      payload.amount = removeCommas(payload.amount);

      this.xhrPost(apiMerchantUrl(`resellers/${this.resellerId}/wallet/fund`), payload)
        .then(resp => {
          this.loading = false;
          this.isTransferCompleted = true

          Swal.fire({
            title: 'Transfer',
            html: 'The money has been transferred to reseller successfully',
            icon: 'success'
          }).then(() => {
            redirect(`/merchant/resellers/${this.resellerId}`)
          })
        })
        .catch(() => this.loading = false)
    },
  },
  mounted() {
    this.resellerId = this.$route.params.id
    this.breadcrumbs = [
      {
        name: 'Resellers',
        url: '/merchant/resellers'
      },
      {
        name: 'Reseller Info',
        url: `/merchant/resellers/${this.resellerId}`
      },
      {
        name: 'Fund Wallet',
      },
    ];

    // Fetch Merchant Wallet
    this.xhrGet(this.url ?? apiUrl('wallet'))
      .then(resp => {
        this.merchantWalletBalance = formatKobo(parseInt(resp.data.data['amount']), 0)
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>

</style>
