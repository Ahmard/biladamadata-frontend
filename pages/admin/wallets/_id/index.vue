<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-4">
        <card>
          <card-header>
            <template #title>Wallet Information</template>
          </card-header>
          <card-body>

          </card-body>
        </card>
      </div>
    </div>

    <div v-if="!loading && wallet.wallet_id" class="row mt-3">
      <div class="col-md-12">
        <card>
          <card-header>
            <template #title>Wallet History</template>
          </card-header>
          <card-body>
            <style>
              .dt-row {
                margin-top: -20px !important;
              }
            </style>
            <div class="container table-responsive table-responsive-md mt-1">
              <WalletHistory
                :key="component_wallet_history_key"
                :page-length="10"
                :table-id="`admin-wallet-history-${wallet.id}`"
                :url="walletHistoryUrl"
                :with-card="false"
              />
            </div>
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl, apiUrl} from "@/plugins/helpers/misc";
import {Wallet} from "~/plugins/models/wallet";

export default {
  name: "index",
  middleware: ['isAdmin'],
  head: {
    title: 'Wallet Info'
  },
  data() {
    return {
      tab: 0,
      loading: true,
      wallet: {wallet_id: null},
      walletUrl: '',
      walletDebitUrl: '',
      walletCreditUrl: '',
      walletHistoryUrl: '',
      component_wallet_history_key: Date.now(),
      breadcrumbs: [
        {
          name: 'Wallets',
          url: '/admin/wallets'
        },
        {
          name: 'Info',
        },
      ],
    }
  },
  methods: {
    apiAdminUrl,
    apiUrl,
    handleWalletRefreshing() {
      this.component_wallet_history_key = Date.now()
    }
  },
  mounted() {
    const walletId = this.$route.params.id;

    this.xhrGet(apiAdminUrl(`wallets/${walletId}`))
      .then(resp => {
        this.wallet = Wallet.fromData(resp.data.data).prepareData();

        this.walletUrl = apiAdminUrl(`wallets/${walletId}`);
        this.walletHistoryUrl = apiAdminUrl(`wallets/${walletId}/history`);
        this.walletDebitUrl = `/admin/wallets/${walletId}/debit-wallet`;
        this.walletCreditUrl = `/admin/wallets/${walletId}/credit-wallet`;
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>
</style>
