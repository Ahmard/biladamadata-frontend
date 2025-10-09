<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">

        <div class="card mb-4">
          <CardHeader :loading="!payment.payment_id">
            <template v-slot:title>Payment Information</template>
          </CardHeader>

          <div v-if="payment.payment_id" class="card-body">
            <div class="list-group list-group-flush">
              <div class="list-group-item">
                <b>Payer:</b> <span v-html="payment['payer_view_page']"></span>
              </div>
              <div class="list-group-item">
                <b>Reference:</b> {{ payment['reference'] }}
              </div>
              <div class="list-group-item">
                <b>Amount:</b> {{ payment['formatted_amount'] }}
              </div>
              <div class="list-group-item">
                <b>Paid Amount:</b> {{ payment['formatted_paid_amount'] }}
              </div>
              <div class="list-group-item">
                <b>Charges:</b> {{ payment['formatted_charges'] }}
              </div>
              <div class="list-group-item">
                <b>Beneficial:</b> {{ payment['formatted_computed_amount'] }}
              </div>
              <div class="list-group-item">
                <b>Payment Method:</b> <span v-html="payment['payment_method']"></span>
              </div>
              <div class="list-group-item">
                <b>Verification Method:</b> <span v-html="payment['verification_method']"></span>
              </div>
              <div class="list-group-item">
                <b>Purpose:</b> <span v-html="payment['formatted_purpose']"></span>
              </div>
              <div class="list-group-item">
                <b>Direct Transfer?:</b> <span v-html="payment.direct_transfer_formatted"></span>
              </div>
              <div class="list-group-item">
                <b>Status:</b> <span v-html="payment.status_badge"></span>
              </div>
              <div class="list-group-item">
                <b>Paid At:</b> {{ payment['paid_at'] }}
              </div>
              <div class="list-group-item">
                <b>Created At:</b> {{ payment['created_at'] }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {apiAdminUrl} from "~/plugins/helpers/misc";
import {Payment} from "~/plugins/models/payment";

export default {
  name: "ShowPayment",
  middleware: ['isAdmin'],
  head: {
    title: 'View Payment'
  },
  data() {
    return {
      paymentId: '',
      payment: {payment_id: null},
      breadcrumbs: [
        {
          name: 'Funding History',
          url: '/admin/funding-history'
        },
        {
          name: 'View',
        },
      ],
    }
  },
  mounted() {
    this.paymentId = this.$route.params.id
    this.xhrGet(apiAdminUrl(`payments/${this.paymentId}`)).then(resp => {
      this.payment = Payment.fromData(resp.data.data).prepareData(true);
    })
  }
}
</script>

<style scoped>

</style>
