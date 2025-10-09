<template>
  <div>
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <card>
          <template #head>
            <card-header :loading="isFetching">
              <template #title>Data Plan</template>
              <template #desc>Update Data Plan</template>
            </card-header>
          </template>
          <card-body>
            <form @submit.prevent="save">
              <div class="row mt-1">
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label text-muted" for="name">Plan Name</label>
                    <input id="name" v-model="form.name" class="form-control" placeholder="Plan Name"
                           type="text"/>
                  </div>
                </div>
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label text-muted" for="data_quantity">Data Quantity</label>
                    <input id="data_quantity" v-model="form.data_quantity" class="form-control" placeholder="Amount of money"
                           type="number"/>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label text-muted" for="expired_in">Expiration Days</label>
                    <input id="expired_in" v-model="form.expired_in" class="form-control" placeholder="Expiration days"
                           type="number"/>
                  </div>
                </div>
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label text-muted" for="huzmo_id">Huzmo ID</label>
                    <input id="huzmo_id" v-model="form.husmo_id" class="form-control" placeholder="Corresponding Huzmo Plan ID"
                           type="number"/>
                  </div>
                </div>
              </div>

              <div class="row mt-0">
                <div class="col-md">
                  <Select2
                    id="data-plan-category-id"
                    name="data_plan_category_id"
                    label="Data Plan Category"
                    :required="true"
                    :url="apiAdminUrl('data-plan-categories')"
                    v-model="form.data_plan_category_id"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label text-muted" for="desc">Plan Description</label>
                    <textarea id="desc" v-model="form.desc" class="form-control" cols="30" name="desc" placeholder="Plan Description"
                              rows="3"></textarea>
                  </div>
                </div>
              </div>
              <div class="text-end">
                <Button
                  :loading="loading"
                  color="primary"
                  loading-message="Updating"
                >Update Plan
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
import {cloneFormData, formatInputValue} from "@/plugins/helpers/form";
import {apiAdminUrl, apiUrl} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";
import {DataPlan} from "~/plugins/models/data.plan";

export default {
  name: "UpdateDataPrice",
  middleware: ['isAdmin'],
  head: {
    title: 'Update Data Price'
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
      isFetching: true,
      networkProviderId: '',
      dataPlanId: null,
      breadcrumbs: [],
      form: {
        network_provider_id: '',
        data_plan_category_id: '',
        name: '',
        desc: '',
        husmo_id: '',
        expired_in: '',
        data_quantity: '',
      }
    }
  },
  methods: {
    apiAdminUrl,
    save() {
      this.loading = true
      const payload = cloneFormData(this.form);

      this.xhrPut(apiAdminUrl(`data-plans/${this.dataPlanId}`), payload)
        .then(resp => {
          Swal.fire({
            title: 'Data Plan',
            html: 'Data plan updated successfully',
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
        name: 'Update Info'
      }
    ];

    this.xhrGet(apiAdminUrl(`data-plans/${this.dataPlanId}`))
      .then(resp => {
        const plan = DataPlan.fromData(resp.data.data).prepareData()
        this.form = {
          name: plan.dp_name,
          desc: plan.dp_desc,
          data_quantity: plan.data_quantity,
          expired_in: plan.expired_in,
          husmo_id: plan.huzmo_id,
          network_provider_id: plan.network_provider_id,
        }
      })
      .finally(() => this.isFetching = false)
  }
}
</script>

<style scoped>

</style>
