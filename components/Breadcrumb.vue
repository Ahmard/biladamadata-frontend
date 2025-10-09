<template>
  <h4 class="fw-bold py-3 mb-4">
    <span class="text-muted fw-light">
      <NuxtLink to="/">Dashboard</NuxtLink> /
    </span>

    <span v-for="item in items">
      <span v-if="item.url" class="text-muted fw-light">
        <NuxtLink :to="item.url">{{ item.name }}</NuxtLink> /
      </span>

      <span v-if="!item.url">{{ item.name }}</span>
    </span>
  </h4>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: ['items'],
  mounted() {

  }
}
</script>

<style scoped>

</style>
