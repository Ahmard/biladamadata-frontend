<template>
  <div>
    <WalletCard />
    <SuperAdminDashboard v-if="'SUPER_ADMIN' === role.name"/>
    <MerchantDashboard v-if="'MERCHANT' === role.name"/>
    <ResellerDashboard v-if="'RESELLER' === role.name"/>
  </div>
</template>

<script>
import SuperAdminDashboard from "~/components/Dashboard/SuperAdminDashboard.vue";
import MerchantDashboard from "~/components/Dashboard/MerchantDashboard.vue";
import ResellerDashboard from "~/components/Dashboard/ResellerDashboard.vue";
import WalletCard from "~/components/Dashboard/WalletCard.vue";

export default {
  name: 'IndexPage',
  components: {WalletCard, ResellerDashboard, MerchantDashboard, SuperAdminDashboard},
  data() {
    return {
      dashboard_type: 'hod',
      user: {roles: []},
      role: {name: ''},
    }
  },
  methods: {
    changeDashboardType(type) {
      console.log(type)
      this.dashboard_type = type
    }
  },
  mounted() {
    this.user = this.$auth.user
    this.role = this.user.roles[0]
  }
}
</script>
