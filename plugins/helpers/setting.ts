import {HtmlEvent} from "~/types/html.event";

export function getEditElement(e: HtmlEvent) {
  return e.currentTarget.querySelectorAll('a.edit');
}

export function hideActionButton(e: HtmlEvent) {
  const editEls = getEditElement(e)
  if (editEls) {
    editEls.forEach(editEl => {
      editEl.classList.remove('d-block')
      editEl.classList.add('d-none')
    })
  }
}

export function showActionButton(e: HtmlEvent) {
  const editEls = getEditElement(e)
  if (editEls) {
    editEls.forEach(editEl => {
      editEl.classList.remove('d-none')
      editEl.classList.add('d-block')
    })
  }
}
