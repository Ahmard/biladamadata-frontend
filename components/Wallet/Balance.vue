<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="card-title d-flex align-items-start justify-content-between">
          <div class="avatar flex-shrink-0">
            <img
              loading="eager"
              src="/assets/img/wallet-naira.png"
              alt="chart success"
              class="rounded"
            />
          </div>

          <dropdown>
            <template #items v-if="showOption">
              <dropdown-item @click="fetchWallet" icon="refresh">Refresh</dropdown-item>
              <dropdown-item v-if="withFundOption" :href="fundUrl" icon="dollar-circle">Fund Wallet</dropdown-item>
              <dropdown-item v-if="debitUrl" :href="debitUrl" icon="minus-circle">Debit Wallet</dropdown-item>
              <dropdown-item v-if="creditUrl" :href="creditUrl" icon="plus-circle">Credit Wallet</dropdown-item>
            </template>
            <template #button>
              <a
                class="btn dropdown-toggle-custom p-0"
                type="button"
                href="#"
                id="cardOpt3"
                data-bs-toggle="dropdown"
              >
                <i class="bx bx-dots-vertical-rounded"></i>
              </a>
            </template>
          </dropdown>
        </div>
        <span v-if="!withTitleInFooter" class="fw-semibold d-block mb-1">{{ title }}</span>
        <h3 class="card-title mb-2">{{ wallet['amount'] }}</h3>
        <small class="text-success fw-semibold">
          <Spinner color="secondary" :spin="loading"/>
        </small>
        <span v-if="withTitleInFooter" class="fw-semibold d-block mb-1">{{ title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {apiUrl, formatMoneyAmount, reinitializeDropdowns} from "~/plugins/helpers/misc";
import {Wallet} from "~/plugins/models/wallet";

export default {
  name: "Balance",
  props: {
    url: {default: null},
    fetchedWallet: {default: null},
    showOption: {default: true},
    title: {default: 'My Wallet'},
    fundUrl: {default: '/wallet/fund'},
    withFundOption: {default: false},
    withTitleInFooter: {default: false},
    debitUrl: {default: null},
    creditUrl: {default: null},
  },
  data() {
    return {
      loading: true,
      loaded: false,
      wallet: {amount: '0'},
    }
  },
  methods: {
    fetchWallet() {
      this.loading = true

      if (this.loaded) {
        this.$emit('refreshing')
      }

      this.xhrGet(this.url ?? apiUrl('wallet'))
        .then(resp => {
          this.prepareWallet(resp.data.data)

          if (this.loaded) {
            this.$emit('refresh', this.wallet)
          }
        })
        .finally(() => this.loading = false);
    },

    prepareWallet(wallet) {
      this.wallet = Wallet.fromData(wallet)
      this.wallet.amount = formatMoneyAmount(parseInt(this.wallet['amount']) / 100, 0)
    }
  },
  mounted() {
    if (this.fetchedWallet) {
      this.prepareWallet(this.fetchedWallet)
      this.loading = false
      this.loaded = true
    }

    if (!this.fetchedWallet) {
      this.wallet.amount = formatMoneyAmount(this.wallet.amount);
      this.fetchWallet()
      this.loaded = true
    }

    setTimeout(() => reinitializeDropdowns('wallet balance card'), 1000)
  }
}
</script>

<style scoped>

</style>
