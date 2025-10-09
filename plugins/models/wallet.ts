import BaseModel from "~/plugins/models/base.model";
import {formatKobo, formatMoneyAmount} from "~/plugins/helpers/misc";
import {walle_status} from "~/plugins/status/walle_status";

export class Wallet extends BaseModel {
  public wallet_id: number
  public owner_id: number
  public amount: number
  public amount_formatted: string
  public status: string

  formattedAmount(): string {
    return formatMoneyAmount(this.amount)
  }

  prepareData(): Wallet {
    this.amount_formatted = formatKobo(this.amount)
    this.status = walle_status(this.status)
    return this
  }
}
