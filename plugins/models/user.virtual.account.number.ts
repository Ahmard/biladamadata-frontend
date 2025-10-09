import BaseModel from "~/plugins/models/base.model";
import {user_bvn_status} from "~/plugins/status/user_bvn_status";

export class UserVirtualAccountNumber extends BaseModel {
  public user_van_id: number;
  public user_id: number;
  public bank_name: string;
  public bank_code: string;
  public account_name: string;
  public account_number: string;
  public account_reference: string;
  public status: string;
  public status_badge: string;

  prepareData(): UserVirtualAccountNumber {
    this.status_badge = user_bvn_status(this.status)
    return this
  }
}
