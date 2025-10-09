<template>
  <CreditDebit
    :owner-id="merchantId"
    :redirect-url="`/admin/merchants/${merchantId}`"
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
      merchantId: null,
    }
  },
  mounted() {
    this.merchantId = this.$route.params.id
  }
}
</script>

<style scoped>

</style>
