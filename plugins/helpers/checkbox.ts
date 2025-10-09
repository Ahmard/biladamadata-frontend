import {CheckBox} from "~/types/html";

export function checkbox(data: CheckBox): void {
  const divCustomControl = document.createElement('div')
  const input = document.createElement('input')
  const label = document.createElement('label')

  divCustomControl.classList.add('custom-control', 'custom-checkbox')

  input.type = 'checkbox'
  input.id = `customCheck-${data.id}`
  input.value = data.id
  input.classList.add('custom-control-input')

  label.classList.add('custom-control-label')
  label.htmlFor = `customCheck-${data.id}`
  label.innerHTML = data.html

  divCustomControl.append(input, label)
  input.onchange = (e) => {
    data?.onChange ? data?.onChange(e) : null;

    // @ts-ignore
    if (e.target.checked) {
      // @ts-ignore
      data?.onCheck(e.target.value)
    } else {
      // @ts-ignore
      data?.onUncheck(e.target.value)
    }
  }

  const td = $(data.row).find('td:first-child')
    .html(divCustomControl)

  // @ts-ignore
  td.get(0).dataset.hasCheckbox = 'true'
  data.row.dataset.hasCheckbox = 'true'
}
