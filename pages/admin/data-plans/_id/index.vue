<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-5">
        <div class="card">
          <CardHeader :loading="isFetching">
            <template v-slot:title>Data Plan Information</template>
          </CardHeader>
          <card-body v-if="dataPlan.data_plan_id">
            <div class="list-group list-group-flush">
              <div class="list-group-item">
                <b>Name:</b> {{ dataPlan['dp_name'] }}
              </div>
              <div class="list-group-item">
                <b>Network:</b>
                <span v-html="dataPlan['np_view_page']"></span>
              </div>
              <div class="list-group-item">
                <b>Category:</b>
                <span v-html="dataPlan['dpc_view_page']"></span>
              </div>
              <div class="list-group-item">
                <b>Huzmo ID:</b> {{ dataPlan['huzmo_id'] }}
              </div>
              <div class="list-group-item">
                <b>Description:</b> {{ dataPlan['dp_desc'] }}
              </div>
              <div class="list-group-item">
                <b>Data Quantity:</b> {{ dataPlan['data_quantity_formatted'] }}
              </div>
              <div class="list-group-item">
                <b>Plan Lifetime:</b> {{ dataPlan['expired_in'] }}<i>Days</i>
              </div>
              <div class="list-group-item">
                <b>Status:</b> <span v-html="dataPlan['status_badge']"></span>
              </div>
              <div class="list-group-item">
                <b>Created At:</b> {{ dataPlan['created_at'] }}
              </div>
            </div>

            <div class="mt-2 text-end">
              <dropdown>
                <template #items>
                  <dropdown-item :href="`/admin/data-plans/${dataPlanId}/edit`" icon="edit-alt">Edit</dropdown-item>
                  <dropdown-item v-if="dataPlan.status === 'active'" icon="trash" @click="disable">Disable
                  </dropdown-item>
                  <dropdown-item v-if="dataPlan.status === 'inactive'" icon="check-double" @click="enable">Enable
                  </dropdown-item>
                </template>
              </dropdown>
            </div>
          </card-body>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md">
        <div class="text-end">
          <NuxtLink
            v-if="0 === tab"
            :to="`${dataPlanId}/add-data-price`" class="btn btn-sm btn-primary mb-1">
            <v-icon class="text-white" size="small">fas fa-plus</v-icon>
            Add Data Price
          </NuxtLink>
          <NuxtLink
            v-if="1 === tab"
            :to="`${dataPlanId}/add-data-price-discount`" class="btn btn-sm btn-primary mb-1">
            <v-icon class="text-white" size="small">fas fa-plus</v-icon>
            Add Discount
          </NuxtLink>
        </div>

        <v-tabs v-model="tab">
          <v-tab>Data Prices</v-tab>
          <v-tab>Price Discounts</v-tab>

          <v-tab-item>
            <NetworkProviderDataPrice
              v-if="dataPlanId"
              :data-plan-id="dataPlanId"/>
          </v-tab-item>

          <v-tab-item>
            <NetworkProviderDataPriceDiscounts
              v-if="dataPlanId"
              :data-plan-id="dataPlanId"/>
          </v-tab-item>
        </v-tabs>


      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl} from "~/plugins/helpers/misc";
import {DataPlan} from "~/plugins/models/data.plan";
import Swal from "sweetalert2";

export default {
  name: "index",
  middleware: ['isAdmin'],
  head: {
    title: 'View Data Plan'
  },
  data() {
    return {
      tab: 0,
      dataPlanId: '',
      isFetching: true,
      dataPlan: {data_plan_id: ''},
      networkProviderId: '',
      networkProvider: {network_provider_id: ''},
      breadcrumbs: [
        {
          name: 'Data Plans',
          url: '/admin/data-plans'
        },
        {
          name: 'Info'
        }
      ],
    }
  },
  methods: {
    disable() {
      Swal.fire({
        title: 'Disable Plan',
        text: "Are you sure you want to disable this plan?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, disable!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.xhrPatch(apiAdminUrl(`data-plans/${this.dataPlanId}/disable`))
            .then(resp => {
              this.dataPlan = DataPlan.fromData(resp.data.data).prepareData()

              Swal.fire(
                'Data Plan',
                'Data plan has been disabled',
                'success'
              )
            })
        }
      })
    },
    enable() {
      Swal.fire({
        title: 'Enable Plan',
        text: "Are you sure you want to enable this plan?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, enable!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.xhrPatch(apiAdminUrl(`data-plans/${this.dataPlanId}/enable`))
            .then(resp => {
              this.dataPlan = DataPlan.fromData(resp.data.data).prepareData()

              Swal.fire(
                'Data Plan',
                'Data plan has been enabled',
                'success'
              )
            })
        }
      })
    }
  },
  mounted() {
    this.dataPlanId = this.$route.params.id

    this.xhrGet(apiAdminUrl(`data-plans/${this.dataPlanId}`))
      .then(resp => {
        this.dataPlan = DataPlan.fromData(resp.data.data).prepareData()
      })
      .finally(() => this.isFetching = false)
  }
}
</script>

<style scoped>

</style>
