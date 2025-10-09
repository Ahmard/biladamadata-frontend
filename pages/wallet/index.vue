<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-lg-4 col-md-4 col-8 mb-4">
        <WalletBalance :with-fund-option="true" @refreshing="handleRefreshing"/>
      </div>
    </div>

    <div class="mt-2 row">
      <div class="col-md">
        <WalletHistory :key="component_wallet_history_key"/>
      </div>
    </div>
  </div>
</template>

<script>
import {Wallet} from "@/plugins/models/wallet";

export default {
  name: "index",
  middleware: ['isAuth'],
  head: {
    title: 'Wallet'
  },
  data() {
    return {
      wallet: {amount: ''},
      component_wallet_history_key: Date.now(),
      breadcrumbs: [
        {
          name: 'Wallet',
        },
      ],
    }
  },
  methods: {
    handleRefreshing() {
      this.component_wallet_history_key = Date.now()
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
