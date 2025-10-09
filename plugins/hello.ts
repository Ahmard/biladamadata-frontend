import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $hello(message: string): void
  }
}

Vue.prototype.$hello = function () {
  console.log(this)
}
