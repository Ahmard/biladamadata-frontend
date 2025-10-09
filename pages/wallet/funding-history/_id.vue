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

            <div class="text-end mt-2">
              <Button
                v-if="!payment['is_link_clicked']"
                :loading="isStartingPayment"
                class="fw-bold"
                color="primary"
                loading-message="Starting"
                size="sm"
                @click="startPayment"
              >
                Start Payment
              </Button>

              <div v-if="'pending' === payment['status'] && payment['is_link_clicked']">
                <Button
                  :loading="isVerifyingPayment"
                  class="fw-bold"
                  color="primary"
                  loading-message="Verifying..."
                  size="sm"
                  @click="verifyPayment"
                >
                  Verify Payment
                </Button>

                <a :href="payment['payment_url']"
                   class="fw-bold btn btn-sm btn-success"
                   target="_blank"
                >
                  Make Payment
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <Toast :display="hasStartedPayment" :timeout="3000">Payment has been started</Toast>
  </div>
</template>

<script>
import {apiUrl, startWorking, stopWorking, windowLoaded} from "~/plugins/helpers/misc";
import {Payment} from "~/plugins/models/payment";
import Swal from "sweetalert2";

export default {
  name: "ShowPayment",
  middleware: ['isAuth'],
  head: {
    title: 'View Payment'
  },
  data() {
    return {
      paymentId: '',
      isVerifyingPayment: false,
      isStartingPayment: false,
      hasStartedPayment: false,
      payment: {payment_id: null},
      breadcrumbs: [
        {
          name: 'Wallet',
          url: '/wallet'
        },
        {
          name: 'Funding History',
          url: '/wallet/funding-history'
        },
        {
          name: 'View',
        },
      ],
    }
  },
  methods: {
    startPayment() {
      this.isStartingPayment = true
      this.xhrGet(apiUrl(`payments/${this.paymentId}/start-payment`))
        .then(resp => {
          this.hasStartedPayment = true
          this.isStartingPayment = false
          this.payment = Payment.fromData(resp.data.data).prepareData();
        })
        .catch(() => this.isStartingPayment = false)
    },
    verifyPayment() {
      this.isVerifyingPayment = true
      startWorking('Verifying')

      this.xhrGet(apiUrl(`payments/${this.paymentId}/verify`))
        .then(resp => {
          Swal.fire({
            title: 'Payment',
            html: 'Your payment has been received and verified',
            icon: 'success'
          })

          this.isVerifyingPayment = false
          this.payment = Payment.fromData(resp.data.data).prepareData();

          if (resp.data.data.purpose === 'registration' && !this.$auth.user.has_paid_reg_fees) {
            setTimeout(() => window.location.reload(), 2000)
          }
        })
        .finally(() => {
          stopWorking()
          this.isVerifyingPayment = false
        })
    }
  },
  mounted() {
    this.paymentId = this.$route.params.id

    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    // Verify payment after redirection from paystack
    if (params['trxref'] || params['reference']) {
      sessionStorage.setItem('requires_payment_verification', 'true')
      windowLoaded(() => window.location.href = `/#/wallet/funding-history/${this.paymentId}`)
    }

    // Fetch Information
    if (!params['trxref'] && !params['reference']) {
      this.xhrGet(apiUrl(`payments/${this.paymentId}`)).then(resp => {
        this.payment = Payment.fromData(resp.data.data).prepareData();

        // Verify payment after redirection from paystack
        if (sessionStorage.getItem('requires_payment_verification')) {
          setTimeout(() => this.verifyPayment(), 500)
          sessionStorage.removeItem('requires_payment_verification')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
