import BaseModel from "~/plugins/models/base.model";
import {user_bvn_status} from "~/plugins/status/user_bvn_status";

export class UserBankVerificationNumber extends BaseModel {
  public user_bvn_id: number;
  public user_id: number;
  public approved_by: number;
  public bvn: number;
  public status: string;
  public status_badge: string;

  prepareData(): UserBankVerificationNumber {
    this.status_badge = user_bvn_status(this.status)
    return this
  }
}
