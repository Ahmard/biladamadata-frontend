<template>
  <div class="container-xxl">
    <div class="row d-flex justify-content-center">
      <div class="col-md-4" style="margin-top: 150px">
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
                <h4 v-if="!hasPasswordBeenReset" class="mb-2 mt-4">Password Reset</h4>
                <p v-if="!hasPasswordBeenReset" class="mb-4">
                  Please know that this link is only active for the next 23 hours or so.
                </p>

                <div v-if="hasPasswordBeenReset" class="alert alert-pro alert-success mt-4">
                  <div class="alert-text">
                    <h6 class="text-uppercase fw-bold">Password Reset</h6>
                    <div class="fw-bold" style="margin-top: -10px">
                      Your password has been changed successfully
                    </div>
                  </div>
                </div>

                <form v-if="!hasPasswordBeenReset" id="formAuthentication" action="" class="mb-3" method="POST"
                      @submit.prevent="submitForm">
                  <div class="mb-3 form-password-toggle">
                    <div class="d-flex justify-content-between">
                      <label class="form-label mb-0" for="password">Password</label>
                    </div>
                    <div class="input-group input-group-merge">
                      <input
                        id="password"
                        ref="passwordField"
                        v-model="form.password"
                        :disabled="submitting"
                        aria-describedby="password"
                        class="form-control"
                        name="dtn_password"
                        placeholder="****"
                        required
                        type="password"
                      />
                      <span class="input-group-text cursor-pointer"
                            data-pass-field="input#password"
                            @click.prevent="togglePasswordVisibility">
                        <i class="bx bx-hide"></i>
                      </span>
                    </div>
                  </div>

                  <div class="mb-3 form-password-toggle">
                    <div class="d-flex justify-content-between">
                      <label class="form-label mb-0" for="password_confirmation">Confirm Password</label>
                    </div>
                    <div class="input-group input-group-merge">
                      <input
                        id="password_confirmation"
                        ref="passwordConfirmationField"
                        v-model="form.password_confirmation"
                        :disabled="submitting"
                        aria-describedby="password_confirmation"
                        class="form-control"
                        name="password_confirmation"
                        placeholder="****"
                        required
                        type="password"
                      />
                      <span class="input-group-text cursor-pointer"
                            data-pass-field="input#password_confirmation"
                            @click.prevent="togglePasswordVisibility">
                        <i class="bx bx-hide"></i>
                      </span>
                    </div>
                  </div>

                  <Button
                    :loading="submitting"
                    class-name="d-grid w-100 text-white"
                    color="primary"
                    loading-message="Resetting"
                    type="submit">
                    Reset Password
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
import {togglePasswordVisibility} from "~/plugins/helpers/html";
import Swal from "sweetalert2";

const passwordVisibility = togglePasswordVisibility()
export default {
  name: "reset_password",
  auth: 'guest',
  layout: 'extra_stripped',
  head() {
    return {
      title: 'Reset Password'
    }
  },
  data() {
    return {
      submitting: false,
      canResetPassword: false,
      hasPasswordBeenReset: false,
      year: new Date().getFullYear(),
      form: {
        token: '',
        password: '',
        password_confirmation: '',
      }
    }
  },
  methods: {
    togglePasswordVisibility(e) {
      passwordVisibility(e)
    },
    submitForm() {
      this.submitting = true
      this.xhrPost(apiUrl('auth/reset-password'), this.form)
        .then(() => {
          this.hasPasswordBeenReset = true
        })
        .finally(() => this.submitting = false)
    }
  },
  mounted() {
    this.userToken = this.$route.query.token
    this.form.token = this.userToken

    if (this.userToken.length < 15) {
      Swal.fire({
        title: 'Password',
        html: 'Failed to reset password, invalid token!',
        icon: 'error'
      }).then(() => {
        this.$router.push('/')
      })

      return
    }

    this.xhrGet(apiUrl(`auth/password-resetability/${this.userToken}`))
      .then(() => this.canResetPassword = true)
      .catch(() => this.$router.push('/login'))
  }
}
</script>

<style scoped>

</style>
