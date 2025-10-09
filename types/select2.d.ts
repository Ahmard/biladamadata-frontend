import {LooseObject} from "./loose.object";
import {jQuery} from "~/types/misc";
import {HtmlEvent} from "~/types/html.event";

export interface Select2 {
  url?: string,
  items?: SelectItem[]
  placeholder?: string,
  allowClear?: boolean
  destroyAlreadyCreatedSelect?: boolean
  processResults?: (data: LooseObject) => { results: LooseObject }
  onInit?: ($select: jQuery) => void,
  onChange?: (event: HtmlEvent) => void,
  onSelect?: (event: HtmlEvent, value: string) => void,
}

export interface SelectItem {
  name: string
  value: string
}
