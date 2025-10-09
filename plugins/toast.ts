import Vue from "vue";
import {toast} from "~/plugins/helpers/toast";

declare module 'vue/types/vue' {
  interface Vue {
    $wsPhoenix: any,
    $showToast(title: string, body: string, url?: string, type?: string, notificationId?: number): void
  }
}

Vue.prototype.$showToast = function (title: string, body: string, url?: string, type: string = 'default', notificationId?: number) {
  return toast(this, title, body, url, type, notificationId);
}
