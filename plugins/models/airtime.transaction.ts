import BaseModel from "~/plugins/models/base.model";
import {nuxtLink} from "~/plugins/helpers/html";
import {authToken, formatKobo, serverUrl} from "~/plugins/helpers/misc";
import {airtime_transaction_status} from "~/plugins/status/airtime_transaction_status";

export class AirtimeTransaction extends BaseModel {
  public user_id: number
  public airtime_transaction_id: number
  public network_provider_id: number
  public full_name: string
  public full_name_view_page: string
  public status: string
  public status_view_page: string
  public np_name: string
  public np_name_view_page: string
  public airtime_amount: number
  public airtime_amount_formatted: string
  public airtime_computed_price: number
  public airtime_computed_price_formatted: string
  public airtime_original_price: number
  public airtime_original_price_formatted: string
  public pdf_print_url: string
  public image_print_url: string

  prepareData(prefix: string = 'admin'): AirtimeTransaction {
    this.airtime_computed_price_formatted = formatKobo(this.airtime_computed_price)
    this.airtime_original_price_formatted = formatKobo(this.airtime_original_price)
    this.airtime_amount_formatted = formatKobo(this.airtime_amount)

    this.full_name_view_page = nuxtLink(`${prefix}/users/${this.user_id}`, this.full_name, '')
    this.np_name_view_page = nuxtLink(`${prefix}/network-providers/${this.network_provider_id}`, this.np_name, '')

    this.status_view_page = airtime_transaction_status(this.status)

    this.pdf_print_url = this.get_print_url(prefix === 'admin', false)
    this.image_print_url = this.get_print_url(prefix === 'admin', true)

    return this
  }

  receipt_url(is_admin = false, is_image = false) {
    window.open(this.get_print_url(is_admin, is_image))
  }

  get_print_url(is_admin = false, is_image = false) {
    let prefix = is_admin ? 'admin/' : '';
    let image_query = is_image ? '&type=image' : '';
    return serverUrl(prefix + `receipts/airtime-transactions/${this.airtime_transaction_id}?token=${authToken(true)}${image_query}`)
  }
}
