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
                <h4 class="mb-2 mt-4">Forgot Password?</h4>
                <p v-if="!isLinkSent" class="mb-4">
                  Enter your email and we'll send you instructions to reset your password
                </p>

                <div v-if="isLinkSent" class="alert alert-pro alert-success mt-3">
                  <div class="alert-text">
                    <h6 class="text-uppercase fw-bold">Password Reset</h6>
                    <div class="fw-bold" style="margin-top: -10px">Password reset link has been sent to your email.
                    </div>
                  </div>
                </div>

                <form v-if="!isLinkSent" id="formAuthentication" action="" class="mb-3" method="POST"
                      @submit.prevent="submitForm">
                  <div class="mb-3">
                    <label class="form-label" for="email">Email</label>
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
import {apiUrl} from "~/plugins/helpers/misc";

export default {
  name: "forgot_password", auth: 'guest',
  layout: 'extra_stripped',
  head() {
    return {
      title: 'Forgot Password'
    }
  },
  data() {
    return {
      submitting: false,
      isLinkSent: false,
      year: new Date().getFullYear(),
      form: {
        email: '',
      }
    }
  },
  methods: {
    submitForm() {
      this.submitting = true
      this.xhrPost(apiUrl('auth/send-password-reset-link'), this.form)
        .then(() => {
          this.isLinkSent = true
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
