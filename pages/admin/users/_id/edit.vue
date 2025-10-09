<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <form @submit.prevent="update">
        <div class="col-md-8">
          <card>
            <card-header :loading="loading" loading-message="fetching">
              <template #title>Update user information</template>
            </card-header>
            <card-body v-if="form.id" class="mt-3">
              <FormsMerchantCreateForm
                v-if="isUserFetched"
                :form="form"
                :with-password-fields="false"
                @change="handleFormChange"/>

              <div class="d-flex justify-content-end mt-3">
                <Button
                  :loading="submitting"
                  color="primary"
                  loading-message="Updating User"
                  type="submit">
                  Update User
                </Button>
              </div>

            </card-body>
          </card>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl, apiUrl} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "edit",
  middleware: ['isAdmin'],
  head: {
    title: 'Update User'
  },
  data() {
    return {
      isUserFetched: false,
      loading: true,
      submitting: false,
      userId: '',
      signup_url: '',
      geo_states_url: apiUrl('misc/geo-data/states'),
      user_url: apiAdminUrl('users'),
      geo_local_govs_url: '',
      breadcrumbs: [
        {
          name: 'Users',
          url: '/user/users'
        },
        {
          name: 'Create User',
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
        user_id: '',
        geo_state_id: '',
        geo_local_gov_id: '',
      }
    }
  },
  methods: {
    update() {
      this.submitting = true
      this.xhrPut(apiAdminUrl(`users/${this.userId}`), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'User',
            html: 'User updated successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/admin/users/${resp.data.data['id']}`)
          })
        })
        .finally(() => {
          this.submitting = false
        })
    },

    handleFormChange(form) {
      this.form = form
    }
  },
  mounted() {
    this.userId = this.$route.params.id
    this.xhrGet(apiAdminUrl(`users/${this.userId}`))
      .then(resp => {
        this.isUserFetched = true
        this.form = resp.data.data
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>

</style>
