<template>
  <CreditDebit
    :owner-id="walletId"
    :redirect-url="`/admin/wallets/${walletId}`"
    action="debit"
  />
</template>

<script>
import CreditDebit from "~/components/Wallet/CreditDebit.vue";

export default {
  name: "debit-wallet",
  components: {CreditDebit},
  data() {
    return {
      walletId: null,
    }
  },
  mounted() {
    this.walletId = this.$route.params.id
  }
}
</script>

<style scoped>

</style>
