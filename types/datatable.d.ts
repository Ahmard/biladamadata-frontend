import {DropdownItem} from "./dropdown.item";
import {LooseObject} from "./loose.object";
import {HtmlEvent} from "~/types/html.event";
import {Config} from "datatables.net-bs5";
import {Table} from "~/plugins/helpers/datatable";

// @ts-ignore
export interface Datatable extends Config {
  url?: string
  processing?: boolean
  responsiveExpander?: boolean
  serverSide?: boolean
  stateSave?: boolean
  export?: boolean
  pageLength?: number
  lengthMenu?: Array<number>
  buttons?: Array<string>
  ajax: DatatableAjaxData
  columns: Array<DatatableColumnData>
  columnDefs?: Array<DatatableColumnDefinition>
  language?: DatatableLanguage
  responsive?: DatatableResponsiveness
  dropdown?: Array<DropdownItem>
  checkbox?: DatatableCheckBox
  reInitTable?: DatatableReInitTable

  /**
   * Alter the final ajax payload before sending to server
   *
   * @param payload
   */
  requestPayloadHook?: (payload: LooseObject) => LooseObject

  createdRow?: (row: HTMLTableRowElement, data: LooseObject, index: number) => void
  onDraw?: (table: Table) => void
  onDrawn?: (table: Table) => void
  onRowClick?: (e: HtmlEvent, row: HTMLTableRowElement, data: LooseObject, index: number) => void
  onRowClickRedirect?: (data: LooseObject, e: HtmlEvent, row: HTMLTableRowElement, index: number) => string
  onInit?: (table: Table) => void
}

export interface DatatableAjaxData {
  url: string | DatatableAjaxData,
  data: LooseObject,
  headers: LooseObject
}

export interface DatatableLanguage {
  processing: string
}

export interface DatatableResponsiveness {
  details: boolean
}

export interface DatatableReInitTable {
  onFilterChange: boolean
  onInit?: (table: Table, data: LooseObject) => void
  onEvent?: DatatableOnEvent
}

export interface DatatableOnEvent {
  name: string
  selectors: DatatableOnEventSelectorItem[]
}

interface DatatableOnEventSelectorItem {
  [key: string]: string
}

export interface DatatableColumnData {
  data: string,
  name?: string
  showIfOnly?: () => boolean
}

export interface DatatableColumnDefinition {
  targets: number,

  responsivePriority?: number,
  showIfOnly?: () => boolean
  render: (tableData: LooseObject, type: string, rowData: LooseObject) => void
}

export interface DatatableCheckBox {
  id: string
  showIf?: DatatableCheckboxConditionObject
  onChange: (e: Event) => void
  onCheck?: (value: string | number) => void
  onUncheck?: (value: string | number) => void
  onDataChange?: (values: string[] | number[]) => void
}

export interface DatatableCheckboxConditionObject {
  [key: string]: string
}

