import {validateAuth} from "~/plugins/helpers/auth";

export default function ({redirect, store}) {
  const user = store.state.auth.user
  validateAuth(user, ['RESELLER']);
}
