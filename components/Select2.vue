<template>
  <div class="form-group">
    <div class="d-flex justify-content-between">
      <label style="padding-top: 5px" :for="`custom-select2-${id}`"
             :class="`form-label ${isLabelMuted ? 'text-muted' : ''} mb-0`">
        <slot name="label">{{ label }}</slot>
      </label>
      <slot name="label-desc"></slot>
    </div>
    <select
      class="form-select table-status-filter"
      :name="name"
      :id="`custom-select2-${id}`"
      :disabled="disabled"
      :multiple="multiple"
      :class="className"
      :required="isFieldRequired"
    >
      <option v-if="theSelected" :value="theSelected[0]" selected="selected">{{ theSelected[1] }}</option>
      <option v-for="item in theItems" :value="item.id ?? item.value" :selected="item['default'] ?? false">
        {{ item.text ?? item.name }}
      </option>
    </select>
  </div>
</template>

<script>
import {destroySelect2, initSelect2} from "~/plugins/helpers/select2";
import 'select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css'

require('select2')
require('select2/dist/css/select2.min.css')

export default {
  name: "Select2",
  props: [
    'value',
    'name', 'id', 'label', 'placeholder',
    'disabled', 'url', 'selected', 'multiple',
    'items', 'className', 'mutedLabel', 'required',
  ],
  watch: {
    url() {
      console.log(`Url changed, Re-Initializing select2 ${this.select2Selector}...`)
      destroySelect2(this.select2Selector)
      this.init(this.url);
    },
    items() {
      console.log(`List changed, Re-Initializing select2 ${this.select2Selector}...`)
      setTimeout(() => this.init(this.url), 50);
    },
    selected() {
      console.log(`Default item changed, Re-Initializing select2 ${this.select2Selector}...`)
      setTimeout(() => this.init(this.url), 50);
    },
    required(val) {
      this.isFieldRequired = val
    },
  },
  data() {
    return {
      isFieldRequired: true,
      isLabelMuted: true,
      theSelected: null,
      theItems: [],
      select2Selector: '',
      chosenData: '',
      options: [],
      isLoading: false,
    }
  },
  methods: {
    init(url) {
      this.normaliseOptions();
      this.theSelected = this.normaliseSelectedItems(this.selected)

      initSelect2(this.select2Selector, {
        url,
        placeholder: this.placeholder ?? this.label,
        destroyAlreadyCreatedSelect: false,
        onSelect: (e, value) => {
          if (value) {
            this.emitChangeEvent(value)
          }
        },
        onInit: ($select) => {
          if (!this.theSelected) {
            $select.val(null).trigger('change');
          }

          if (Array.isArray(this.theSelected) && this.theSelected.length && this.theSelected[0]) {
            this.emitChangeEvent(this.theSelected[0])
          }
        }
      })
    },
    normaliseOptions() {
      if (this.items) {
        const items = [];
        this.items.forEach(item => {
          if (typeof item !== 'object' && item !== null) {
            items.push({
              text: item,
              id: item
            })
          } else {
            items.push(item)
          }
        })

        this.theItems = items;
      }
    },
    normaliseSelectedItems(items) {
      let selected = items

      if (!selected && this.value) {
        if ((Array.isArray(this.value) && this.value.length)) {
          selected = this.value
        }
      }

      if (typeof selected === 'string' && selected.length) {
        selected = [selected, selected];
      }

      if (Array.isArray(items) && !items.length) {
        selected = null
      }

      if (null !== selected && typeof selected === 'object' && selected.hasOwnProperty('id')) {
        selected = [
          selected.id,
          selected.text,
        ]
      }

      return selected
    },
    emitChangeEvent(value) {
      this.$emit('select', value)
      this.$emit('input', value)
    }
  },
  mounted() {
    this.select2Selector = `select#custom-select2-${this.id}`;
    this.isFieldRequired = this.required === undefined
    this.isLabelMuted = undefined === this.mutedLabel ? true : this.mutedLabel

    this.init(this.url);
  }
}
</script>

<style scoped>

</style>
