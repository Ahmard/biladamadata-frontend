<template>
  <div class="container-xxl">
    <div class="row d-flex justify-content-center">
      <div class="col-md-4 topmar">
        <div class="authentication-wrapper authentication-basic container-p-y">
          <div class="authentication-inner">
            <!-- Register -->
            <div class="card">
              <div class="card-body">
                <!-- Logo -->
                <div class="app-brand justify-content-center mb-3">
                  <a class="app-brand-link gap-2" href="/">
                  <span class="app-brand-logo demo">
                    <img alt="" src="/assets/img/logo-transparent-150x50.png">
                  </span>
                  </a>
                </div>
                <!-- /Logo -->
                <h4 class="mb-2 text-center">BiladamaData - Verification</h4>
                <p class="mb-4 mt-1 text-center">Verify your calling airtime transaction</p>

                <div v-if="fetching" class="d-flex justify-content-start my-3">
                  <Spinner :small-icon="false" color="primary"/>
                  <span class="text-primary fw-bold mt-1 ms-1" style="font-size: 16px">Verifying...</span>
                </div>

                <div v-if="!fetching && hasBeenFound" class="my-4">
                  <div class="text-center">
                    <i class="bx bx-check-circle text-success" style="font-size: 60px"></i>
                  </div>

                  <div class="">
                    <table class="mt-2 table table-responsive" style="width: 100%">
                      <tbody>
                      <tr>
                        <td>Airtime Amount</td>
                        <td></td>
                        <td></td>
                        <td>{{ transaction['airtime_amount'] }}</td>
                      </tr>
                      <tr>
                        <td>Phone Number</td>
                        <td></td>
                        <td></td>
                        <td>{{ transaction['mobile_number'] }}</td>
                      </tr>
                      <tr>
                        <td>Status</td>
                        <td></td>
                        <td></td>
                        <td>{{ transaction['status'] }}</td>
                      </tr>
                      <tr>
                        <td>Timestamp</td>
                        <td></td>
                        <td></td>
                        <td>{{ transaction['created_at'] }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div v-if="!fetching && !hasBeenFound" class="my-4">
                  <div class="text-center">
                    <i class="bx bx-block text-danger" style="font-size: 60px"></i>
                  </div>
                  <p class="mb-4 mt-1 text-center text-danger">Failed to find airtime transaction, no record found</p>
                </div>

                <div class="mt-2">
                  <div class="text-end">
                    <NuxtLink
                      v-if="!isAuthenticatedUser"
                      class="border border-light p-2"
                      to="/login">
                      Login
                    </NuxtLink>
                    <NuxtLink
                      class="border border-light p-2 ms-1"
                      to="/merchant/enrollment">
                      Merchant Enrollment
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
            <!-- /Register -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {apiUrl, formatKobo} from "~/plugins/helpers/misc";

export default {
  name: "AirtimeTxnVerification",
  layout: 'extra_stripped',
  auth: false,
  head: {
    title: 'Airtime Verification'
  },
  data() {
    return {
      fetching: true,
      transaction: {},
      hasBeenFound: false,
      isAuthenticatedUser: true,
    }
  },
  mounted() {
    this.isAuthenticatedUser = this.$auth.loggedIn;

    const airtimeTxnId = this.$route.params.id
    this.xhrGet(apiUrl(`world/airtime-transactions/${airtimeTxnId}`))
      .then(resp => {
        this.transaction = resp.data.data

        if (this.transaction) {
          this.hasBeenFound = true
          this.transaction.airtime_amount = formatKobo(this.transaction.airtime_amount)
          this.transaction.airtime_computed_price = formatKobo(this.transaction.airtime_computed_price)
        }
      })
      .finally(() => this.fetching = false)
  }
}
</script>

<style scoped>
table td {
  padding: 4px 2px !important;
  border-bottom: 1px solid #ececec !important;
}

@media only screen and (min-width: 767px) {
  .top-margin {
    margin-top: 150px
  }
}

@media only screen and (max-width: 767px) {
  .top-margin {
    margin-top: 30px
  }
}
</style>
