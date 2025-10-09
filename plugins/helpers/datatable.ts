import _ from "lodash";
import {Datatable, DatatableAjaxData} from "~/types/datatable";
import {LooseObject} from "~/types/loose.object";
import {
  authToken,
  captureCustomLinks,
  getPageQueries,
  loadCachedScript,
  nuxt,
  redirect,
  reinitializeDropdowns,
  windowLoaded
} from "./misc";
import {checkbox} from "./checkbox";
import {dropdown} from "~/plugins/helpers/dropdown";
import {Api, ApiAjax} from "datatables.net-bs5";

export class Table {
  public readonly ajax: TableAjax
  private readonly table: Api<any>

  constructor(datatable: Api<any>) {
    this.table = datatable
    this.ajax = new TableAjax(datatable.ajax)
  }

  on(event: string, callable: ((e: Event, ...args: any[]) => void)) {
    return this.table.on(event, callable);
  }

  one(event: string, callable: ((e: Event, ...args: any[]) => void)) {
    return this.table.one(event, callable);
  }

  off(event: string, callback?: ((e: Event, ...args: any[]) => void)) {
    return this.table.off(event, callback);
  }

  getTable() {
    return this.table
  }
}

class TableAjax {
  private readonly ajax: ApiAjax

  constructor(ajax: ApiAjax) {
    this.ajax = ajax
  }

  reload(resetPaging: boolean = false): Api<any> {
    return this.ajax.reload(() => null, resetPaging);
  }

  getAjax() {
    return this.ajax
  }
}

export function makeDatatableData(settings: Datatable): Datatable {
  return settings;
}

export function initDataTable(selector: string, dSettings: Datatable): Promise<Table> {
  return new Promise((resolve, reject) => {
    windowLoaded(async () => {
      let $table: Table;
      const ajax = dSettings.ajax;

      dSettings.processing = true;
      dSettings.serverSide = true;

      // Add bearer token
      const constructedAjaxData: DatatableAjaxData = {
        // @ts-ignore
        url: dSettings.ajax ?? dSettings.url,
        data: {filter: {}},
        headers: {
          // @ts-ignore
          Authorization: authToken(),
          'Auth-Token': authToken(),
        }
      }

      if ('object' === typeof ajax) {
        constructedAjaxData.url = ajax.url
        constructedAjaxData.data = ajax.data
      }

      dSettings.ajax = constructedAjaxData
      dSettings.lengthMenu = [5, 10, 15, 20, 30, 40, 50, 100];
      dSettings.stateSave = true

      // Export
      if (dSettings.hasOwnProperty('export') && dSettings.export) {
        // dSettings.dom = 'Blfrtip'
        dSettings.buttons = ['excel', 'pdf', 'print']
      } else {
        dSettings.export = false
      }

      if (!dSettings.hasOwnProperty('pageLength')) {
        dSettings.pageLength = 10
      }

      if (!dSettings.hasOwnProperty('responsiveExpander')) {
        dSettings.responsiveExpander = false
      }

      // Clickable row
      if (dSettings.hasOwnProperty('onRowClick') || dSettings.hasOwnProperty('onRowClickRedirect')) {
        const userCreatedRowCallback = dSettings.createdRow;

        dSettings.createdRow = function (tableRow, data, index) {
          if (userCreatedRowCallback) {
            userCreatedRowCallback(tableRow, data, index);
          }

          $(tableRow).on('click', (e) => {
            const isFirstChild = $(e.target).is(':first-child');

            if (('TD' === e.target.tagName && !isFirstChild) || dSettings.responsiveExpander) {
              let showFireEvent = true

              // Let's avoid triggering row click event if we have checkbox in first column
              if (dSettings?.checkbox) {
                const hasCheckBox = e.target.dataset.hasCheckbox
                showFireEvent = !hasCheckBox || hasCheckBox === 'false'
              }

              // onRowClick
              if (showFireEvent && dSettings.onRowClick) {
                // @ts-ignore
                dSettings.onRowClick(e, tableRow, data, index)
              }

              // onRowClickRedirect
              if (showFireEvent && dSettings.onRowClickRedirect) {
                // @ts-ignore
                redirect(dSettings.onRowClickRedirect(data, e, tableRow, index))
                return;
              }
            }
          })
        }
      }

      const selectedCheckboxItems: string[] | number[] = [];

      // Handle createdRow that is set from page/component
      const createdRow = dSettings.createdRow
      dSettings.createdRow = (row, data, index) => {
        if (createdRow) createdRow(row, data, index);

        // Dropdown in last column
        if (dSettings.hasOwnProperty('dropdown')) {
          // @ts-ignore
          dropdown(row, dSettings.dropdown, data, index)
        }

        // Checkbox in last column
        if (dSettings.hasOwnProperty('checkbox')) {
          const showCheckbox = () => {
            const fireDataChangeEvent = (): void => {
              if (dSettings.checkbox?.onDataChange) {
                dSettings.checkbox.onDataChange(selectedCheckboxItems)
              }
            }

            checkbox({
              row: row,
              // @ts-ignore
              id: data[dSettings.checkbox?.id],
              // @ts-ignore
              html: data[dSettings.checkbox?.id],
              onChange: (e: Event) => dSettings.checkbox?.onChange ? dSettings.checkbox?.onChange(e) : null,
              onCheck: (value) => {
                dSettings.checkbox?.onCheck ? dSettings.checkbox.onCheck(value) : null
                // @ts-ignore
                selectedCheckboxItems.push(value)
                // Fire change event
                fireDataChangeEvent();
              },
              onUncheck: (value) => {
                dSettings.checkbox?.onUncheck ? dSettings.checkbox.onUncheck(value) : null
                // @ts-ignore
                selectedCheckboxItems.splice(selectedCheckboxItems.indexOf(value))
                // Fire change event
                fireDataChangeEvent();
              },
            })
          };

          // Check if this checkbox will be shown conditionally
          const showCondition: LooseObject | undefined = dSettings?.checkbox?.showIf
          if (typeof showCondition === 'object') {
            let willShow = false
            for (const showConditionKey in showCondition) {
              willShow = _.get(data, 'status') === showCondition[showConditionKey]
            }

            if (willShow) {
              showCheckbox()
            }
          }

          // Checkbox will be shown without any condition
          if (undefined === showCondition) {
            showCheckbox()
          }

        }
      }

      // dSettings.language = {
      //   processing: `
      //       <div>
      //         <div class="spinner-border text-primary" role="status">
      //           <span class="visually-hidden">Loading...</span>
      //         </div>
      //         <div class="fw-bold">Fetching data...</div>
      //       </div>
      //     `
      // }

      const initTable = async (ajaxData: Object = {}): Promise<Table> => {
        if (dSettings.ajax && "data" in dSettings.ajax) {
          dSettings.ajax.data = Object.assign(dSettings.ajax.data ?? {}, ajaxData)
        }

        if (dSettings.requestPayloadHook) {
          dSettings.ajax.data = dSettings.requestPayloadHook(dSettings.ajax.data);
        }

        if (!dSettings.hasOwnProperty('responsive')) {
          dSettings.responsive = {details: true}
        }

        // Check conditional columns
        const columns = [];
        for (let i = 0; i < dSettings.columns.length; i++) {
          const column = dSettings.columns[i];

          if (column.showIfOnly && !column.showIfOnly()) {
            continue;
          }

          columns.push(column);
        }

        // Check conditional column definitions
        const columnDefs = [];
        if (dSettings.columnDefs) {
          for (let i = 0; i < dSettings.columnDefs.length; i++) {
            const def = dSettings.columnDefs[i];

            if (def.showIfOnly && !def.showIfOnly()) {
              continue;
            }

            columnDefs.push(def);
          }
        }

        const settings = Object.assign({}, dSettings);
        settings.columns = columns;
        settings.columnDefs = columnDefs

        // @ts-ignore
        if (typeof $().DataTable === "undefined") {
          console.log('DataTable lib is missing, fetching...')
          await loadCachedScript('/js/jquery.dataTables.min.js')
          await loadCachedScript('/js/dataTables.bootstrap5.min.js')
        }

        // @ts-ignore
        const $t = new Table($(selector).DataTable(settings))

        if ('function' === typeof settings?.reInitTable?.onInit) {
          settings.reInitTable.onInit($t, settings.ajax.data ?? {})
        }

        // @ts-ignore
        // const tableWidth = Math.round(($(selector).width() / 100) * 25);
        // $(`#${selector.split('#')[1]}_filter`)
        //   .css({marginLeft: `${tableWidth}px`})

        if (settings.onInit) {
          settings.onInit($t);
        }

        $t.off('draw').on('draw', () => {
          if (settings.onDraw) {
            settings.onDraw($t);
          }

          reinitializeDropdowns('datatable')

          if (dSettings.responsiveExpander) {
            setTimeout(() => $('td.dtr-control').removeClass('dtr-control'))
          }
        })

        return $t
      };

      const reInitTable = async ($table: Table, ajaxData: Object = {}): Promise<Table> => {
        $table.getTable().destroy()
        return await initTable(ajaxData)
      }

      // @ts-ignore
      const onDrawHandler = () => {
        // @ts-ignore
        captureCustomLinks(nuxt().$router);

        // TABLE FILTER CHANGE
        if (dSettings?.reInitTable?.onFilterChange === true) {
          $('.re-init-table').off('change').on('change', async () => {

            const filter: LooseObject = {};
            $('.re-init-table').each((index, element) => {
              // @ts-ignore
              filter[element.getAttribute('name')] = element.value
            })

            const data = {filter}

            if ('function' === typeof dSettings?.reInitTable?.onInit) {
              dSettings.reInitTable.onInit($table, data)
            }

            $table = await reInitTable($table, data)
          })
        }

        // Table reinitialization
        dSettings?.reInitTable?.onEvent?.selectors.forEach((selector: Object) => {
          const selectorString = Object.keys(selector)[0]
          const selectorReference = Object.values(selector)[0]

          const eventName = dSettings?.reInitTable?.onEvent?.name

          if (eventName) {
            $(selectorString).off(eventName).on(eventName, async (e) => {
              // @ts-ignore
              const value = e.currentTarget.value
              const ajaxData = _.set({}, selectorReference, value)
              $table = await reInitTable($table, ajaxData)
            })
          }
        })
      }

      setTimeout(async () => {
        const url_queries = getPageQueries();
        $table = await initTable({
          filter: {
            start_date: url_queries.start_date,
            end_date: url_queries.end_date,
            status: url_queries.status,
          }
        })

        $table.on('draw', onDrawHandler)
        resolve($table);
      }, 300)
    })
  });
}
