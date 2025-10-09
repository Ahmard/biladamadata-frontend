<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-9">
        <div class="card">
          <card-header :has-controls="true" :loading="loading">
            <template #title>Reseller Information</template>
            <template #desc>
              <h6 class="fw-bold" v-html="reseller['status_badge']"></h6>
            </template>
          </card-header>
          <card-body v-if="reseller">
            <div class="row mt-1">
              <div class="col-md-3 mb-1">
                <div class="text-muted">Full Name</div>
                <div>{{ reseller.full_name }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Email</div>
                <div>{{ reseller.email }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Alternative Email</div>
                <div>{{ reseller['alternative_email'] }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Phone Number</div>
                <div>{{ reseller.phone_number }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Gender</div>
                <div>{{ reseller['gender'] }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">State</div>
                <div>{{ reseller['geo_state_name'] }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">City</div>
                <div>{{ reseller['geo_local_gov_name'] }}</div>
              </div>
              <div class="col-md-3 mb-1">
                <div class="text-muted">Created At</div>
                <div>{{ reseller['created_at'] }}</div>
              </div>
            </div>

            <div class="mt-3 text-end">
              <div class="btn-group">
                <button aria-expanded="false" class="btn btn-sm btn-primary dropdown-toggle text-white fw-bold"
                        data-bs-toggle="dropdown"
                        type="button">
                  Action
                </button>
                <ul class="dropdown-menu" data-popper-placement="bottom-start">
                  <li v-if="'inactive' === reseller.status">
                    <a class="dropdown-item" href="" @click.prevent="activate">
                      <i class="fas fa-check"></i> Activate
                    </a>
                  </li>
                  <li v-if="'active' === reseller.status">
                    <a class="dropdown-item" href="" @click.prevent="deactivate">
                      <i class="fas fa-cancel"></i> Deactivate
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </card-body>
        </div>
      </div>

      <div v-if="reseller" class="col-md-3">
        <WalletBalance
          v-if="walletUrl.length"
          :fund-url="`${reseller.id}/fund`"
          :show-option="true"
          :url="walletUrl"
          title="Reseller Wallet"
        />
      </div>
    </div>

    <div v-if="reseller" class="row mt-3">
      <div class="col-md-9">
        <WalletHistory
          v-if="walletHistoryUrl.length"
          :page-length="5"
          :url="walletHistoryUrl"
          table-id="merchant-reseller-wallet-history"/>
      </div>
    </div>
  </div>
</template>

<script>
import {apiMerchantUrl} from "@/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import Swal from "sweetalert2";

export default {
  name: "MerchantResellerInfo",
  middleware: ['isMerchant'],
  head: {
    title: 'Reseller Info'
  },
  data() {
    return {
      loading: true,
      reseller: {id: null},
      walletUrl: '',
      walletHistoryUrl: '',
      breadcrumbs: [
        {
          name: 'Resellers',
          url: '/merchant/resellers'
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
          this.xhrPatch(apiMerchantUrl(`resellers/${this.reseller.id}/activate`)).then(resp => {
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
          this.xhrPatch(apiMerchantUrl(`resellers/${this.reseller.id}/deactivate`)).then(resp => {
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

    this.walletUrl = apiMerchantUrl(`resellers/${resellerId}/wallet`);
    this.walletHistoryUrl = apiMerchantUrl(`resellers/${resellerId}/wallet-history`);

    this.xhrGet(apiMerchantUrl(`resellers/${resellerId}`))
      .then(resp => {
        this.reseller = User.fromData(resp.data.data).prepareData();
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>

</style>
