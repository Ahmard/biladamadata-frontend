<template>
  <div class="components-preview wide-xl mx-auto">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-7">
        <div class="card card-bordered card-preview">
          <CardHeader :loading="!wallet.wallet_id" loading-message="fetching wallet information...">
            <template v-slot:title>
              Deactivate wallet:
              <span v-if="wallet.wallet_id" class="text-primary">{{ wallet['full_name'] }} </span>
            </template>
          </CardHeader>
          <card-body>
            <form action="" @submit.prevent="deactivate">
              <label class="form-label text-muted" for="title">Why are you activating this wallet?</label>
              <div class="form-control-wrap">
                <div class="form-icon form-icon-left">
                  <em class="icon ni ni-text"></em>
                </div>
                <textarea id="name" v-model="form.reason" :disabled="!wallet.wallet_id" :readonly="submitting" class="form-control"
                          name="name"
                          placeholder="Deactivation reason"
                          required
                          type="text"></textarea>
              </div>

              <div class="mt-1 text-end">
                <Button
                  :disabled="!wallet.wallet_id"
                  :loading="submitting"
                  color="primary"
                  loading-message="Activating"
                  size="md"
                >Deactivate Wallet
                </Button>
              </div>
            </form>
          </card-body>
        </div>
      </div>
    </div><!-- .card-preview -->
  </div> <!-- nk-block -->
</template>

<script>
import Vue from 'vue'
import {apiAdminUrl, redirect} from "~/plugins/helpers/misc";
import Swal from "sweetalert2";

export default Vue.extend({
  name: 'AdminWalletDeactivate',
  middleware: ['isAdmin'],
  head() {
    return {
      title: 'Wallet: Deactivate'
    }
  },
  data() {
    return {
      submitting: false,
      wallet: {id: 0},
      walletId: 0,
      types: [],
      breadcrumbs: [],
      form: {
        reason: '',
      }
    }
  },
  methods: {
    deactivate() {
      this.submitting = true
      this.xhrPatch(apiAdminUrl(`wallets/${this.walletId}/deactivate`), this.form)
        .then(() => {
          Swal.fire({
            title: 'Wallet',
            html: 'Wallet account has been deactivated',
            icon: 'success'
          }).then(() => redirect(`/admin/wallets/${this.walletId}`))
        })
        .finally(() => this.submitting = false)
    }
  },
  mounted() {
    this.walletId = this.$route.params.id

    this.xhrGet(apiAdminUrl(`wallets/${this.walletId}`)).then(resp => {
      this.wallet = resp.data.data
    })

    this.breadcrumbs = [
      {
        name: 'Wallets',
        url: '/admin/wallets'
      },
      {
        name: 'Wallet Info',
        url: `/admin/wallets/${this.walletId}`
      },
      {
        name: 'Deactivate',
      },
    ];
  }
})
</script>
