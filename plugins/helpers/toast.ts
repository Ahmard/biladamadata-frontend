import Vue from "vue";
import Notification from "~/components/Notification.vue";
import {Notification as NotificationModel} from "~/plugins/models/notification";
import {redirect} from "~/plugins/helpers/misc";

export function toast(nuxt: Vue, title: string, body: string, url?: string, type?: string, notificationId?: number) {
  const component = {
    component: Notification,
    props: {
      title: title,
      message: body
    },
  }

  const config = {
    position: "bottom-right",
    timeout: 1000 * 60 * 15,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false,
    onClick: () => {
      if (url) redirect(url);
    },
    onClose: () => {
      if (notificationId) {
        NotificationModel.updateGlancedNotifications([notificationId])
      }
    }
  }

  if (!type || type === 'default') {
    // @ts-ignore
    nuxt.$toast(component, config);
  } else {
    // @ts-ignore
    nuxt.$toast[type](component, config);
  }
}
