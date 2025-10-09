<template>

  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div>
      <Resellers
        v-if="merchantId.length"
        :merchant-id="merchantId"
        page-length="10"
      />
    </div>
  </div>
</template>

<script>
import Resellers from "~/components/Merchant/Resellers.vue";

export default {
  name: "resellers",
  middleware: ['isAdmin'],
  components: {Resellers},
  data() {
    return {
      merchantId: '',
      breadcrumbs: [],
    }
  },
  mounted() {
    this.merchantId = this.$route.params.id
    this.breadcrumbs = [
      {
        name: 'Merchants',
        url: '/admin/merchants'
      },
      {
        name: 'Info',
        url: `/admin/merchants/${this.merchantId}`
      },
      {
        name: 'Resellers'
      }
    ];
  }
}
</script>

<style scoped>

</style>
