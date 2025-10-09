<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-9">
        <card>
          <card-header :has-controls="true" :loading="loading">
            <template #title>User Information</template>
            <template #desc>
              <h6 class="fw-bold" v-html="user['status_badge']"></h6>
            </template>
          </card-header>
          <card-body v-if="user.id">
            <div class="row mt-1">
              <div class="col-md-3 mb-1">
                <div class="text-muted">Username</div>
                <div>{{ user.username }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Full Name</div>
                <div>{{ user.full_name }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Email</div>
                <div>{{ user.email }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Alternative Email</div>
                <div>{{ user['alternative_email'] }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Phone Number</div>
                <div>{{ user.phone_number }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Gender</div>
                <div>{{ user['gender'] }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">State</div>
                <div>{{ user['geo_state_name'] }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">City</div>
                <div>{{ user['geo_local_gov_name'] }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Created At</div>
                <div>{{ user['created_at'] }}</div>
              </div>
            </div>

            <div class="text-end mt-3">
              <dropdown>
                <template #items>
                  <dropdown-item
                    :href="`/admin/users/${user.id}/edit`"
                    icon="edit"
                  >Edit
                  </dropdown-item>
                  <dropdown-item
                    v-if="user.status !== 'active'"
                    :href="`/admin/users/${user.id}/activate`"
                    icon="check"
                  >Activate
                  </dropdown-item>
                  <dropdown-item
                    v-if="user.status === 'active'"
                    :href="`/admin/users/${user.id}/deactivate`"
                    icon="block"
                  >Deactivate
                  </dropdown-item>
                </template>
              </dropdown>
            </div>
          </card-body>
        </card>
      </div>

      <div class="col-md-3">
        <WalletBalance
          v-if="!loading && user.id"
          :credit-url="walletCreditUrl"
          :debit-url="walletDebitUrl"
          :url="walletUrl"
          :with-fund-option="false"
          title="User Wallet"
          @refreshing="handleWalletRefreshing"
        />
      </div>
    </div>

    <div v-if="!loading && user.id" class="row mt-3">
      <div class="col-md-12">
        <style>
          .dt-row {
            margin-top: -20px !important;
          }
        </style>
        <v-tabs v-model="tab" next-icon="bx bx-chevron-right" prev-icon="bx bx-chevron-left">
          <v-tab>Wallet History</v-tab>
          <v-tab>Beneficiaries</v-tab>
          <v-tab>Data Transactions</v-tab>
          <v-tab>Airtime Transactions</v-tab>
          <v-tab>VANs</v-tab>
          <v-tab>BVN</v-tab>
          <v-tab>Auth Attempts</v-tab>

          <v-tab-item>
            <div class="container table-responsive table-responsive-md mt-1">
              <WalletHistory
                :key="component_wallet_history_key"
                :page-length="5"
                :table-id="`admin-user-wallet-history-${user.id}`"
                :url="walletHistoryUrl"
                :with-card="false"
              />
            </div>
          </v-tab-item>

          <v-tab-item>
            <div class="container table-responsive table-responsive-md mt-1">
              <BeneficiaryList
                v-if="user.id"
                :endpoint="apiUrl(`admin/users/${user.id}/beneficiaries`)"
                :redirect-after-deletion="false"
                :table-id="`user-beneficiaries-${user.id}`"
                :with-owner="false"
              />
            </div>
          </v-tab-item>

          <v-tab-item>
            <div class="container table-responsive table-responsive-md mt-1">
              <DataTransactionList
                v-if="user.id"
                :endpoint="apiAdminUrl(`users/${user.id}/data-transactions`)"
                :table-id="`user-data-transactions-${user.id}`"
                :with-owner="false"
                :with-page-length="5"
              />
            </div>
          </v-tab-item>

          <v-tab-item>
            <div class="container table-responsive table-responsive-md mt-1">
              <TransactionList
                v-if="user.id"
                :endpoint="apiAdminUrl(`users/${user.id}/data-transactions`)"
                :table-id="`user-airtime-transactions-${user.id}`"
                :with-owner="true"
                :with-page-length="5"
              />
            </div>
          </v-tab-item>

          <v-tab-item>
            <AccountNumbers
              v-if="user.id"
              :endpoint="apiAdminUrl(`users/${user.id}/van`)"
              :with-loader="false"
              :with-tip="false"
              card-height="250px"
              col-size="3"
            />
          </v-tab-item>

          <v-tab-item>
            <BankVerificationNumberCard
              v-if="user.id"
              :endpoint="apiAdminUrl(`users/${user.id}/bvn`)"
              :van_request_exists="false"
              :with-action-buttons="false"
              :with-title="false"
            />
          </v-tab-item>

          <v-tab-item>
            <div class="container table-responsive table-responsive-md mt-1">
              <UserAuthAttempts
                v-if="user.id"
                :endpoint="apiAdminUrl(`users/${user.id}/auth-attempts`)"
                :table-id="`user-auth-attempts-${user.id}`"
                :with-owner="false"
                :with-page-length="5"
              />
            </div>
          </v-tab-item>
        </v-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl, apiUrl} from "@/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import List from "~/components/Beneficiary/List.vue";
import TransactionList from "~/components/Airtime/TransactionList.vue";
import AccountNumbers from "~/components/Wallet/AccountNumbers.vue";
import BankVerificationNumberCard from "~/components/User/BankVerificationNumberCard.vue";

export default {
  name: "index",
  components: {BankVerificationNumberCard, AccountNumbers, TransactionList, List},
  middleware: ['isAdmin'],
  head: {
    title: 'User Info'
  },
  data() {
    return {
      tab: 0,
      loading: true,
      user: {id: null},
      walletUrl: '',
      walletDebitUrl: '',
      walletCreditUrl: '',
      walletHistoryUrl: '',
      component_wallet_history_key: Date.now(),
      breadcrumbs: [
        {
          name: 'Users',
          url: '/admin/users'
        },
        {
          name: 'Info',
        },
      ],
    }
  },
  methods: {
    apiAdminUrl,
    apiUrl,
    handleWalletRefreshing() {
      this.component_wallet_history_key = Date.now()
    }
  },
  mounted() {
    const userId = this.$route.params.id;

    this.xhrGet(apiAdminUrl(`users/${userId}`))
      .then(resp => {
        this.user = User.fromData(resp.data.data).prepareData();

        this.walletUrl = apiAdminUrl(`users/${userId}/wallet`);
        this.walletHistoryUrl = apiAdminUrl(`users/${userId}/wallet-history`);
        this.walletDebitUrl = `/admin/users/${userId}/debit-wallet`;
        this.walletCreditUrl = `/admin/users/${userId}/credit-wallet`;
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>
</style>
