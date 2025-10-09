import {DropdownItem} from "~/types/dropdown.item";
import {LooseObject} from "~/types/loose.object";
import _ from "lodash";
import {redirect} from "~/plugins/helpers/misc";

function validateCondition(conditions:LooseObject, item: DropdownItem, data: LooseObject): boolean {
  let isValid = false
  for (const showConditionKey in conditions) {
    isValid = _.get(data, showConditionKey) === conditions[showConditionKey]
    if (!isValid) return false;
  }

  return isValid;
}

export function dropdown(row: HTMLTableRowElement, items: DropdownItem[], data: LooseObject, index: number) {
  const listItems: HTMLLIElement[] = []

  items.forEach(item => {
    // Let's see if this dropdown can be showed
    if (item.showIfOnly && !item.showIfOnly(data, row, index)) return;

    if (item.showIf) {
      if (!validateCondition(item.showIf, item, data)) return;
    }

    if (item.showIfAny) {
      let willShow = false;

      for (let i = 0; i < item.showIfAny.length; i++) {
        if (validateCondition(item.showIfAny[i], item, data)) {
          willShow = true
          break;
        }
      }

      if (!willShow) return;
    }

    const li = document.createElement('li')
    const a = document.createElement('a')
    const i = document.createElement('i')
    const span = document.createElement('span')

    a.href = '#';
    a.classList.add('dropdown-item');

    i.classList.add('me-1')
    i.classList.add('bx')
    i.classList.add('bx-' + item.icon)

    span.innerHTML = item.html

    a.onclick = (e) => {
      e.preventDefault()

      if (item.onClick) {
        // @ts-ignore
        item.onClick(data, e, row, index)
      }

      if (item.href) {
        // @ts-ignore
        redirect(item.href(data, e, row, index));
      }
    }

    a.appendChild(i)
    a.appendChild(span)
    li.appendChild(a)

    listItems.push(li)
  })

  const $dropdown = $(`
      <div class="dropdown">
          <a href="#" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></a>
          <div class="dropdown-menu"></div>
      </div>
    `)

  const $ul = $dropdown.find('div.dropdown-menu')
  listItems.forEach(listItem => $ul.append(listItem))

  // @ts-ignore
  $(row).find('td:last-child').html($dropdown)
}
