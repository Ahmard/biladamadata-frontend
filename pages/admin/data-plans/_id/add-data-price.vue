<template>
  <div>
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <card class="mb-4">
          <card-header :has-controls="true" :loading="is_fetching_plan">
            <template #title>
              Update Price:
              <span class="text-primary">
                <NuxtLink :to="`/admin/data-plans/${dataPlanId}`">
                  {{ dataPlan['dp_name'] }}
                </NuxtLink>
              </span>
            </template>
            <template #desc>
              <span v-if="!is_fetching_price">Update price per data</span>
              <div v-if="is_fetching_price" class="text-primary">
                <Spinner :spin="is_fetching_price" color="primary"/>
                Fetching Price...
              </div>
            </template>
          </card-header>
          <card-body>
            <form class="mt-2" @submit.prevent="save">
              <div class="mb-3">
                <label class="form-label" for="beneficiary_type"></label>
                <Select2
                  id="beneficiary_type"
                  v-model="form.beneficiary_type"
                  :disabled="is_fetching_plan"
                  :items="beneficiary_types"
                  label="Beneficiary Type"
                  name="beneficiary_type"
                  placeholder="Choose"
                />
              </div>

              <div class="mb-3">
                <label class="form-label" for="husmo_price"><span class="text-danger">Husmo</span> Data Price</label>
                <input id="husmo_price" v-model="form.husmo_price"
                       :disabled="is_fetching_price || is_fetching_plan"
                       class="form-control"
                       name="husmo_price"
                       placeholder="Amount of money"
                       type="text"
                />
              </div>

              <div class="mb-3">
                <label class="form-label" for="amount">Data Price</label>
                <input id="amount" v-model="form.amount" :disabled="is_fetching_price || is_fetching_plan"
                       class="form-control"
                       name="plan_amount"
                       placeholder="Amount of money"
                       type="text"
                />
              </div>

              <div v-if="form.beneficiary_type === 'merchant'" class="mb-3">
                <label class="form-label" for="amount">Maximum Price</label>
                <input id="amount"
                       v-model="form.merchant_max_price"
                       :disabled="is_fetching_price"
                       class="form-control"
                       name="merchant_max_price"
                       placeholder="Maximum Plan Price"
                       type="text"
                />
              </div>

              <div class="text-end">
                <Button
                  :disabled="is_fetching_price || is_fetching_plan"
                  :loading="loading"
                  color="primary"
                  loading-message="Updating"
                >Update Price
                </Button>
              </div>
            </form>
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import {cloneFormData, formatInputValue, removeCommas} from "~/plugins/helpers/form";
import {apiAdminUrl} from "~/plugins/helpers/misc";
import Swal from "sweetalert2";
import {DataPlan} from "~/plugins/models/data.plan";

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
    'form.merchant_max_price': function (amount) {
      if (amount) {
        this.form.merchant_max_price = formatInputValue(amount)
      }
    },
    'form.husmo_price': function (amount) {
      this.form.husmo_price = formatInputValue(amount)
    },
    'form.beneficiary_type': function (type) {
      console.log('Hello')
      this.is_fetching_price = true
      this.xhrGet(apiAdminUrl(`data-plans/${this.dataPlanId}/${type}/active-price`))
        .then(resp => {
          const price = resp.data.data

          if (price) {
            this.form.husmo_price = (price.husmo_price / 100).toString();
            this.form.amount = (price.amount / 100).toString();

            if (price.merchant_max_price) {
              this.form.merchant_max_price = (price.merchant_max_price / 100).toString();
            }
          }
        })
        .finally(() => this.is_fetching_price = false)
    },
  },
  data() {
    return {
      loader: null,
      loading: false,
      is_fetching_plan: true,
      is_fetching_price: false,
      dataPlanId: '',
      dataPlan: '',
      form: {
        amount: '',
        husmo_price: '',
        merchant_max_price: '',
        beneficiary_type: ''
      },
      breadcrumbs: [],
      beneficiary_types: [
        {id: 'merchant', text: 'Merchant'},
        {id: 'reseller', text: 'Reseller'},
      ]
    }
  },
  methods: {
    save() {
      this.loading = true

      const payload = cloneFormData(this.form);
      payload.amount = removeCommas(payload.amount);
      payload.husmo_price = removeCommas(payload.husmo_price);

      if (payload.merchant_max_price) {
        payload.merchant_max_price = removeCommas(payload.merchant_max_price);
      }

      this.xhrPost(apiAdminUrl(`data-plans/${this.dataPlanId}/data-prices`), payload)
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

    this.breadcrumbs = [
      {
        name: 'Data Plans',
        url: '/admin/data-plans'
      },
      {
        name: 'Plan Info',
        url: `/admin/data-plans/${this.dataPlanId}`
      },
      {
        name: 'Price Configuration'
      }
    ];

    this.xhrGet(apiAdminUrl(`data-plans/${this.dataPlanId}`))
      .then(resp => {
        this.dataPlan = DataPlan.fromData(resp.data.data).prepareData()
      })
      .finally(() => this.is_fetching_plan = false)
  }
}
</script>

<style scoped>

</style>
