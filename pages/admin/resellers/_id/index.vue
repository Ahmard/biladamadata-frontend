<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-9">
        <card>
          <card-header :loading="loading">
            <template v-slot:title>Reseller Information</template>
            <template v-slot:desc>
              <h6 class="fw-bold" v-html="reseller['status_badge']"></h6>
            </template>
          </card-header>
          <card-body v-if="reseller.id">
            <div class="row mt-2">
              <div class="col-md-3 mb-1">
                <div class="text-muted">Username</div>
                <div>{{ reseller.username }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Full Name</div>
                <div>{{ reseller.full_name }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Email</div>
                <div>{{ reseller.email }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Alternative Email</div>
                <div>{{ reseller['alternative_email'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Phone Number</div>
                <div>{{ reseller.phone_number }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Gender</div>
                <div>{{ reseller['gender'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">State</div>
                <div>{{ reseller['geo_state_name'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">City</div>
                <div>{{ reseller['geo_local_gov_name'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Created At</div>
                <div>{{ reseller['created_at'] }}</div>
              </div>
            </div>

            <div class="mt-3 text-end">
              <dropdown>
                <template #items>
                  <dropdown-item
                    :href="`/admin/users/${reseller.id}`"
                    icon="user"
                  >Detailed Info
                  </dropdown-item>
                  <dropdown-item
                    :href="`/admin/users/${reseller.id}/edit`"
                    icon="edit"
                  >Edit
                  </dropdown-item>
                  <dropdown-item
                    v-if="reseller.status !== 'active'"
                    :href="`/admin/users/${reseller.id}/activate`"
                    icon="check"
                  >Activate
                  </dropdown-item>
                  <dropdown-item
                    v-if="reseller.status === 'active'"
                    :href="`/admin/users/${reseller.id}/deactivate`"
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
          v-if="walletUrl.length"
          :credit-url="walletCreditUrl"
          :debit-url="walletDebitUrl"
          :url="walletUrl"
          :with-fund-option="false"
          title="Reseller Wallet"
        />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-12">
        <WalletHistory v-if="walletHistoryUrl.length" :page-length="5" :url="walletHistoryUrl"/>
      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl} from "@/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import Swal from "sweetalert2";

export default {
  name: "AdminResellerInfo",
  middleware: ['isAdmin'],
  head: {
    title: 'Reseller Info'
  },
  data() {
    return {
      loading: true,
      reseller: {id: null},
      walletUrl: '',
      walletHistoryUrl: '',
      walletDebitUrl: '',
      walletCreditUrl: '',
      breadcrumbs: [
        {
          name: 'Resellers',
          url: '/admin/resellers'
        },
        {
          name: 'Info',
        },
      ],
    }
  },
  methods: {
    activate() {
      Swal.fire({
        title: 'Activate Reseller?',
        text: "Are you sure you want to deactivate this reseller?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, activate!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.xhrPatch(apiAdminUrl(`resellers/${this.reseller.id}/activate`)).then(resp => {
            Swal.fire({
              title: 'Reseller',
              html: 'Reseller has been activated',
              icon: 'success'
            })

            this.reseller = User.fromData(resp.data.data).prepareData();
          })
        }
      })
    },
    deactivate() {
      Swal.fire({
        title: 'Deactivate Reseller?',
        text: "Are you sure you want to deactivate this reseller?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, deactivate!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.xhrPatch(apiAdminUrl(`resellers/${this.reseller.id}/deactivate`)).then(resp => {
            Swal.fire({
              title: 'Reseller',
              html: 'Reseller has been deactivated',
              icon: 'success'
            })

            this.reseller = User.fromData(resp.data.data).prepareData();
          })
        }
      })
    }
  },
  mounted() {
    const resellerId = this.$route.params.id;

    this.walletUrl = apiAdminUrl(`resellers/${resellerId}/wallet`);
    this.walletHistoryUrl = apiAdminUrl(`resellers/${resellerId}/wallet-history`);
    this.walletDebitUrl = `/admin/resellers/${resellerId}/debit-wallet`;
    this.walletCreditUrl = `/admin/resellers/${resellerId}/credit-wallet`;

    this.xhrGet(apiAdminUrl(`resellers/${resellerId}`))
      .then(resp => {
        this.reseller = User.fromData(resp.data.data).prepareData();
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>

</style>
