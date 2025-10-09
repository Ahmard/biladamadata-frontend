import BaseModel from "./base.model";
import {nuxtLink} from "~/plugins/helpers/html";

export class NetworkProvider extends BaseModel {
  public network_provider_id: number
  public np_name: string
  public np_desc: string
  public np_logo: string
  public data_price: number

  viewPageLink(
    urlPrefix: string = 'admin',
    userIdColumn: string = 'network_provider_id',
    prefix: string | null = null
  ): string {
    return nuxtLink(`${urlPrefix}/network-providers/${this[userIdColumn]}`, this.np_name, '')
  }
}
