<template>
  <div>
    <div class="row">
      <div class="col-md-7">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Data Plan</h5>
            <small class="text-muted float-end">Create new data plan</small>
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label" for="name">Plan Name</label>
                    <input id="name" v-model="form.name" class="form-control" placeholder="Plan Name"
                           type="text"/>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label" for="data_quantity">Data Quantity</label>
                    <input id="data_quantity" v-model="form.data_quantity" class="form-control" placeholder="Quantity"
                           type="number"/>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label" for="expired_in">Expiration Days</label>
                    <input id="expired_in" v-model="form.expired_in" class="form-control" placeholder="Expiration days"
                           type="number"/>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label" for="huzmo_id">
                      <span class="text-danger">Husmo</span>
                      ID
                    </label>
                    <input id="huzmo_id" v-model="form.husmo_id" class="form-control" placeholder="Corresponding Huzmo Plan ID"
                           type="number"/>
                  </div>
                </div>
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label" for="husmo_price">
                      <span class="text-danger">Husmo</span>
                      Data Price
                    </label>
                    <input id="husmo_price" v-model="form.husmo_price"
                           autocomplete="off"
                           class="form-control"
                           name="husmo_price"
                           placeholder="Amount of money"
                           type="text"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3">
                  <label class="form-label" for="merchant_price">Merchant Price</label>
                  <input id="merchant_price" v-model="form.merchant_price" autocomplete="off"
                         class="form-control"
                         name="merchant_price"
                         placeholder="Merchant Price"
                         type="text"
                  />
                </div>
                <div class="col-md-3">
                  <label class="form-label" for="merchant_max_price">Merchant Max Price</label>
                  <input id="merchant_max_price" v-model="form.merchant_max_price" autocomplete="off"
                         class="form-control"
                         name="merchant_max_price"
                         placeholder="Merchant Maximum Price"
                         type="text"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="reseller_amount">Reseller Price</label>
                  <input id="amount" v-model="form.reseller_price" autocomplete="off"
                         class="form-control"
                         name="plan_amount"
                         placeholder="Amount of money"
                         type="text"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label" for="desc">Plan Description</label>
                    <textarea id="desc" v-model="form.desc" class="form-control" cols="30" name="desc" placeholder="Plan Description"
                              rows="3"></textarea>
                  </div>
                </div>
              </div>
              <div class="text-end">
                <Button
                  :loading="loading"
                  color="primary"
                  loading-message="Creating"
                >Create Plan
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
  name: "AddDataPrice",
  middleware: ['isAdmin'],
  head: {
    title: 'Add Data Price'
  },
  watch: {
    'form.amount': function (amount) {
      this.form.amount = formatInputValue(amount)
    },
    'form.husmo_price': function (amount) {
      this.form.husmo_price = formatInputValue(amount)
    },
    'form.merchant_price': function (amount) {
      this.form.merchant_price = formatInputValue(amount)
    },
    'form.merchant_max_price': function (amount) {
      this.form.merchant_max_price = formatInputValue(amount)
    },
    'form.reseller_price': function (amount) {
      this.form.reseller_price = formatInputValue(amount)
    },
  },
  data() {
    return {
      loader: null,
      loading: false,
      networkProviderId: '',
      form: {
        network_provider_id: this.networkProviderId,
        name: '',
        desc: '',
        husmo_id: '',
        husmo_price: '',
        expired_in: '',
        data_quantity: '',
        merchant_price: '',
        merchant_max_price: '',
        reseller_price: '',
      }
    }
  },
  methods: {
    save() {
      this.loading = true

      const payload = cloneFormData(this.form);
      payload.husmo_price = removeCommas(payload.husmo_price)
      payload.merchant_price = removeCommas(payload.merchant_price)
      payload.merchant_max_price = removeCommas(payload.merchant_max_price)
      payload.reseller_price = removeCommas(payload.reseller_price)
      payload.network_provider_id = this.networkProviderId

      this.xhrPost(apiAdminUrl(`network-providers/${this.networkProviderId}/data-plans`), payload)
        .then(resp => {
          Swal.fire({
            title: 'Data Plan',
            html: 'Data plan added successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/admin/data-plans/${resp.data.data['data_plan_id']}`)
          })
        })
        .catch(() => this.loading = false)
    },
  },
  mounted() {
    this.networkProviderId = this.$route.params.id
  }
}
</script>

<style scoped>

</style>
