import {Select2} from "~/types/select2";
import {LooseObject} from "~/types/loose.object";
import {HtmlEvent} from "~/types/html.event";
import {authToken, loadCachedScript} from "~/plugins/helpers/misc";

export function initSelect2(selector: string | HTMLSelectElement, settings: Select2) {
  settings.destroyAlreadyCreatedSelect = settings.destroyAlreadyCreatedSelect ?? true

  $(async () => {
    // Destroy previously created select2
    if (settings.destroyAlreadyCreatedSelect) {
      // @ts-ignore
      destroySelect2(selector)
    }

    const config: Select2Config = Object.assign(settings)
    config.theme = 'bootstrap-5';

    config.placeholder = settings.placeholder ?? 'Choose'
    config.allowClear = config.allowClear ?? true;

    if (settings.url) {
      config.ajax = {
        processResults: function (data: LooseObject) {
          if (settings.processResults) {
            return settings.processResults(data);
          }

          return data;
        },
        delay: 250,
        url: settings.url,
        headers: {
          Authorization: authToken(),
          'Auth-Token': authToken(),
        },
        data(params: any) {
          params.q = params.term
          params.purpose = 'form_select'
          return params
        },
      }
    }

    // @ts-ignore
    if (typeof $().select2 === "undefined") {
      await loadCachedScript('/assets/js/select2.min.js')
    }

    // @ts-ignore
    const $select = $(selector).select2(config)

    if (settings?.onInit) {
      settings.onInit($select)
    }

    if (settings.onChange) {
      $select.off('change').on('change', settings.onChange);
    }

    const eventHandler = (e: HtmlEvent) => {
      // @ts-ignore
      settings.onSelect(e, $select.val())
    };

    if (settings.onSelect) {
      $select.off('select2:select').on('select2:select', eventHandler);
      $select.off('select2:unselect').on('select2:unselect', eventHandler);
    }
  })
}

export function destroySelect2(selector: string) {
  const $select = $(selector)
  if ($select.data('select2')) {
    // @ts-ignore
    $select.select2('destroy').off('select2:select').off('change')
  }
}

interface Select2Config extends Select2 {
  placeholder: string,
  ajax: LooseObject
  theme?: string
}
