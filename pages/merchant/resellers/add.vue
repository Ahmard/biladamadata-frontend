<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <form @submit.prevent="create">
        <div class="col-md-8">
          <div class="card">
            <CardHeader>Create new reseller</CardHeader>
            <div class="card-body mt-3">
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
                  <label class="form-label" for="email">Phone Number</label>
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
                <div class="col-md">
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
                <div class="col-md">
                  <div class="form-password-toggle">
                    <div class="d-flex justify-content-between">
                      <label class="form-label" for="password">Confirm Password</label>
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
              </div>

              <div class="my-3 d-flex justify-content-end">
                <button class="btn btn-primary d-grid text-white" type="submit">Create Reseller</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {apiMerchantUrl, apiUrl} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "add",
  middleware: ['isMerchant'],
  head: {
    title: 'Create Reseller'
  },
  data() {
    return {
      submitting: false,
      signup_url: '',
      geo_states_url: apiUrl('misc/geo-data/states'),
      geo_local_govs_url: '',
      breadcrumbs: [
        {
          name: 'Resellers',
          url: '/merchant/resellers'
        },
        {
          name: 'Create Reseller',
        },
      ],
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
        geo_state_id: '',
        geo_local_gov_id: '',
      }
    }
  },
  methods: {
    create() {
      this.submitting = true
      this.xhrPost(apiMerchantUrl('resellers'), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'Reseller',
            html: 'Reseller added successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/merchant/resellers/${resp.data.data['id']}`)
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
  }
}
</script>

<style scoped>

</style>
