<template>
  <div class="container-xxl">
    <div class="row d-flex justify-content-center">
      <div class="col-md-8 top-margin">
        <div class="authentication-wrapper authentication-basic container-p-y">
          <div class="authentication-inner">
            <!-- Register -->
            <div class="card">
              <div class="card-body">
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
                    <h4 class="mb-2 mt-3">Merchant Enrollment Form</h4>
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
                    <div class="col-md">
                      <label class="form-label" for="email">Last Name</label>
                      <input
                        id="last_name"
                        v-model="form.last_name"
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
                      <label class="form-label" for="email">Email</label>
                      <input
                        id="email"
                        v-model="form.email"
                        class="form-control"
                        name="dtn_email"
                        placeholder="Enter your email"
                        required
                        type="email"
                      />
                    </div>
                    <div class="col-md">
                      <label class="form-label" for="phone_number">Phone Number</label>
                      <input
                        id="phone_number"
                        v-model="form.phone_number"
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
                    <div class="col-md-6">
                      <Select2
                        id="state_id"
                        :url="geo_states_url"
                        label="State"
                        name="state_id"
                        placeholder="Choose State"
                        @select="handleStateSelection"
                      />
                    </div>
                    <div class="col-md-6">
                      <Select2
                        id="city_id"
                        :disabled="!geo_local_govs_url.length"
                        :url="geo_local_govs_url"
                        label="Local Government"
                        name="city_id"
                        placeholder="Choose Local Government"
                        @select="handleLocalGovSelection"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-password-toggle">
                        <div class="d-flex justify-content-between">
                          <label class="form-label" for="password">Password</label>
                        </div>
                        <div class="input-group input-group-merge">
                          <input
                            id="password"
                            v-model="form.password"
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

                    <div class="col-md-4">
                      <div class="form-password-toggle">
                        <div class="d-flex justify-content-between">
                          <label class="form-label" for="confirm-password">Confirm Password</label>
                        </div>
                        <div class="input-group input-group-merge">
                          <input
                            id="confirm-password"
                            v-model="form.password_confirmation"
                            aria-describedby="confirm-password"
                            class="form-control"
                            maxlength="100"
                            minlength="4"
                            name="password_confirmation"
                            placeholder="****"
                            required
                            type="password"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="col-md referral_code">
                      <label class="form-label" for="email">Referral Code(optional)</label>
                      <input
                        id="referral_code"
                        v-model="form.referral_code"
                        class="form-control"
                        name="referral_code"
                        placeholder="Your referral code here"
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="my-3 d-flex justify-content-end">
                    <Button
                      :loading="submitting"
                      class-name="text-white"
                      color="primary"
                      loading-message="Registering"
                      size="md">
                      Register
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
  name: "MerchantEnrollment",
  auth: 'guest',
  layout: 'extra_stripped',
  head() {
    return {
      title: 'Merchant Enrollment'
    }
  },
  data() {
    return {
      submitting: false,
      signup_url: '',
      year: new Date().getFullYear(),
      geo_states_url: apiUrl('misc/geo-data/states'),
      geo_local_govs_url: '',
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        referral_code: '',
        password: '',
        password_confirmation: '',
        geo_state_id: '',
        geo_local_gov_id: '',
      }
    }
  },
  methods: {
    enroll() {
      this.submitting = true
      this.xhrPost(apiUrl('merchants/enrollment'), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'Register',
            html: 'Merchant account created successfully',
            icon: 'success'
          }).then(() => {
            redirect('/')
          })
        })
        .finally(() => {
          this.submitting = false
        })
    },

    handleStateSelection(stateId) {
      this.form.geo_state_id = stateId
      this.geo_local_govs_url = apiUrl(`misc/geo-data/states/${stateId}/local-governments`)
    },

    handleLocalGovSelection(localGovId) {
      this.form.geo_local_gov_id = localGovId
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
    margin-top: 150px
  }
}

@media only screen and (max-width: 767px) {
  .top-margin {
    margin-top: 10px
  }
}
</style>
