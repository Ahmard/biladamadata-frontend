<template>
  <div class="container-xxl">
    <div class="row d-flex justify-content-center">
      <div class="col-md-5 col-sm-7 col-lg-4 top-margin">
        <div class="authentication-wrapper authentication-basic container-p-y">
          <div class="authentication-inner">
            <!-- Register -->
            <div class="card">
              <div class="card-body">
                <!-- Logo -->
                <div class="app-brand justify-content-center">
                  <NuxtLink class="app-brand-link gap-2" to="/">
                  <span class="app-brand-logo demo">
                    <img alt="" src="/assets/img/logo-transparent-200x80.png">
                  </span>
                    <!--                    <span class="app-brand-text demo text-body fw-bolder">BiladamaData</span>-->
                  </NuxtLink>
                </div>
                <!-- /Logo -->
                <h4 class="mb-2 mt-4">Email Verification! 😎</h4>
                <p class="mb-4 mt-1">Please wait while we verify your email.</p>

                <div v-if="spin" class="d-flex justify-content-start">
                  <Spinner :small-icon="false" color="primary"/>
                  <span class="text-primary fw-bold mt-1 ms-1" style="font-size: 16px">Verifying...</span>
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

import {apiUrl} from "~/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "EmailVerification",
  auth: 'guest',
  layout: 'extra_stripped',
  head() {
    return {
      title: 'Account Verification'
    }
  },
  computed: {
    spin() {
      return this.status === 'verifying'
    }
  },
  data() {
    return {
      year: new Date().getFullYear(),
      status: 'verifying',
    }
  },
  mounted() {
    const userToken = this.$route.query.token

    if (userToken.length < 15) {
      Swal.fire({
        title: 'Email Verification',
        html: 'Failed to verify account, invalid token!',
        icon: 'error'
      }).then(() => {
        this.$router.push('/')
      })

      return
    }

    this.xhrGet(apiUrl(`auth/account-verification/${userToken}`))
      .then(resp => {
        this.status = 'verified'

        Swal.fire({
          title: 'Email Verification',
          html: 'Your email has been verified, please wait for account approval',
          icon: 'success'
        }).then(() => {
          this.$router.push('/')
        })

      })
      .catch(() => this.status = 'failed')
  }
}
</script>


<style scoped>
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
