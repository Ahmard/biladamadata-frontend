<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <CardHeader :loading="loading">
            <template v-slot:title>Update Referral</template>
            <template v-slot:desc>Update referral information</template>
          </CardHeader>
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
                  :loading="loading || submitting"
                  color="primary"
                  loading-message="Updating"
                >Update Referral
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
  name: "AdminUpdateReferral",
  middleware: ['isAdmin'],
  head: {
    title: 'Update Referral'
  },
  data() {
    return {
      loader: null,
      loading: false,
      submitting: false,
      referralId: '',
      form: {
        bonus_amount: '',
        expiration_date: '',
        type: 'one_timed',
      },
      breadcrumbs: [
        {
          name: 'Referrals',
          url: '/admin/referrals'
        },
        {
          name: 'Update',
        },
      ],
    }
  },
  methods: {
    save() {
      this.submitting = true

      this.xhrPut(apiAdminUrl(`referrals/${this.referralId}`), this.form)
        .then(resp => {
          Swal.fire({
            title: 'Referral',
            html: 'Referral updated successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/admin/referrals/${resp.data.data['referral_id']}`)
          })
        })
        .catch(() => this.submitting = false)
    },
  },
  mounted() {
    this.referralId = this.$route.params.id
    this.loading = true

    this.xhrGet(apiAdminUrl(`referrals/${this.referralId}`))
      .then(resp => {
        this.form = resp.data.data
        this.form.bonus_amount = this.form.bonus_amount / 100;
        this.form.expiration_date = this.form.expiration_date.split(' ')[0]
      }).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>
