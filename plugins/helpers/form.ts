import {LooseObject} from "~/types/loose.object";
import {HtmlEvent} from "~/types/html.event";

export function formatNumber(number: string): string {
  let formatted = parseInt(number).toLocaleString();

  if ('NaN' === formatted.toString()) {
    return ''
  }

  return formatted
}

export function removeCommas(strNumber: string): Number {
  return parseInt(strNumber ? strNumber.replaceAll(',', '') : '0')
}

export function formatInputValue(number: string): string {
  if (!number || !number.length) return ''
  return formatNumber(removeCommas(number).toString())
}

export function numberOnly(input: string): string {
  return input.replace(/\D/g, '');
}

export function cloneFormData<D = LooseObject>(data: D): D {
  const d = Object.assign({}, data);

  for (const dKey in d) {
    // @ts-ignore
    if (0 !== d[dKey] && !d[dKey] && false !== d[dKey]) {
      delete d[dKey];
    }
  }
  return d;
}

export function formDataFrom(object: LooseObject) {
  const formData = new FormData();

  for (const objectKey in object) {
    const value = object[objectKey]

    if (!value || (typeof value == 'string' && !value.length)) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach(val => formData.append(`${objectKey}[]`, val))
    } else {
      formData.append(objectKey, value)
    }
  }

  return formData
}

export function clearFormData<D = LooseObject>(data: D): D {
  for (const dataKey in data) {
    const content = data[dataKey]

    if (Array.isArray(content)) {
      // @ts-ignore
      data[dataKey] = []
    } else {
      // @ts-ignore
      data[dataKey] = null
    }
  }

  return data
}
