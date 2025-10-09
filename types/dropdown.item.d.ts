import {HtmlEvent} from "~/types/html.event";
import {LooseObject} from "~/types/loose.object";

export interface DropdownItem {
  html: string
  icon: string
  showIf?: DatatableDropdownItemConditionObject
  showIfAny?: DatatableDropdownItemConditionObject[]
  onClick?: (data: LooseObject, e: HtmlEvent, row: HTMLTableRowElement, index: number) => void
  href?: (data: LooseObject, e: HtmlEvent, row: HTMLTableRowElement, index: number) => string
  showIfOnly?: (data: LooseObject, row: HTMLTableRowElement, index: number) => boolean
}

export interface DatatableDropdownItemConditionObject {
  [key: string]: string
}
