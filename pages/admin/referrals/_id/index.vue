<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-9">
        <div class="card">
          <CardHeader :loading="loading">
            <template v-slot:title>Referral Information</template>
            <template v-slot:desc>
              <h6 class="fw-bold" v-html="referral['status_badge']"></h6>
            </template>
          </CardHeader>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <div class="text-muted">Type</div>
                <div>{{ referral['type'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Beneficiary Type</div>
                <div>{{ referral['beneficiary_type'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Bonus Amount</div>
                <div>{{ referral['bonus_amount_formatted'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Created By</div>
                <div>{{ referral['creator_full_name'] }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted">Created At</div>
                <div>{{ referral['created_at'] }}</div>
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
                  <li>
                    <NuxtLink :to="`${referralId}/edit`" class="dropdown-item">
                      <i class="fas fa-edit"></i> Edit
                    </NuxtLink>
                  </li>
                  <li v-if="'active' === referral.status">
                    <a class="dropdown-item" href="" @click.prevent="deactivate">
                      <i class="fas fa-cancel"></i> Deactivate
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <div class="row mt-3">
      <div class="col-md-6">

      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";
import {Referral} from "~/plugins/models/referral";

export default {
  name: "AdminReferralInfo",
  middleware: ['isAdmin'],
  head: {
    title: 'Referral Info'
  },
  data() {
    return {
      loading: true,
      referralId: '',
      referral: {id: null},
      walletUrl: '',
      walletHistoryUrl: '',
      breadcrumbs: [
        {
          name: 'Referrals',
          url: '/admin/referrals'
        },
        {
          name: 'Info',
        },
      ],
    }
  },
  methods: {
    deactivate() {
      Swal.fire({
        title: 'Disable Referral?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, disable!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.xhrPatch(apiAdminUrl(`referrals/${this.referralId}/deactivate`)).then(resp => {
            Swal.fire(
              'Referral',
              'Referral has been disabled',
              'success'
            );

            this.referral = Referral.fromData(resp.data.data).prepareData()
          })
        }
      })
    }
  },
  mounted() {
    const referralId = this.referralId = this.$route.params.id;

    this.walletUrl = apiAdminUrl(`referrals/${referralId}/wallet`);
    this.walletHistoryUrl = apiAdminUrl(`referrals/${referralId}/wallet-history`);

    this.xhrGet(apiAdminUrl(`referrals/${referralId}`))
      .then(resp => {
        this.referral = Referral.fromData(resp.data.data).prepareData();
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>

</style>
