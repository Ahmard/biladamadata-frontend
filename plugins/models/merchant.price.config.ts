import BaseModel from "./base.model";
import {merchant_price_config_status} from "~/plugins/status/merchant_price_config_status";
import {formatKobo} from "~/plugins/helpers/misc";

export class MerchantPriceConfig extends BaseModel {
  public mpc_id: number
  public np_name: string
  public dp_name: string
  public dp_desc: string
  public data_quantity: number
  public amount: number
  public amount_formatted: string
  public status: string
  public status_badge: string


  prepareData(): MerchantPriceConfig {
    this.status_badge = merchant_price_config_status(this.status)
    this.amount_formatted = formatKobo(this.amount)
    return this
  }
}
