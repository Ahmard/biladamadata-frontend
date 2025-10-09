import Vue from "vue";

export default function (app) {
  if (app.$auth.loggedIn) {
    try {
      const address = process.env.WS_SERVER_ADDRESS;
      const conn = Vue.prototype.$wsPhoenix = RTC_Websocket.create(`${address}/ws/phoenix`, [], {
        user_id: app.$auth.user.id,
        email: app.$auth.user.email,
        phone_number: app.$auth.user.phone_number,
        full_name: `${app.$auth.user.first_name} ${app.$auth.user.last_name}`,
      })

      conn.onOpen(() => console.log('ws[phoenix]: opened'))
      conn.onClose(() => console.log('ws[phoenix]: closed'))
    } catch (e) {
      console.error(e)
    }
  }
}
