<template>
  <div v-if="user.requires_reg_payment && !user.has_paid_reg_fees">
    <div class="alert alert-warning shadow-sm fw-bold" role="alert">
      <div class="d-flex justify-content-between">
        <span>
          <i class="bx bx-info-circle"></i>
          Your registration payment has not been received, kindly make payment!
        </span>
        <NuxtLink :to="`/payments/${user.payment.payment_id}`">
          Open Payment Page
          <i class="bx bx-right-arrow-circle"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegistrationPaymentNotification",
  props: {
    user: {default: {requires_reg_payment: false, has_paid_reg_fees: true}}
  }
}
</script>

<style scoped>

</style>
