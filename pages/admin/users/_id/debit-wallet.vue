<template>
  <CreditDebit
    :owner-id="userId"
    :redirect-url="`/admin/users/${userId}`"
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
      userId: null,
    }
  },
  mounted() {
    this.userId = this.$route.params.id
  }
}
</script>

<style scoped>

</style>
