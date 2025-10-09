import {validateAuth} from "~/plugins/helpers/auth";

export default function ({redirect, store}) {
  const user = store.state.auth.user
  validateAuth(user, ['ADMIN', 'SUPER_ADMIN']);
}
