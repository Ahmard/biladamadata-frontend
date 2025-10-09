import BaseModel from "~/plugins/models/base.model";
import {apiUrl, nuxt} from "~/plugins/helpers/misc";

export class Notification extends BaseModel {
  public notification_id: number
  public receiver_id: number
  public title: string
  public content: string
  public url?: string

  static updateGlancedNotifications(ids: number[]) {
    if (ids.length) {
      nuxt().xhrPatch(apiUrl('notifications/glance'), {ids});
    }
  }
}
