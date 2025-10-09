import BaseModel from "~/plugins/models/base.model";
import {nuxtLink} from "~/plugins/helpers/html";

export class Beneficiary extends BaseModel {
  public user_id: number
  public beneficiary_id: number
  public full_name: string
  public first_mobile_number: string
  public total_mobile_numbers: string
  public owner_full_name: string
  public owner_full_name_view_page: string
  public status: string

  prepareData(prefix: string = 'admin'): Beneficiary {
    this.owner_full_name_view_page = nuxtLink(`${prefix}/users/${this.user_id}`, this.owner_full_name, '')

    return this
  }
}
