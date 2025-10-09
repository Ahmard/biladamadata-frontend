<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Create Referral</h5>
            <small class="text-muted float-end">Add new referral</small>
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="mb-3">
                <label class="form-label mb-0" for="type">Referral Type</label>
                <select id="type" v-model="form.type" class="form-select" name="type">
                  <option value="one_timed">One-Timed</option>
                  <option value="continuous">Continuous</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label mb-0" for="beneficiary_type">Beneficiary Type</label>
                <select id="beneficiary_type" v-model="form.beneficiary_type" class="form-select"
                        name="beneficiary_type">
                  <option value="merchant">Merchant</option>
                  <option value="reseller">Reseller</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label mb-0" for="bonus_amount">Bonus Amount</label>
                <input id="bonus_amount" v-model="form.bonus_amount" class="form-control" placeholder="Bonus Amount"
                       type="text"/>
              </div>
              <div class="mb-3">
                <label class="form-label mb-0" for="expiration_date">Expiration Date</label>
                <input id="expiration_date" v-model="form.expiration_date" class="form-control" type="date"/>
              </div>
              <div class="text-end">
                <Button
                  :loading="submitting"
                  color="primary"
                  loading-message="Updating"
                >Create Referral
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl} from "~/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "AdminCreateReferral",
  middleware: ['isAdmin'],
  head: {
    title: 'Create Referral'
  },
  data() {
    return {
      loader: null,
      submitting: false,
      form: {
        bonus_amount: '',
        expiration_date: '',
        type: 'one_timed',
        beneficiary_type: 'merchant',
      },
      breadcrumbs: [
        {
          name: 'Referrals',
          url: '/admin/referrals'
        },
        {
          name: 'Create',
        },
      ],
    }
  },
  methods: {
    save() {
      this.submitting = true

      this.xhrPost(apiAdminUrl('referrals'), this.form)
        .then(resp => {
          Swal.fire({
            title: 'Referral',
            html: 'Referral added successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/admin/referrals/${resp.data.data['referral_id']}`)
          })
        })
        .catch(() => this.submitting = false)
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
