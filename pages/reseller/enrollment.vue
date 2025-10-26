<template>
  <div class="container-xxl">
    <div class="row d-flex justify-content-center">
      <div class="col-md-4 top-margin">
        <div class="authentication-wrapper authentication-basic container-p-y">
          <div class="authentication-inner">
            <!-- Register -->
            <div class="card">
              <div class="card-body py-4">
                <!-- Logo -->
                <div class="app-brand justify-content-center">
                  <NuxtLink class="app-brand-link gap-2" to="/">
                    <div class="app-brand-logo demo">
                      <img alt="" src="/assets/img/logo-transparent-200x80.png">
                    </div>
                  </NuxtLink>
                </div>
                <div class="d-flex justify-content-center mb-3">
                  <!-- /Logo -->
                  <div class="d-block">
                    <h4 class="mb-2 mt-3">BiladamaData Registration</h4>
                  </div>
                  <!--                  <h2 class=" demo text-body fw-bolder">BiladamaData</h2>-->
                </div>
                <form id="formAuthentication" class="mb-3" @submit.prevent="enroll">
                  <div class="row">
                    <div class="col-md">
                      <label class="form-label" for="email">First Name</label>
                      <input
                        id="first_name"
                        v-model="form.first_name"
                        :disabled="submitting"
                        autofocus
                        class="form-control"
                        maxlength="100"
                        minlength="3"
                        name="first_name"
                        placeholder="Enter your first name"
                        required
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md">
                      <label class="form-label" for="email">Last Name</label>
                      <input
                        id="last_name"
                        v-model="form.last_name"
                        :disabled="submitting"
                        class="form-control"
                        maxlength="100"
                        minlength="3"
                        name="last_name"
                        placeholder="Enter your last name"
                        required
                        type="text"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md">
                      <label class="form-label" for="email">Phone Number</label>
                      <input
                        id="phone_number"
                        v-model="form.phone_number"
                        :disabled="submitting"
                        class="form-control"
                        maxlength="14"
                        minlength="9"
                        name="phone_number"
                        placeholder="Enter your phone number"
                        required
                        type="text"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md">
                      <label class="form-label" for="email">Email (Optional)</label>
                      <input
                        id="email"
                        v-model="form.email"
                        :disabled="submitting"
                        class="form-control"
                        maxlength="14"
                        minlength="9"
                        name="email"
                        placeholder="jane.doe@example.com"
                        required
                        type="text"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md">
                      <div class="form-password-toggle">
                        <div class="d-flex justify-content-between">
                          <label class="form-label" for="password">Password</label>
                        </div>
                        <div class="input-group input-group-merge">
                          <input
                            id="password"
                            v-model="form.password"
                            :disabled="submitting"
                            aria-describedby="password"
                            class="form-control"
                            maxlength="100"
                            minlength="4"
                            name="password"
                            placeholder="****"
                            required
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="my-3 d-flex justify-content-end">
                    <Button
                      :loading="submitting"
                      class-name="text-white d-block"
                      color="primary"
                      loading-message="Registering"
                      size="md"
                      type="submit">
                      Create Account
                    </Button>
                  </div>
                </form>

                <p class="text-center">
                  <span>Already have an account?</span>
                  <NuxtLink to="/login">
                    <span>Login</span>
                  </NuxtLink>
                </p>
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

import {apiUrl, redirect} from "~/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "ResellerEnrollment",
  auth: 'guest',
  layout: 'extra_stripped',
  head() {
    return {
      title: 'Reseller Enrollment'
    }
  },
  data() {
    return {
      submitting: false,
      is_ref_code_locked: false,
      signup_url: '',
      year: new Date().getFullYear(),
      form: {
        first_name: '',
        last_name: '',
        email: '',
        referral_code: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
      }
    }
  },
  methods: {
    enroll() {
      this.submitting = true
      this.xhrPost(apiUrl('resellers/enrollment'), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'Register',
            html: 'Reseller account created successfully',
            icon: 'success'
          }).then(() => {
            redirect('/login')
          })
        })
        .finally(() => {
          this.submitting = false
        })
    },
  },
  mounted() {
    const refCode = this.$route.query.ref
    if (refCode) {
      this.form.referral_code = refCode
      this.is_ref_code_locked = true
    }
  }
}
</script>

<style scoped>
@media only screen and (min-width: 767px) {
  .top-margin {
    margin-top: 100px
  }
}

@media only screen and (max-width: 767px) {
  .top-margin {
    margin-top: 10px
  }
}
</style>
