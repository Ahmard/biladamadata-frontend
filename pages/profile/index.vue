<template>
  <div class="flex-grow-1 container-p-y">

    <div class="row">
      <div class="col-md-6">

        <card class="mb-4">
          <card-header v-if="is_fetching" :loading="is_fetching" loading-message="loading profile...">
            <template #title>My Profile</template>
          </card-header>
          <card-body v-if="!is_fetching">
            <div class="row">
              <div class="col-lg-12">
                <div class="d-flex justify-content-between fw-bold">
                  <div class="text-uppercase">My Profile</div>
                  <NuxtLink class="text-primary" to="/wallet">
                    Wallet: {{ user['wallet']['amount_formatted'] }}
                  </NuxtLink>
                </div>
                <div class="d-flex justify-content-center">
                  <div>
                    <img alt class="w-px-150 h-auto rounded-circle" src="/assets/img/gender-neutral-avatar.jpg"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 col-sm-6 mt-1">
                <div>Username</div>
                <div class="text-muted fw-bold">@{{ user['username']['displayable'] }}</div>
              </div>
              <div class="col-md-4 col-sm-6 mt-1">
                <div>Full Name</div>
                <div class="text-muted">{{ user['first_name'] }} {{ user['last_name'] }}</div>
              </div>
              <div class="col-md-4 col-sm-6 mt-1">
                <div>Email Address</div>
                <div class="text-muted">{{ user['email'] }}</div>
              </div>
              <div class="col-md-4 col-sm-6 mt-1">
                <div>Phone Number</div>
                <div class="text-muted">{{ user['phone_number'] }}</div>
              </div>
              <div class="col-md-4 col-sm-6 mt-1">
                <div>Status</div>
                <div class="text-muted">
                  <span v-html="user['status_badge']"></span>
                </div>
              </div>
              <div class="col-md-4 col-sm-6 mt-1">
                <div>State</div>
                <div class="text-muted">{{ geo_data['geo_state_name'] }}</div>
              </div>
              <div class="col-md-4 col-sm-6 mt-1">
                <div>Local Government</div>
                <div class="text-muted">{{ geo_data['geo_local_gov_name'] }}</div>
              </div>
              <div class="col-md-4 col-sm-6 mt-1">
                <div>Role</div>
                <div class="text-muted">{{ user['roles'][0]['name'] }}</div>
              </div>
              <div class="col-md-4 col-sm-6 mt-1">
                <div>Member Since</div>
                <div class="text-muted">{{ user['created_at'] }}</div>
              </div>

              <div class="col-md-12 mt-1">
                <div>Referral Code</div>
                <div
                  class="text-muted fw-bold"
                  data-bs-placement="top"
                  data-bs-title="click to copy referral code"
                  data-bs-toggle="tooltip"
                  @click="copyLink"
                  @mouseleave="hideTooltip"
                  @mouseover="showTooltip">
                  {{ user['username']['username'] }}
                </div>
              </div>
              <div class="col-md-12 mt-1">
                <div>Referral Links</div>
                <div class="text-primary">
                  <ul>
                    <li
                      data-bs-placement="top"
                      data-bs-title="click to copy merchant referral link"
                      data-bs-toggle="tooltip"
                      @click="copyLink"
                      @mouseleave="hideTooltip"
                      @mouseover="showTooltip">
                      https://app.biladamadata.com/#/merchant/enrollment?ref={{ user['username']['username'] }}
                    </li>
                    <li
                      data-bs-placement="top"
                      data-bs-title="click to copy reseller referral link"
                      data-bs-toggle="tooltip"
                      @click="copyLink"
                      @mouseleave="hideTooltip"
                      @mouseover="showTooltip">
                      https://app.biladamadata.com/#/reseller/enrollment?ref={{ user['username']['username'] }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="text-end mt-4">
              <dropdown btn-text="Manage Profile">
                <template #items>
                  <dropdown-item href="/profile/update" icon="edit-alt">Update Profile</dropdown-item>
                  <dropdown-item href="/profile/username-change" icon="edit">Change Username</dropdown-item>
                </template>
              </dropdown>
            </div>
          </card-body>
        </card>

        <!-- BVN -->
        <BankVerificationNumberCard
          v-if="acc_nums.length"
          :endpoint="apiUrl('profile/bvn')"
          :van_request_exists="has_van_request"
          @bvn="handleBVN"
        />
      </div>


      <div class="col-md-6">
        <!-- ACCOUNT NUMBER -->
        <card>
          <card-header :loading="is_fetching_acc_num" loading-message="Fetching Account">
            <template #title>Virtual Account Number</template>
            <template #desc>
              <div v-if="!has_van_request && has_bvn">
                <NuxtLink to="/profile/van-request">
                  <i class="bx bx-sync"></i> Regenerate
                </NuxtLink>
              </div>
              <div v-if="!has_van_request && !has_bvn">
                <NuxtLink to="/profile/bvn-update">
                  <i class="bx bx-edit-alt"></i> Update BVN
                </NuxtLink>
              </div>
            </template>
          </card-header>

          <card-body>
            <div v-if="!is_fetching_bvn && has_van_request" class="mt-2">
              <div class="alert alert-warning fw-bold">
                Your virtual account number request has been received, we will process it and get back to you.
              </div>
            </div>

            <AccountNumbers
              :endpoint="apiUrl('profile/van')"
              :with-loader="false"
              card-height="340px"
              class="mt-2"
              col-size="6"
              @numbers="handleAccountNumbers"
            />
          </card-body>
        </card>

        <!-- BVN -->
        <BankVerificationNumberCard
          v-if="!acc_nums.length"
          :endpoint="apiUrl('profile/bvn')"
          :van_request_exists="has_van_request"
          @bvn="handleBVN"
        />
      </div>
    </div>

    <toast v-model="is_toast_visible" :timeout="1000">
      Copied successfully
    </toast>
  </div>
</template>

<script>
import {apiUrl, formatKobo} from "~/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import AccountNumbers from "~/components/Wallet/AccountNumbers.vue";
import BankVerificationNumberCard from "~/components/User/BankVerificationNumberCard.vue";

export default {
  name: "profile",
  components: {BankVerificationNumberCard, AccountNumbers},
  middleware: ['isAuth'],
  head: {
    title: 'Profile'
  },
  data() {
    return {
      user: {},
      acc_nums: [],
      has_bvn: false,
      has_van_request: false,
      geo_data: {},
      is_toast_visible: false,
      is_fetching: true,
      is_fetching_bvn: true,
      is_fetching_acc_num: true,
      tooltip_message: '',
      breadcrumbs: [
        {
          name: 'Profile',
        },
      ],
    }
  },
  methods: {
    apiUrl,
    copyLink(e) {
      navigator.clipboard.writeText(e.currentTarget.innerText)
      this.is_toast_visible = true

      this.hideTooltip(e)
    },
    showTooltip(e) {
      this.tooltip_message = e.currentTarget.dataset.message
      window.bootstrap.Tooltip.getOrCreateInstance(e.currentTarget).show()
    },
    hideTooltip(e) {
      window.bootstrap.Tooltip.getOrCreateInstance(e.currentTarget).hide()
    },
    handleAccountNumbers(acc_nums) {
      this.acc_nums = acc_nums.van
      this.has_van_request = acc_nums.req
      this.is_fetching_acc_num = false
    },
    handleBVN(bvn) {
      this.has_bvn = bvn && bvn.approved && bvn.approved.bvn
      this.is_fetching_bvn = false
    }
  },
  async mounted() {
    this.user = User.fromData((await this.$auth.fetchUser()).data).prepareData();
    this.geo_data = this.user.geo_data ?? {}
    this.user.wallet.amount_formatted = formatKobo(this.user.wallet.amount)
    this.is_fetching = false
  }
}
</script>

<style scoped>

</style>
