<template>
  <StatusUpdate
    :back-link-url="`/admin/data-plans/${planId}`"
    :endpoint="apiAdminUrl(`data-plans/${planId}/prices/${priceId}/deactivate`)"
    :item-id="priceId"
    acting="deactivating"
    action="deactivate"
    action-button-text="Deactivate"
    back-link-text="Data Plan"
    item="PLAN PRICE"
    title="Deactivate"
  />
</template>

<script>
import {apiAdminUrl} from "~/plugins/helpers/misc";

export default {
  name: "deactivate",
  methods: {apiAdminUrl},
  data() {
    return {
      planId: null,
      priceId: null,
    }
  },
  mounted() {
    this.planId = this.$route.params.id
    this.priceId = this.$route.query.id
  }
}
</script>

<style scoped>

</style>
