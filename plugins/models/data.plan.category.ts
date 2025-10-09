import BaseModel from "~/plugins/models/base.model";
import {nuxtLink} from "~/plugins/helpers/html";
import {data_plan_category_status} from "~/plugins/status/data_plan_category_status";

export class DataPlanCategory extends BaseModel {
  dpc_name: string
  dpc_desc: string
  status: string
  status_badge: string

  prepareData(): DataPlanCategory {
    this.status_badge = data_plan_category_status(this.status)
    return this
  }

  viewPageLink(idColumn: string = 'dpc_id'): string {
    return nuxtLink(`admin/data-plan-categories/${this[idColumn]}`, this.dpc_name, '')
  }
}
