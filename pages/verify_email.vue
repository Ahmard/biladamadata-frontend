<template>
  <div class="container-xxl">
    <div class="row d-flex justify-content-center">
      <div class="col-md-5 col-sm-7 col-lg-4 top-margin">
        <div class="authentication-wrapper authentication-basic container-p-y">
          <div class="authentication-inner py-4">
            <!-- Forgot Password -->
            <div class="card">
              <div class="card-body">
                <!-- Logo -->
                <div class="app-brand justify-content-center">
                  <a class="app-brand-link gap-2" href="/">
                  <span class="app-brand-logo demo">
                    <img alt="" src="/assets/img/logo-transparent-200x80.png">
                  </span>
                    <!--                    <span class="app-brand-text demo text-body fw-bolder">BiladamaData</span>-->
                  </a>
                </div>
                <!-- /Logo -->
                <h4 class="mb-2 mt-4">Email Verification</h4>
                <p v-if="modes.verification" class="mb-4">Verify your email address</p>
                <p v-if="modes.resend_link" class="mb-4">Resend verification email</p>

                <div v-if="isLinkSent" class="alert alert-pro alert-success mt-3">
                  <div class="alert-text">
                    <h6 class="text-uppercase fw-bold">Password Reset</h6>
                    <div class="fw-bold" style="margin-top: -10px">Password reset link has been sent to your email.
                    </div>
                  </div>
                </div>

                <form v-if="modes.resend_link" action="" class="mb-3" method="POST"
                      @submit.prevent="resendVerificationCode">
                  <div class="mb-3">
                    <div class="d-flex justify-content-between">
                      <label class="form-label" for="email">Email Address</label>
                      <a class="link link-primary link-sm" href="#" tabindex="-1"
                         @click.prevent="switchMode('verification')">
                        Verify Account
                      </a>
                    </div>
                    <input
                      id="email"
                      v-model="form.email"
                      autofocus
                      class="form-control"
                      name="email"
                      placeholder="Enter your email"
                      type="text"
                    />
                  </div>
                  <Button
                    :loading="submitting"
                    class-name="d-grid w-100 text-white"
                    color="primary"
                    loading-message="Sending Link"
                    type="submit">
                    Send Reset Link
                  </Button>
                </form>

                <form v-if="modes.verification" action="" class="mb-3" method="POST" @submit.prevent="verifyCode">
                  <div class="mb-3">
                    <div class="d-flex justify-content-between">
                      <label class="form-label" for="verification_code">Verification Code</label>
                      <a class="link link-primary link-sm" href="#" tabindex="-1"
                         @click.prevent="switchMode('resend_link')">
                        Resend Email
                      </a>
                    </div>
                    <input
                      id="verification_code"
                      v-model="form.verification_code"
                      autofocus
                      class="form-control"
                      name="verification_code"
                      placeholder="Enter your code here"
                      type="text"
                    />
                  </div>
                  <Button
                    :loading="submitting"
                    class-name="d-grid w-100 text-white"
                    color="primary"
                    loading-message="Verifying"
                    type="submit">
                    Verify Code
                  </Button>
                </form>

                <div class="text-center">
                  <NuxtLink class="d-flex align-items-center justify-content-center" to="/login">
                    <i class="bx bx-chevron-left scaleX-n1-rtl bx-sm"></i>
                    Back to login
                  </NuxtLink>
                </div>
              </div>
            </div>
            <!-- /Forgot Password -->
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {apiUrl, redirect} from "~/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "verify_account",
  auth: 'guest',
  layout: 'extra_stripped',
  head() {
    return {
      title: 'Account Verification'
    }
  },
  data() {
    return {
      submitting: false,
      isLinkSent: false,
      year: new Date().getFullYear(),
      modes: {
        verification: true,
        resend_link: false,
      },
      form: {
        email: '',
        verification_code: '',
      }
    }
  },
  methods: {
    switchMode(mode) {
      if ('verification' === mode) {
        this.modes.resend_link = false
        this.modes.verification = true
      } else {
        this.modes.resend_link = true
        this.modes.verification = false
      }
    },
    verifyCode() {
      this.xhrGet(apiUrl(`auth/account-verification/code/${this.form.verification_code}`)).then(() => {
        Swal.fire({
          title: 'Account Verification',
          html: 'Your account has been verified, please wait for account approval',
          icon: 'success'
        }).then(() => {
          redirect('/login')
        })
      })
    },
    resendVerificationCode() {
      this.submitting = true
      const payload = {email: this.form.email}
      this.xhrPost(apiUrl('auth/resend-verification-code'), payload)
        .then(() => {
          this.isLinkSent = true
          this.switchMode('verification')
        })
        .finally(() => this.submitting = false)
    }
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
