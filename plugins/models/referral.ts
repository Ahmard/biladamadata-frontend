import BaseModel from "./base.model";
import {referral_status} from "~/plugins/status/referral_status";
import {formatKobo} from "~/plugins/helpers/misc";
import {fullNameAlt} from "~/plugins/helpers/user";

export class Referral extends BaseModel {
  public referral_id: number
  public beneficiary_type: string
  public type: string
  public bonus_amount: number
  public bonus_amount_formatted: string
  public creator_full_name: string
  public status: string
  public status_badge: string

  displayableType(): string {
    return this.type.replaceAll('_', ' ').toUpperCase()
  }

  prepareData(): Referral {
    this.creator_full_name = fullNameAlt(this, 'creator');
    this.status_badge = referral_status(this.status);
    this.bonus_amount_formatted = formatKobo(this.bonus_amount);
    return this;
  }

  statusBadge() {
    return referral_status(this.status)
  }
}
