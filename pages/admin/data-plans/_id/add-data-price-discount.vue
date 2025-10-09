<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Add Price Discount</h5>
            <small class="text-muted float-end">Add data price discount</small>
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="mb-3">
                <label class="form-label mb-0" for="discount_type">Discount Type</label>
                <select id="discount_type" v-model="form.discount_type" class="form-select" name="discount_type">
                  <option value="amount">Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label mb-0" for="beneficiary_type">Beneficiary Type</label>
                <select id="beneficiary_type" v-model="form.beneficiary_type" class="form-select"
                        name="beneficiary_type">
                  <option value="all">All</option>
                  <option value="merchant">Merchant</option>
                  <option value="reseller">Reseller</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label mb-0" for="minimum_data_amount">Minimum Data Amount</label>
                <input id="minimum_data_amount" v-model="form.minimum_data_amount" class="form-control" placeholder="Minimum Data Amount"
                       type="text"/>
              </div>
              <div class="mb-3">
                <label class="form-label mb-0" for="discount_amount">Discount Amount</label>
                <input id="discount_amount" v-model="form.discount_amount" class="form-control" placeholder="Discount Amount"
                       type="text"/>
              </div>
              <div class="text-end">
                <Button
                  :loading="loading"
                  color="primary"
                  loading-message="Updating"
                >Add Discount
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
  name: "AddDataPriceDiscount",
  middleware: ['isAdmin'],
  head: {
    title: 'Add Data Price Discount'
  },
  data() {
    return {
      loader: null,
      loading: false,
      dataPlanId: '',
      form: {
        minimum_data_amount: '',
        discount_amount: '',
        discount_type: 'amount',
        beneficiary_type: 'all',
      },
      breadcrumbs: [
        {
          name: 'Network Providers',
          url: ''
        },
      ],
    }
  },
  methods: {
    save() {
      this.loading = true

      this.xhrPost(apiAdminUrl(`data-plans/${this.dataPlanId}/data-price-discounts`), this.form)
        .then(resp => {
          Swal.fire({
            title: 'Data Price',
            html: 'Data price added successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/admin/data-plans/${this.dataPlanId}`)
          })
        })
        .catch(() => this.loading = false)
    },
  },
  mounted() {
    this.dataPlanId = this.$route.params.id
  }
}
</script>

<style scoped>

</style>
