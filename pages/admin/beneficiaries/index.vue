<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template #title>Beneficiaries</template>
        <template #desc>
          <table-refresh-button :table="table"></table-refresh-button>
        </template>
      </card-header>
      <card-body class="table-responsive table-responsive-md">
        <BeneficiaryList
          :endpoint="apiUrl('admin/beneficiaries')"
          :redirect-after-deletion="false"
          :with-owner="true"
          :with-page-length="10"
          class="mt-2"
          @tableInit="t => table = t"
        />
      </card-body>
    </card>

  </div>
</template>


<script>
import {apiUrl} from "~/plugins/helpers/misc";

export default {
  name: "index",
  methods: {apiUrl},
  head() {
    return {
      title: 'Beneficiaries',
    }
  },
  data() {
    return {
      table: {},
      breadcrumbs: [
        {
          name: 'Beneficiaries'
        }
      ]
    }
  },
}
</script>

<style scoped>

</style>
