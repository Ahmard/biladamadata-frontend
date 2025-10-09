<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <card class="mt-2">
      <card-header :has-controls="true">
        <template v-slot:title>Mailing</template>
        <template v-slot:desc>
          <NuxtLink class="btn btn-sm btn-primary fw-bold" to="/admin/mailing/send">
            <i class='bx bxs-envelope'></i> Send Mail
          </NuxtLink>
        </template>
      </card-header>
      <card-body class="table-responsive table-responsive-md">
      </card-body>
    </card>
  </div>
</template>

<script>
export default {
  name: "index",
  head: {
    title: 'Mailing'
  },
  data() {
    return {
      table: null,
      breadcrumbs: [
        {
          name: 'Mailing',
        },
      ],
    }
  },
}
</script>

<style scoped>

</style>
