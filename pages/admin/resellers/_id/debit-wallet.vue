<template>
  <CreditDebit
    :owner-id="resellerId"
    :redirect-url="`/admin/resellers/${resellerId}`"
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
      resellerId: null,
    }
  },
  mounted() {
    this.resellerId = this.$route.params.id
  }
}
</script>

<style scoped>

</style>
