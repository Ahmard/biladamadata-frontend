<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <card class="mb-4">
          <card-header>
            <template v-slot:title>
              <span class="text-uppercase">Send Mail Message</span>
            </template>
            <template v-slot:desc>Send mail to user or group users</template>
          </card-header>
          <card-body>
            <form class="mt-3" @submit.prevent="submitForm">
              <v-select
                v-model="form.receiver_type"
                :items="receiver_types"
                append-icon=""
                dense
                item-text="text"
                item-value="id"
                label="Receiver Type"
                outlined
              ></v-select>

              <div v-if="'custom' === form.receiver_type">
                <v-combobox
                  v-model="form.receivers"
                  append-icon=""
                  dense
                  hide-selected
                  label="Email Addresses"
                  multiple
                  outlined
                  persistent-hint
                  small-chips
                ></v-combobox>
              </div>

              <div v-if="'individual' === form.receiver_type" style="margin-top: -20px">
                <Select2
                  id="receiver"
                  v-model="form.receivers"
                  :multiple="true"
                  :url="endpoint_users"
                  class="mb-3"
                  label="Receiver"
                  name="receiver"
                  placeholder="Choose Receiver"
                />
              </div>

              <div class="mb-3">
                <v-text-field
                  v-model="form.subject"
                  dense
                  hide-details="auto"
                  label="Subject"
                  outlined
                ></v-text-field>
              </div>

              <div class="mb-3">
                <Tinymce
                  v-model="form.message"
                  label="Message"
                  placeholder="Mail message here..."
                />
              </div>

              <div class="text-end">
                <Button
                  :loading="submitting"
                  color="primary"
                  loading-message="Sending Mails(s)..."
                  type="submit"
                >
                  <i class="bx bx-mail-send"></i> Send Mail(s)
                </Button>
              </div>
            </form>

          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import {apiAdminUrl, redirect, startWorking, stopWorking} from "~/plugins/helpers/misc";
import Swal from "sweetalert2";
import {clearFormData, formDataFrom} from "~/plugins/helpers/form";

export default {
  name: "send",
  watch: {
    'form.receiver_type': function () {
      this.form.receivers = null
    }
  },
  data() {
    return {
      submitting: false,
      endpoint_users: apiAdminUrl('users', {id_column: 'email'}),
      form: {
        receiver_type: null,
        subject: null,
        message: null,
        receivers: null,
      },
      receiver_types: [
        {id: 'all', text: 'All'},
        {id: 'custom', text: 'Custom'},
        {id: 'individual', text: 'Individual'},
        {id: 'merchant', text: 'Merchants'},
        {id: 'reseller', text: 'Resellers'}
      ],
      breadcrumbs: [
        {
          name: 'Mailing',
          url: '/admin/mailing'
        },
        {
          name: 'Send Mail',
        },
      ],
    }
  },
  methods: {
    submitForm() {
      this.submitting = true
      startWorking('Sending')

      this.xhrPost(apiAdminUrl('mailing'), formDataFrom(this.form))
        .then(resp => {
          Swal.fire({
            title: 'Mailing',
            text: resp.data.data.message,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#71a632',
            cancelButtonColor: '#089cc7',
            confirmButtonText: 'Okay',
            cancelButtonText: 'Send Again'
          }).then((result) => {
            if (result.isConfirmed) {
              redirect('/admin/mailing')
            } else {
              clearFormData(this.form)
              $('select').val('').trigger('change')
            }
          })
        })
        .finally(() => {
          this.submitting = false
          stopWorking()
        })
    }
  }
}
</script>

<style scoped>

</style>
