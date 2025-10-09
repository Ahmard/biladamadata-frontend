<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-lg-3 col-md-12 col-6 mb-4">
        <div class="card">
          <div class="card-body">
            <div class="card-title d-flex align-items-start justify-content-between">
              <div class="avatar flex-shrink-0">
                <img
                  :src="networkProvider['np_logo']"
                  alt="chart success"
                  class="rounded"
                  loading="eager"
                />
              </div>
              <!-- Dropdown Here -->
            </div>
            <span class="fw-semibold d-block mb-1">{{ networkProvider['np_name'] }}</span>
            <h3 class="card-title mb-2">{{ networkProvider['data_bank_amount'] }}</h3>
            <!--            <small class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i> +72.80%</small>-->
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 row">
      <div class="col-md">
        <div class="text-end">
          <NuxtLink
            v-if="0 === tab"
            :to="`${networkProviderId}/add-data-plan`" class="btn btn-sm btn-primary mb-1">
            <v-icon class="text-white" size="small">fas fa-plus</v-icon>
            Add Data Plan
          </NuxtLink>
        </div>

        <v-tabs v-model="tab">
          <v-tab>Data Plans</v-tab>
          <v-tab>Data Transactions</v-tab>
          <v-tab>Airtime Transactions</v-tab>

          <v-tab-item>
            <NetworkProviderDataPlans
              v-if="networkProviderId"
              :endpoint="apiAdminUrl(`network-providers/${networkProviderId}/data-plans`)"
              :network-provider-id="networkProviderId"
              :page-length="7"
              :table-id="`admin-net-prov-data-plan-list-${networkProviderId}`"/>
          </v-tab-item>

          <v-tab-item>
            <div class="m-3">
              <DataTransactionList
                v-if="networkProviderId"
                :endpoint="apiAdminUrl(`network-providers/${networkProviderId}/data-transactions`)"
                :table-id="`admin-net-prov-dat-txn-list-${networkProviderId}`"
                :with-owner="true"
                :with-page-length="7"
              />
            </div>
          </v-tab-item>

          <v-tab-item>
            <div class="m-3">
              <TransactionList
                v-if="networkProviderId"
                :endpoint="apiAdminUrl(`network-providers/${networkProviderId}/airtime-transactions`)"
                :table-id="`admin-net-prov-air-txn-list-${networkProviderId}`"
                :with-page-length="7"
              />
            </div>
          </v-tab-item>

        </v-tabs>


      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl, serverUrl} from "@/plugins/helpers/misc";
import TransactionList from "~/components/Airtime/TransactionList.vue";
import {NetworkProvider} from "~/plugins/models/network.provider";

export default {
  name: "index",
  components: {TransactionList},
  methods: {apiAdminUrl},
  middleware: ['isAdmin'],
  head: {
    title: 'View Network Provider'
  },
  data() {
    return {
      tab: 0,
      tableToggle: 'price-discount',
      networkProviderId: '',
      networkProvider: {network_provider_id: ''},
      breadcrumbs: [
        {
          name: 'Network Providers',
          url: '/admin/network-providers'
        },
        {
          name: 'Info'
        }
      ],
    }
  },
  mounted() {
    this.networkProviderId = this.$route.params.id
    this.xhrGet(apiAdminUrl(`network-providers/${this.networkProviderId}`)).then(resp => {
      const networkProvider = NetworkProvider.fromData(resp.data.data)
      networkProvider['np_logo'] = serverUrl(networkProvider['np_logo'])

      this.networkProvider = networkProvider
    });
  },
}
</script>

<style scoped>

</style>
