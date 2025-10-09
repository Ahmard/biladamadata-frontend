import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $initDatatable(message: string): void
  }
}

Vue.prototype.$initDatatable = function () {
  console.log(this)
}
