<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <CardHeader :loading="!planPrice.data_plan_id" loading-message="fetching price...">
            <template v-slot:title>
              <span class="text-uppercase">Configure Plan Price: <b>{{ planPrice['dp_name'] }}</b></span>
            </template>
            <template v-slot:desc>Buy internet/mobile data</template>
          </CardHeader>
          <div class="card-body">
            <div>
              <form @submit.prevent="save">
                <div class="row">
                  <div class="col-md">
                    <div class="mb-3">
                      <label class="form-label mb-0" for="plan_price">Original Price</label>
                      <input id="plan_price" v-model="planPrice.amount_formatted" class="form-control" readonly
                             type="text"/>
                    </div>
                  </div>
                  <div class="col-md">
                    <div class="mb-3">
                      <label class="form-label mb-0" for="plan_price">Maximum Assignable Price</label>
                      <input id="plan_price" v-model="planPrice.merchant_max_price_formatted" class="form-control"
                             readonly type="text"/>
                    </div>
                  </div>
                </div>


                <div class="mb-3">
                  <label class="form-label mb-0" for="plan_price">New Price</label>
                  <input
                    id="plan_price"
                    v-model="form.amount"
                    :max="planPrice.merchant_max_price"
                    :min="planPrice.amount"
                    class="form-control"
                    placeholder="New data plan price"
                    required
                    type="text"
                  />
                </div>

                <div class="text-end">
                  <Button
                    :disabled="!planPrice.data_plan_id"
                    :loading="loading"
                    class="fw-bold"
                    color="primary"
                    loading-message="Crediting"
                    size="sm"
                  >
                    <v-icon class="text-white" small>fas fa-plus</v-icon>
                    Configure
                  </Button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {cloneFormData, formatInputValue, removeCommas} from "~/plugins/helpers/form";
import {apiMerchantUrl, formatKobo} from "~/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "configure",
  middleware: ['isMerchant'],
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
      isFetchingPlanPrice: false,
      dataPlanId: '',
      planPrice: {
        data_plan_id: null,
        amount: '',
        amount_formatted: '',
        merchant_max_price: '',
        merchant_max_price_formatted: '',
      },
      form: {
        amount: '',
        data_plan_id: '',
      },
      breadcrumbs: [
        {
          name: 'Data Plans',
          url: '/merchant/data-plans'
        },
        {
          name: 'Price Configuration',
        },
      ],
    }
  },
  methods: {
    save() {
      this.loading = true

      const payload = cloneFormData(this.form);
      payload.amount = removeCommas(payload.amount)

      this.xhrPost(apiMerchantUrl(`data-plans/${this.dataPlanId}/price-configs`), payload).then(() => {
        this.loading = false

        Swal.fire({
          title: 'Data Transaction',
          html: 'Data transaction succeeded',
          icon: 'success'
        }).then(() => {
          this.$router.push(`/merchant/data-plans/${this.dataPlanId}`)
        })
      })
        .catch(() => this.loading = false)
    },
  },
  mounted() {
    this.dataPlanId = this.$route.params.id
    this.form.data_plan_id = this.dataPlanId

    this.xhrGet(apiMerchantUrl(`data-plans/${this.dataPlanId}/merchant-price`)).then(resp => {
      this.planPrice = resp.data.data
      this.planPrice.amount_formatted = formatKobo(this.planPrice.amount)
      this.planPrice.merchant_max_price_formatted = formatKobo(this.planPrice.merchant_max_price)

      this.planPrice.amount = this.planPrice.amount / 100;
      this.planPrice.merchant_max_price = this.planPrice.merchant_max_price / 100;
    })
  }
}
</script>

<style scoped>

</style>
