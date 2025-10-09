<template>
  <li style="cursor: pointer">
    <a :href="href" @click.prevent="visitLink" class="dropdown-item">
      <span>
        <em v-if="icon" :class="`bx bx-${icon}`"></em>
        <slot/>
      </span>
    </a>
  </li>
</template>

<script>
export default {
  name: "DropdownItem",
  props: ['href', 'icon'],
  methods: {
    visitLink(e) {
      if (!this.href) {
        this.$emit('click', e)
        return;
      }

      this.$router.push(e.currentTarget.getAttribute('href'))
    }
  }
}
</script>

<style scoped>

</style>
