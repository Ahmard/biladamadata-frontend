<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <form @submit.prevent="update">
        <div class="col-md-8">
          <div class="card">
            <CardHeader :loading="!form.id">
              <template v-slot:title>
                <span class="text-uppercase">Update Reseller</span>
              </template>
            </CardHeader>
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
                    v-if="form.id"
                    id="country_id"
                    :selected="[form.geo_state_id, form.geo_state_name]"
                    :url="geo_states_url"
                    label="Country"
                    name="country_id"
                    placeholder="Choose Country"
                    @select="handleStateSelection"
                  />
                </div>
                <div class="col-md-6">
                  <Select2
                    v-if="form.id"
                    id="state_id"
                    :disabled="!form.geo_local_gov_id"
                    :selected="[form.geo_local_gov_id, form.geo_local_gov_name]"
                    :url="geo_local_govs_url"
                    label="State"
                    name="state_id"
                    placeholder="Choose State"
                    @select="handleLocalGovSelection"
                  />
                </div>
              </div>

              <div class="my-3 d-flex justify-content-end">
                <button class="btn btn-primary d-grid text-white fw-bold" type="submit">Update Reseller</button>
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
  name: "edit",
  middleware: ['isMerchant'],
  head: {
    title: 'Update Reseller'
  },
  data() {
    return {
      resellerId: '',
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
          name: 'Reseller Info',
          url: `/merchant/resellers/${this.resellerId}`
        },
        {
          name: 'Update Reseller',
        },
      ],
      form: {
        id: null,
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
        geo_state_id: '',
        geo_state_name: '',
        geo_local_gov_id: '',
        geo_local_gov_name: '',
      }
    }
  },
  methods: {
    update() {
      this.submitting = true
      this.xhrPut(apiMerchantUrl(`resellers/${this.resellerId}`), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'Reseller',
            html: 'Reseller updated successfully',
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
      this.form.geo_local_gov_id = null
      this.geo_local_govs_url = apiUrl(`misc/geo-data/states/${stateId}/local-governments`)
    },

    handleLocalGovSelection(localGovId) {
      this.form.geo_local_gov_id = localGovId
    },
  },
  mounted() {
    this.resellerId = this.$route.params.id
    this.xhrGet(apiMerchantUrl(`resellers/${this.resellerId}`)).then(resp => {
      this.form = resp.data.data
      this.geo_local_govs_url = apiUrl(`misc/geo-data/states/${this.form.geo_state_id}/local-governments`)
    })
  }
}
</script>

<style scoped>

</style>
