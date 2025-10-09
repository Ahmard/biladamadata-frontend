<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <form @submit.prevent="create">
        <div class="col-md-8">
          <card>
            <card-header :has-controls="true">
              <template #title>Create new merchant</template>
            </card-header>
            <card-body class="mt-3">
              <FormsMerchantCreateForm @change="handleFormChange"/>
              <div class="d-flex justify-content-end mt-3">
                <Button
                  :loading="submitting"
                  color="primary"
                  loading-message="Creating"
                >
                  Create Merchant
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
import {apiAdminUrl} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "add",
  middleware: ['isAdmin'],
  head: {
    title: 'Create Merchant'
  },
  data() {
    return {
      submitting: false,
      signup_url: '',
      breadcrumbs: [
        {
          name: 'Merchants',
          url: '/merchant/merchants'
        },
        {
          name: 'Create Merchant',
        },
      ],
      form: {}
    }
  },
  methods: {
    create() {
      this.submitting = true
      this.xhrPost(apiAdminUrl('merchants'), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'Merchant',
            html: 'Merchant added successfully',
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
    setTimeout(() => {
      this.form = {}
    }, 3000)
  }
}
</script>

<style scoped>

</style>
