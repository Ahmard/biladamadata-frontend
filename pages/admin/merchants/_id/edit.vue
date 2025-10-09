<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <form @submit.prevent="update">
        <div class="col-md-8">
          <div class="card">
            <CardHeader :loading="loading" loading-message="fetching">
              <template v-slot:title>Update merchant information</template>
            </CardHeader>
            <div class="card-body mt-3">
              <FormsMerchantCreateForm
                v-if="isMerchantFetched"
                :form="form"
                :with-password-fields="false"
                @change="handleFormChange"/>

              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-primary d-grid text-white" type="submit">Update Merchant</button>
              </div>

            </div>
          </div>
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
    title: 'Update Merchant'
  },
  data() {
    return {
      isMerchantFetched: false,
      loading: true,
      submitting: false,
      merchantId: '',
      signup_url: '',
      geo_states_url: apiUrl('misc/geo-data/states'),
      merchant_url: apiAdminUrl('merchants'),
      geo_local_govs_url: '',
      breadcrumbs: [
        {
          name: 'Merchants',
          url: '/merchant/merchants'
        },
        {
          name: 'Create Merchant',
        },
      ],
      form: {
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
  methods: {
    update() {
      this.submitting = true
      this.xhrPut(apiAdminUrl(`merchants/${this.merchantId}`), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'Merchant',
            html: 'Merchant updated successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/admin/merchants/${resp.data.data['id']}`)
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
    this.merchantId = this.$route.params.id
    this.xhrGet(apiAdminUrl(`merchants/${this.merchantId}`))
      .then(resp => {
        this.isMerchantFetched = true
        this.form = resp.data.data
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>

</style>
