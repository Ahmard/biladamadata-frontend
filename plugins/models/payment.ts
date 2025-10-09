import BaseModel, {StaticObjectCreator} from "~/plugins/models/base.model";
import {decodeHtml, formatKobo, fromKobo, toKobo} from "~/plugins/helpers/misc";
import {payment_status} from "~/plugins/status/payment_status";
import {badge, nuxtLink} from "~/plugins/helpers/html";
import {ucWords} from "~/plugins/helpers/str";
import {AppSetting} from "~/types/app.setting";

export class Payment extends BaseModel {
  payer_id: number
  amount: number
  charges: number
  paid_amount: number
  purpose: string
  computed_amount: number
  formatted_purpose: string
  full_name: string
  payer_view_page: string
  formatted_amount: string
  formatted_charges: string
  formatted_paid_amount: string
  formatted_computed_amount: string
  additional_data?: any[]
  payment_id: number
  reference: string
  local_reference: string
  payment_url: string
  is_link_clicked: boolean
  is_manual_capture: boolean
  id_direct_transfer: boolean
  direct_transfer_formatted: string
  init_response: PaystackInitResponse
  status: string
  status_badge: string

  constructor() {
    super();
  }

  public static calculatePrice(settings: AppSetting, amount: number): PriceComputationResult {
    if (settings.payment_gateway === 'paystack') {
      return this.calculatePaystackPrice(amount)
    }

    if (settings.payment_gateway === 'moniepoint') {
      return this.calculateMoniepointPrice(settings, amount)
    }

    return this.calculateSquadPrice(amount)
  }

  private static calculateSquadPrice(amount: number): PriceComputationResult {
    let charges = (amount / 100) + 5;

    return {
      charges: toKobo(charges),
      beneficial: toKobo(amount - charges)
    }
  }

  private static calculatePaystackPrice(amount: number): PriceComputationResult {
    let charges = 50;

    if (amount >= 2500) {
      charges = ((amount / 100) * 1.5) + 110
    }

    if (charges > 2000) {
      charges = 2000
    }

    return {
      charges: toKobo(charges),
      beneficial: toKobo(amount - charges)
    }
  }

  private static calculateMoniepointPrice(settings: AppSetting, amount: number): PriceComputationResult {
    let price = amount * (fromKobo(settings.moniepoint_transfer_charges) / 100)
    let vat = price * fromKobo(settings.moniepoint_vat)
    let charges = price + vat;

    return {
      charges: toKobo(charges),
      beneficial: toKobo(amount - charges)
    }
  }

  prepareData(isAdmin = false): Payment {
    this.formatted_amount = formatKobo(this.amount)
    this.formatted_paid_amount = formatKobo(this.paid_amount);
    this.formatted_charges = formatKobo(this.charges);
    this.formatted_computed_amount = formatKobo(this.computed_amount);

    this.payer_view_page = nuxtLink(`${isAdmin ? 'admin/' : ''}users/${this.payer_id}`, this.full_name, '')

    if (this.init_response) {
      // @ts-ignore
      this.init_response = PaystackInitResponse.fromData(JSON.parse(decodeHtml(this.init_response)))
      // @ts-ignore
      this.init_response.data = PaystackInitResponseData.fromData(this.init_response.data)
    }

    this.status_badge = payment_status(this.status)

    const purpose = ucWords(this.purpose.replaceAll('_', ' '))
    this.formatted_purpose = this.purpose === 'wallet_funding'
      ? `<span class="text-secondary">${purpose}</span>`
      : `<span class="text-gray">${purpose}</span>`

    this.direct_transfer_formatted = this.is_direct_transfer
      ? badge('primary-dim text-primary', 'Yes')
      : badge('info-dim text-info', 'No')

    return this;
  }
}

export interface PriceComputationResult {
  charges: number,
  beneficial: number
}

class PaystackInitResponse extends StaticObjectCreator {
  status: boolean
  message: string
  data: PaystackInitResponseData
}

class PaystackInitResponseData extends StaticObjectCreator {
  authorization_url: string
  access_code: string
  reference: string
}
