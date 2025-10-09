import BaseModel from "./base.model";
import {nuxtLink} from "~/plugins/helpers/html";
import {data_plan_status} from "~/plugins/status/data_plan_status";
import {formatFileSize} from "~/plugins/helpers/str";

export class DataPlan extends BaseModel {
  public data_plan_id: number
  public network_provider_id: number
  public data_plan_category_id: number
  public dp_name: string
  public dp_desc: string
  public np_name: string
  public np_view_page: string
  public dpc_name: string
  public dpc_view_page: string
  public data_quantity: number
  public data_quantity_formatted: string
  public expired_in: number
  public huzmo_id: number
  public status: string
  public status_badge: string

  viewPageLink(urlPrefix: string = 'admin', idColumn: string = 'id'): string {
    return nuxtLink(`${urlPrefix}/data-plans/${this[idColumn]}`, this.dp_name, '')
  }


  prepareData(urlPrefix: string = 'admin'): DataPlan {
    this.status_badge = data_plan_status(this.status)
    this.data_quantity_formatted = formatFileSize(this.data_quantity * 1024 * 1024)

    this.np_view_page = nuxtLink(`${urlPrefix}/network-providers/${this.network_provider_id}`, this.np_name, '')
    this.dpc_view_page = nuxtLink(`${urlPrefix}/data-plan-categories/${this.data_plan_category_id}`, this.dpc_name, '')
    return this
  }
}
