<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-9">
        <card>
          <card-header :loading="loading">
            <template v-slot:title>Merchant Information</template>
            <template v-slot:desc>
              <h6 class="fw-bold" v-html="merchant['status_badge']"></h6>
            </template>
          </card-header>
          <card-body v-if="merchant.id">
            <div class="row mt-2">
              <div class="col-md-3 mb-1">
                <div class="text-muted">Username</div>
                <div>{{ merchant.username }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Full Name</div>
                <div>{{ merchant.full_name }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Email</div>
                <div>{{ merchant.email }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Alternative Email</div>
                <div>{{ merchant['alternative_email'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Phone Number</div>
                <div>{{ merchant.phone_number }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Gender</div>
                <div>{{ merchant['gender'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">State</div>
                <div>{{ merchant['geo_state_name'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">City</div>
                <div>{{ merchant['geo_local_gov_name'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Created At</div>
                <div>{{ merchant['created_at'] }}</div>
              </div>
            </div>

            <div class="mt-3 d-flex justify-content-end">
              <div class="d-flex justify-content-around">
                <NuxtLink v-if="merchant.id" :to="`${merchant.id}/resellers`" class="btn btn-sm btn-primary me-1">
                  <div class="fa fa-users-between-lines"></div>
                  Resellers
                </NuxtLink>
                <dropdown>
                  <template #items>
                    <dropdown-item
                      :href="`/admin/users/${merchant.id}`"
                      icon="user"
                    >Detailed Info
                    </dropdown-item>
                    <dropdown-item
                      :href="`/admin/users/${merchant.id}/edit`"
                      icon="edit"
                    >Edit
                    </dropdown-item>
                    <dropdown-item
                      v-if="merchant.status !== 'active'"
                      :href="`/admin/users/${merchant.id}/activate`"
                      icon="check"
                    >Activate
                    </dropdown-item>
                    <dropdown-item
                      v-if="merchant.status === 'active'"
                      :href="`/admin/users/${merchant.id}/deactivate`"
                      icon="block"
                    >Deactivate
                    </dropdown-item>
                  </template>
                </dropdown>
              </div>
            </div>
          </card-body>
        </card>
      </div>

      <div class="col-md-3">
        <WalletBalance
          v-if="!loading && merchant.id"
          :credit-url="walletCreditUrl"
          :debit-url="walletDebitUrl"
          :url="walletUrl"
          :with-fund-option="false"
          title="Merchant Wallet"
        />
      </div>
    </div>

    <div v-if="!loading && merchant.id" class="row mt-3">
      <div class="col-md-12">
        <WalletHistory
          :page-length="5"
          :url="walletHistoryUrl"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl} from "@/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import Resellers from "~/components/Merchant/Resellers.vue";

export default {
  name: "index",
  components: {Resellers},
  middleware: ['isAdmin'],
  head: {
    title: 'Merchant Info'
  },
  data() {
    return {
      loading: true,
      merchant: {id: null},
      walletUrl: '',
      walletDebitUrl: '',
      walletCreditUrl: '',
      walletHistoryUrl: '',
      breadcrumbs: [
        {
          name: 'Merchants',
          url: '/admin/merchants'
        },
        {
          name: 'Info',
        },
      ],
    }
  },
  mounted() {
    const merchantId = this.$route.params.id;

    this.walletUrl = apiAdminUrl(`merchants/${merchantId}/wallet`);
    this.walletHistoryUrl = apiAdminUrl(`merchants/${merchantId}/wallet-history`);
    this.walletDebitUrl = `/admin/merchants/${merchantId}/debit-wallet`;
    this.walletCreditUrl = `/admin/merchants/${merchantId}/credit-wallet`;

    this.xhrGet(apiAdminUrl(`merchants/${merchantId}`))
      .then(resp => {
        this.merchant = User.fromData(resp.data.data).prepareData();
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>

</style>
