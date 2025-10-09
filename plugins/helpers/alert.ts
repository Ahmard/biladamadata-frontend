import Swal from "sweetalert2";
import {redirect} from "~/plugins/helpers/misc";
import {AlertInterface} from "~/types/alert.interface";

export default class Alert {
  static success(options: AlertInterface) {
    Swal.fire({
      title: options.title,
      html: options.html,
      icon: 'success'
    }).then(() => {
      if (options.redirect_url) {
        redirect(options.redirect_url)
      }
    })
  }

}
