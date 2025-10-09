<template>
  <table class="table table-hover" :id="theId" :class="theClass">
    <slot/>
  </table>
</template>

<script>
import "static/assets/css/dataTables.bootstrap5.min.css";
import "assets/css/responsive.bootstrap5.min.css";
import {initDataTable} from "~/plugins/helpers/datatable";

require('datatables.net-bs5')
require('datatables.net-rowgroup-bs5')
require('datatables.net-responsive-bs5')

export default {
  name: "DataTable",
  props: {
    className: {default: null},
    config: {default: null},
    id: {default: null},
    responsive: {default: true},
    responsiveMd: {default: true},
  },
  watch: {
    id: function (val) {
      this.theId = val
    },
    config: function (val) {
      this.theConfig = val

      initDataTable(`table#${this.theId}`, this.theConfig);
    }
  },
  data() {
    return {
      theConfig: '',
      theClass: '',
      theId: ''
    }
  },
  mounted() {
    this.theId = this.id
    this.theClass = this.className
  }
}
</script>

<style scoped>

</style>
