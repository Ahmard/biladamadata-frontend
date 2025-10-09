<template>
  <div>
    <div class="row">
      <div class="col-md">
        <label for="email" class="form-label">First Name</label>
        <input
          v-model="formData.first_name"
          type="text"
          class="form-control"
          id="first_name"
          name="first_name"
          placeholder="Enter your first name"
          autofocus
          minlength="3"
          maxlength="100"
          required
        />
      </div>
      <div class="col-md">
        <label for="email" class="form-label">Last Name</label>
        <input
          v-model="formData.last_name"
          type="text"
          class="form-control"
          id="last_name"
          name="last_name"
          placeholder="Enter your last name"
          minlength="3"
          maxlength="100"
          required
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="formData.email"
          type="email"
          class="form-control"
          id="email"
          name="dtn_email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="col-md">
        <label for="email" class="form-label">Phone Number</label>
        <input
          v-model="formData.phone_number"
          type="text"
          class="form-control"
          id="phone_number"
          name="phone_number"
          placeholder="Enter your phone number"
          minlength="9"
          maxlength="14"
          required
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <Select2
          :selected="selectedState"
          name="state_id"
          id="state_id"
          label="State"
          placeholder="Choose State"
          :url="geo_states_url"
          @select="handleStateSelection"
        />
      </div>
      <div class="col-md-6">
        <Select2
          :selected="selectedCity"
          name="city_id"
          id="city_id"
          label="Local Government"
          placeholder="Choose Local Government"
          :disabled="!geo_local_govs_url.length"
          :url="geo_local_govs_url"
          @select="handleLocalGovSelection"
        />
      </div>
    </div>

    <div class="row" v-if="withPasswordFields">
      <div class="col-md">
        <div class="form-password-toggle">
          <div class="d-flex justify-content-between">
            <label class="form-label" for="password">Password</label>
          </div>
          <div class="input-group input-group-merge">
            <input
              v-model="formData.password"
              type="password"
              id="password"
              class="form-control"
              name="password"
              placeholder="****"
              aria-describedby="password"
              minlength="4"
              maxlength="100"
              required
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
              v-model="formData.password_confirmation"
              type="password"
              id="confirm-password"
              class="form-control"
              name="password_confirmation"
              placeholder="****"
              aria-describedby="confirm-password"
              minlength="4"
              maxlength="100"
              required
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl, apiUrl} from "@/plugins/helpers/misc";

export default {
  name: "CreateForm",
  // props: ['form', 'withPasswordFields'],
  props: {
    form: {
      type: Object,
    },
    withPasswordFields: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      geo_states_url: apiUrl('misc/geo-data/states'),
      merchant_url: apiAdminUrl('merchants'),
      geo_local_govs_url: '',
      selectedState:[],
      selectedCity:[],
      formData: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
        merchant_id: '',
        geo_state_id: '',
        geo_local_gov_id: '',
      }
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(form) {
        this.$emit('change', form)
      }
    }
  },
  methods: {
    handleStateSelection(stateId) {
      this.formData.geo_state_id = stateId
      this.geo_local_govs_url = apiUrl(`misc/geo-data/states/${stateId}/local-governments`)
    },

    handleLocalGovSelection(localGovId) {
      this.formData.geo_local_gov_id = localGovId
    },

    handleMerchantSelection(merchantId) {
      this.formData.merchant_id = merchantId
    },
  },
  mounted() {
    if (this.form) {
      this.selectedState = [
        this.form['geo_state_id'],
        this.form['geo_state_name'],
      ];

      this.selectedCity = [
        this.form['geo_local_gov_id'],
        this.form['geo_local_gov_name'],
      ];

      this.formData = this.form
    }
  }
}
</script>

<style scoped>

</style>
