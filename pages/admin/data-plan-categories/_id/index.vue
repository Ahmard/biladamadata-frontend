<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-lg-5 col-md-12 col-6 mb-4">
        <div class="card">
          <div class="card-body">
            <div class="list-group list-group-flush">
              <div class="list-group-item">
                <b>Name:</b> {{ dpc['dpc_name'] }}
              </div>
              <div class="list-group-item">
                <b>Description:</b> {{ dpc['dpc_desc'] }}
              </div>
              <div class="list-group-item">
                <b>Status:</b> <span v-html="dpc['status_badge']"></span>
              </div>
              <div class="list-group-item">
                <b>Created At:</b> {{ dpc['created_at'] }}
              </div>
            </div>

            <div class="mt-2 text-end">
              <dropdown>
                <template #items>
                  <dropdown-item :href="`/admin/data-plan-categories/${dpcId}/edit`" icon="edit-alt">Edit</dropdown-item>
                  <dropdown-item v-if="dpc.status === 'active'" icon="trash" @click="disable">Deactivate
                  </dropdown-item>
                  <dropdown-item v-if="dpc.status === 'inactive'" icon="check-double" @click="enable">Activate
                  </dropdown-item>
                </template>
              </dropdown>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 row">
      <div class="col-md">

        <v-tabs v-model="tab">
          <v-tab>Data Plans</v-tab>

          <v-tab-item>
            <NetworkProviderDataPlans
              v-if="dpcId"
              :endpoint="apiAdminUrl(`data-plan-categories/${dpcId}/data-plans`)"
              :network-provider-id="dpcId"
              :page-length="7"
              :table-id="`admin-dpc-data-plan-list-${dpcId}`"/>
          </v-tab-item>

        </v-tabs>


      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl, startWorking, stopWorking} from "@/plugins/helpers/misc";
import TransactionList from "~/components/Airtime/TransactionList.vue";
import Swal from "sweetalert2";
import {DataPlanCategory} from "~/plugins/models/data.plan.category";

export default {
  name: "index",
  components: {TransactionList},
  middleware: ['isAdmin'],
  head: {
    title: 'View Network Provider'
  },
  data() {
    return {
      tab: 0,
      tableToggle: 'price-discount',
      dpcId: '',
      dpc: {network_provider_id: ''},
      breadcrumbs: [
        {
          name: 'Data Plan Categories',
          url: '/admin/data-plan-categories'
        },
        {
          name: 'Info'
        }
      ],
    }
  },
  methods: {
    apiAdminUrl,

    disable() {
      Swal.fire({
        title: 'Deactivate DPC',
        text: "Are you sure you want to disable this category?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, disable!'
      }).then((result) => {
        if (result.isConfirmed) {
          startWorking('Deactivating')
          this.xhrPatch(apiAdminUrl(`data-plan-categories/${this.dpcId}/deactivate`))
            .then(resp => {
              this.dpc = DataPlanCategory.fromData(resp.data.data).prepareData()

              Swal.fire(
                'Data Plan Category',
                'Data plan has been deactivated',
                'success'
              )
            })
            .finally(() => stopWorking())
        }
      })
    },
    enable() {
      Swal.fire({
        title: 'Activate DPC',
        text: "Are you sure you want to enable this category?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, enable!'
      }).then((result) => {
        if (result.isConfirmed) {
          startWorking('Activating')
          this.xhrPatch(apiAdminUrl(`data-plan-categories/${this.dpcId}/activate`))
            .then(resp => {
              this.dataPlan = DataPlanCategory.fromData(resp.data.data).prepareData()

              Swal.fire(
                'Data Plan Category',
                'Data plan has been activated',
                'success'
              )
            })
            .finally(() => stopWorking())
        }
      })
    }
  },
  mounted() {
    this.dpcId = this.$route.params.id
    this.xhrGet(apiAdminUrl(`data-plan-categories/${this.dpcId}`)).then(resp => {
      this.dpc = DataPlanCategory.fromData(resp.data.data).prepareData()
    });
  },
}
</script>

<style scoped>

</style>
