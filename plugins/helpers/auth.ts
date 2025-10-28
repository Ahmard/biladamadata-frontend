import {nuxt, redirect, windowLoaded} from "./misc";
import {LooseObject} from "~/types/loose.object";

export function validateAuth(user: LooseObject, role: string[]) {
  if (user.temp_password_status == 'used') {
    if (!nuxt()) {
      windowLoaded(() => redirect(`/profile/change_password`))

      return;
    }

    return redirect(`/profile/change_password`)
  }

  if (user.requires_reg_payment && !user.has_paid_reg_fees) {
    return windowLoaded(() => redirect(`/payments`))
  }

  for (let i = 0; i < user.roles.length; i++) {
    if (role.includes(user.roles[i].name)) {
      return true
    }
  }

  return windowLoaded(() => redirect(`/dashboard`))
}
