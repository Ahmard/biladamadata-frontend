import {User} from "~/plugins/models/user";
import {LooseObject} from "~/types/loose.object";
import {nuxtLink} from "~/plugins/helpers/html";

export function fullName(user: User | LooseObject): string {
  return `${user.first_name} ${user.last_name} ${user.other_names ?? ''}`
}

export function fullNameAlt(user: User | LooseObject, prefix: string): string {
  // @ts-ignore
  return `${user[`${prefix}_first_name`]} ${user[`${prefix}_last_name`]} ${user[`${prefix}_other_names`] ?? ''}`
}

export function user_view_page(html: string, url: string) {
  return nuxtLink(url, html, 'custom-link');
}
