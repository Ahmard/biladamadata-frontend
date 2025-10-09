<template>
  <card class="mt-2">
    <card-header :loading="is_fetching_bvn" loading-message="Fetching BVN">
      <template v-if="withTitle" #title>Bank Verification Number</template>
      <template #desc>
        <NuxtLink to="/profile/bvn-update" v-if="withActionButtons && !van_request_exists">
          <i class="bx bx-edit-alt"></i> Update BVN
        </NuxtLink>
      </template>
    </card-header>
    <card-body v-if="!is_fetching_bvn">
      <div class="row" v-if="bvn.approved?.bvn">
        <div class="col-md">
          <div class="list-group list-group-flush mt-2">
            <div class="list-group-item">
              <b>BVN:</b> <span class="fw-bold">{{ bvn.approved?.bvn }}</span>
            </div>
            <div class="list-group-item">
              <b>Status:</b> <span v-html="bvn.approved?.status_badge"></span>
            </div>
            <div class="list-group-item">
              <b>Added At:</b> <span>{{ bvn.approved?.created_at }}</span>
            </div>
          </div>
        </div>
        <div class="col-md" v-if="bvn.pending">
          <div class="list-group list-group-flush mt-2">
            <div class="list-group-item">
              <b>BVN:</b> <span class="fw-bold">{{ bvn.pending?.bvn }}</span>
            </div>
            <div class="list-group-item">
              <b>Status:</b> <span v-html="bvn.pending?.status_badge"></span>
            </div>
            <div class="list-group-item">
              <b>Requested At:</b> <span>{{ bvn.pending?.created_at }}</span>
            </div>
          </div>
        </div>
      </div>
    </card-body>
  </card>
</template>

<script>
import {apiUrl} from "~/plugins/helpers/misc";
import {UserBankVerificationNumber} from "~/plugins/models/user.bank.verification.number";

export default {
  name: "BankVerificationNumberCard",
  props: {
    endpoint: {default: null},
    withTitle: {default: true},
    withActionButtons: {default: true},
    van_request_exists: {default: null},
  },
  data() {
    return {
      bvn: {},
      is_fetching_bvn: true,
    }
  },
  async mounted() {
    const bvn = (await this.xhrGet(apiUrl('profile/bvn'))).data.data

    if (bvn) {
      this.bvn = {
        approved: UserBankVerificationNumber.fromData(bvn.approved).prepareData(),
        pending: bvn.pending
          ? UserBankVerificationNumber.fromData(bvn.pending).prepareData()
          : null,
      };
    }

    this.$emit('bvn', this.bvn)
    this.is_fetching_bvn = false
  }
}
</script>

<style scoped>

</style>
