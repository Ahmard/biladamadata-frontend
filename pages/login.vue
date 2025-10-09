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
                <div class="app-brand justify-content-center mb-3">
                  <a class="app-brand-link gap-2" href="/">
                  <span class="app-brand-logo demo">
                    <img alt="" src="/assets/img/logo-transparent-200x80.png">
                  </span>
                  </a>
                </div>
                <!-- /Logo -->
                <h4 class="mb-2 mt-2">Welcome to BiladamaData! 👋</h4>
                <p class="mb-4 mt-1">Please sign-in to your account and start the adventure</p>

                <form id="formAuthentication" @submit.prevent="login">
                  <div class="mb-3">
                    <div class="d-flex justify-content-between">
                      <label class="form-label" for="email">Username or Email</label>
                      <NuxtLink to="verify_email">
                        <small>Verify Email</small>
                      </NuxtLink>
                    </div>
                    <input
                      id="email"
                      v-model="form.email"
                      :disabled="submitting"
                      autofocus
                      class="form-control"
                      name="dtn_email"
                      placeholder="Enter your username or email address"
                      required
                    />
                  </div>
                  <div class="mb-3 form-password-toggle">
                    <div class="d-flex justify-content-between">
                      <label class="form-label" for="password">Password</label>
                      <NuxtLink to="forgot_password">
                        <small>Forgot Password?</small>
                      </NuxtLink>
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
                  <div class="mb-3">
                    <div class="form-check">
                      <input id="remember-me" checked class="form-check-input" type="checkbox"/>
                      <label class="form-check-label" for="remember-me"> Remember Me </label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <Button
                      :loading="submitting"
                      class-name="d-grid w-100 text-white"
                      color="primary"
                      loading-message="Logging..."
                      type="submit">
                      Login
                    </Button>
                  </div>
                </form>

                <div class="">
                  <div class="d-flex justify-content-between">
                    <div>New to our platform?</div>
                    <div>
                      <NuxtLink class="me-2" to="/reseller/enrollment">Create Account</NuxtLink>
                    </div>
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

import Swal from "sweetalert2";
import {handleError} from "~/plugins/helpers/xhr";
import {togglePasswordVisibility} from "~/plugins/helpers/html";

const passwordVisibility = togglePasswordVisibility()
export default {
  name: "login",
  auth: 'guest',
  layout: 'extra_stripped',
  head() {
    return {
      title: 'Login'
    }
  },
  data() {
    return {
      submitting: false,
      isPasswordVisible: false,
      is_unverified_email: false,
      year: new Date().getFullYear(),
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    togglePasswordVisibility(e) {
      passwordVisibility(e)
    },
    login() {
      this.submitting = true

      this.$auth.loginWith('laravelJWT', {data: this.form})
        .then(async resp => {
          Swal.fire({
            title: 'Login',
            html: 'Logged in successfully',
            icon: 'success'
          }).then(() => {
            // If beneficiary has plan he intended to buy
            const planToBuy = localStorage.getItem('item_to_buy')
            if (planToBuy !== null && planToBuy.length) {
              this.$router.push('/beneficiary/plans/add')
              return
            }

            window.location.reload()
          })
        })
        .catch(error => {
          handleError(error).catch(err => {
            if (err.hasOwnProperty('additionalData')) {
              this.is_unverified_email = error.additionalData.unverified_email ?? false;
            }
          })
        })
        .finally(() => {
          this.submitting = false
        })
    }
  },
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
