import BaseModel from "./base.model";
import Role from "./role";
import {nuxtLink} from "~/plugins/helpers/html";
import {user_status} from "~/plugins/status/user_status";

export class User extends BaseModel {
  public id: number
  public full_name: string
  public status_badge: string
  public first_name: string
  public last_name: string
  public other_names: string
  public frontend_layout: string
  public status: string
  public roles: Role[]

  fullName(prefix: string | null = null): string {
    if (prefix) {
      return `${this[`${prefix}_first_name`]} ${this[`${prefix}_last_name`]} ${this[`${prefix}_other_names`] ?? ''}`
    }

    return `${this.first_name} ${this.last_name} ${this.other_names ?? ''}`
  }

  prepareData(): User {
    // this.full_name = this.fullName();
    this.status_badge = user_status(this.status);
    return this;
  }

  viewPageLink(
    urlPrefix: string = 'admin',
    userIdColumn: string = 'id',
    prefix: string | null = null,
    useFullName: boolean = false
  ): string {
    const name = useFullName ? this.full_name : this.fullName(prefix)
    return nuxtLink(`${urlPrefix}/users/${this[userIdColumn]}`, name, '')
  }
}
