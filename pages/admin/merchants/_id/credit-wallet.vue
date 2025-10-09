<template>
  <CreditDebit
    :owner-id="merchantId"
    :redirect-url="`/admin/merchants/${merchantId}`"
    action="credit"
  />
</template>

<script>
import CreditDebit from "~/components/Wallet/CreditDebit.vue";

export default {
  name: "credit-wallet",
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
