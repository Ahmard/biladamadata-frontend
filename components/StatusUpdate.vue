<template>
  <div class="components-preview wide-xl mx-auto">
    <div class="nk-block-head nk-block-head-lg wide-sm">
      <div class="nk-block-head-content">
        <div class="nk-block-head-sub" v-if="backLinkUrl">
          <NuxtLink class="back-to" :to="backLinkUrl">
            <em class="icon ni ni-arrow-left"></em><span>{{ backLinkText }}</span>
          </NuxtLink>
        </div>
        <h2 class="nk-block-title fw-normal">{{ title }} {{ item }}</h2>
      </div>
    </div><!-- .nk-block-head -->
    <div class="nk-block nk-block-lg">
    </div>
    <div class="row">
      <div class="col-md-7">
        <card>
          <CardHeader>
            <template v-slot:title>{{ title }} {{ item }}</template>
          </CardHeader>
          <card-body class="mt-2">
            <form action="" @submit.prevent="submitForm">
              <label class="form-label text-muted" for="title">
                Why are you {{ acting }} this <span class="text-lowercase">{{ item }}</span>?
              </label>
              <div class="form-control-wrap">
                <div class="form-icon form-icon-left">
                  <em class="icon ni ni-text"></em>
                </div>
                <textarea v-model="form.reason" name="name" type="text" class="form-control" id="name"
                          :placeholder="`${action_titled} reason`"
                          required
                          :readonly="submitting"
                          :disabled="submitting"></textarea>
              </div>

              <div class="mt-1 text-end">
                <Button
                  size="md"
                  color="primary"
                  :loading="submitting"
                  :loading-message="action_titled"
                >{{ actionButtonText}}</Button>
              </div>
            </form>
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script>

import Swal from "sweetalert2";
import {redirect} from "~/plugins/helpers/misc";
import _ from "lodash";

export default {
  name: "StatusUpdate",
  props: {
    item: {default: null},
    title: {default: null},
    itemId: {default: null},
    action: {default: null},
    acting: {default: null},
    endpoint: {default: null},
    backLinkUrl: {default: null},
    backLinkText: {default: null},
    actionButtonText: {default: ''}
  },
  data() {
    return {
      submitting: false,
      action_titled: '',
      form: {
        reason: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.submitting = true
      this.xhrPatch(this.endpoint, this.form)
        .then(() => {
          Swal.fire({
            title: this.item,
            html: `${this.item} account has been ${this.action}d`,
            icon: 'success'
          }).then(() => redirect(this.backLinkUrl))

          this.$emit('completed', true)
        })
        .finally(() => this.submitting = false)
    }
  },
  mounted() {
    this.action_titled = _.upperFirst(this.action)
  }
}
</script>

<style scoped>

</style>
