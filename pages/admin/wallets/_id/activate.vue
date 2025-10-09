<template>
  <div class="components-preview wide-xl mx-auto">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-7">
        <div class="card card-bordered card-preview">
          <CardHeader :loading="!wallet.id" loading-message="fetching wallet information...">
            <template v-slot:title>
              Activate wallet:
              <span v-if="wallet.id" class="text-primary">{{ wallet['full_name'] }} </span>
            </template>
          </CardHeader>
          <card-body>
            <form action="" @submit.prevent="activate">
              <label class="form-label text-muted" for="title">Why are you activating this wallet?</label>
              <div class="form-control-wrap">
                <div class="form-icon form-icon-left">
                  <em class="icon ni ni-text"></em>
                </div>
                <textarea id="name" v-model="form.reason" :disabled="!wallet.id" :readonly="submitting" class="form-control"
                          name="name"
                          placeholder="Deactivation reason"
                          required
                          type="text"></textarea>
              </div>

              <div class="mt-1 text-end">
                <Button
                  :disabled="!wallet.id"
                  :loading="submitting"
                  color="primary"
                  loading-message="Activating"
                  size="md"
                >Activate Wallet
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
  // meta: {
  //   auth: { permission: 'wallet_activate' }
  // },
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
    activate() {
      this.submitting = true
      this.xhrPatch(apiAdminUrl(`wallets/${this.walletId}/activate`), this.form)
        .then(() => {
          Swal.fire({
            title: 'Wallet',
            html: 'Wallet account has been activated',
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
        name: 'Activate',
      },
    ];
  }
})
</script>
