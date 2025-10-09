<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Credit Money</h5>
            <small class="text-muted float-end">Add money to your wallet</small>
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="mb-3">
                <label class="form-label" for="basic-default-fullname">Amount</label>
                <input id="basic-default-fullname" v-model="form.amount" class="form-control" placeholder="Amount of money"
                       type="text"/>
              </div>
              <div class="mb-3">
                <label class="form-label" for="basic-default-message">Narration</label>
                <textarea
                  id="basic-default-message"
                  v-model="form.narration"
                  class="form-control"
                  placeholder="Why are you crediting this amount?"
                  rows="3"
                ></textarea>
              </div>
              <div class="text-end">
                <Button
                  :loading="loading"
                  color="primary"
                  loading-message="Crediting"
                >Credit Money
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
import {cloneFormData, formatInputValue, removeCommas} from "@/plugins/helpers/form";
import {apiAdminUrl} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "credit-money",
  middleware: ['isAdmin'],
  head: {
    title: 'Credit Money'
  },
  watch: {
    'form.amount': function (amount) {
      this.form.amount = formatInputValue(amount)
    }
  },
  data() {
    return {
      loader: null,
      loading: false,
      dataBankId: '',
      networkProviderId: '',
      form: {
        amount: '',
        narration: ''
      },
      breadcrumbs: [],
    }
  },
  methods: {
    save() {
      this.loading = true

      const payload = cloneFormData(this.form);
      payload.amount = removeCommas(payload.amount);

      this.xhrPost(apiAdminUrl(`data/${this.dataBankId}/credit-money`), payload)
        .then(resp => {
          this.loading = false;

          Swal.fire({
            title: 'Money',
            html: 'Money has been credited successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/admin/network-providers/${this.networkProviderId}`)
          })
        })
        .catch(error => this.loading = false)
    },
  },
  mounted() {
    this.dataBankId = this.$route.query.did
    this.networkProviderId = this.$route.query.nid

    this.breadcrumbs = [
      {
        name: 'Network Providers',
        url: '/admin/network-providers'
      },
      {
        name: 'Provider Info',
        url: `/admin/network-providers/${this.networkProviderId}`
      },
      {
        name: 'Credit Money'
      }
    ]
  }
}
</script>

<style scoped>

</style>
