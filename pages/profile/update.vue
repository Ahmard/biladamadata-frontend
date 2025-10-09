<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <form @submit.prevent="update">
        <div class="col-md-8">
          <div class="card">
            <card-header :loading="!userId">
              <template v-slot:title>
                <span class="text-uppercase">Update Profile</span>
              </template>
            </card-header>
            <card-body v-if="userId" class="mt-3">
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
                    @input="validateNumber"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <Select2
                    id="state_id"
                    :selected="selected_state"
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
                    v-model="form.geo_local_gov_id"
                    :disabled="!form.geo_state_id"
                    :selected="selected_local_gov"
                    :url="geo_local_govs_url"
                    label="City"
                    name="city_id"
                    placeholder="Choose City"
                  />
                </div>
              </div>

              <div class="my-3 d-flex justify-content-end">
                <Button
                  :loading="submitting"
                  class="fw-bold"
                  color="primary"
                  loading-message="Updating..."
                  size="md"
                  type="submit">Update Profile
                </Button>
              </div>
            </card-body>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {apiUrl, redirect, startWorking, stopWorking} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";
import {cloneDeep} from "lodash";
import {numberOnly} from "~/plugins/helpers/form";

export default {
  name: "edit",
  middleware: ['isAuth'],
  head: {
    title: 'Update Profile'
  },
  data() {
    return {
      userId: null,
      submitting: false,
      is_fetching: false,
      signup_url: '',
      geo_states_url: apiUrl('misc/geo-data/states'),
      geo_local_govs_url: '',
      selected_state: null,
      selected_local_gov: null,
      breadcrumbs: [
        {
          name: 'Profile',
          url: '/profile'
        },
        {
          name: 'Update',
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
        geo_state_name: '',
        geo_local_gov_id: '',
        geo_local_gov_name: '',
      }
    }
  },
  methods: {
    validateNumber(input) {
      this.form.phone_number = numberOnly(input.currentTarget.value)
    },
    update() {
      startWorking('Updating')
      this.submitting = true
      this.xhrPut(apiUrl('profile'), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'Profile',
            html: 'Profile updated successfully',
            icon: 'success'
          }).then(() => redirect('/profile'))
        })
        .finally(() => {
          this.submitting = false
          stopWorking()
        })
    },

    handleStateSelection(stateId) {
      this.form.geo_state_id = stateId
      this.form.geo_local_gov_id = null
      this.geo_local_govs_url = apiUrl(`misc/geo-data/states/${stateId}/local-governments`)
    },
  },
  async mounted() {
    const user = cloneDeep((await this.$auth.fetchUser()).data);
    const geo_data = user.geo_data ?? {}

    if (geo_data.geo_state_name) {
      this.selected_state = [geo_data.geo_local_gov_id, geo_data.geo_local_gov_name];
    }

    if (geo_data.geo_local_gov_name) {
      this.selected_local_gov = [geo_data.geo_local_gov_id, geo_data.geo_local_gov_name];
    }

    this.form = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      geo_state_id: user.geo_state_id,
      geo_local_gov_id: user.geo_local_gov_id,
    };

    this.userId = user.id
    this.is_fetching = false
  }
}
</script>

<style scoped>

</style>
