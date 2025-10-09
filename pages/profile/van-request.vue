<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <form @submit.prevent="update">
        <div class="col-md-5">
          <div class="card">
            <card-header :loading="is_fetching">
              <template v-slot:title>
                <span class="text-uppercase">Virtual Account Number Request</span>
              </template>
            </card-header>
            <card-body v-if="!is_fetching" class="mt-3">
              <div class="row">
                <div class="col-md">
                  <label class="form-label" for="email">Reason</label>
                  <textarea
                    id="reason"
                    v-model="form.reason"
                    autofocus
                    class="form-control"
                    maxlength="100"
                    minlength="3"
                    name="reason"
                    placeholder="Why are you requesting this VAN?"
                    required
                    rows="3"
                    type="text"
                  ></textarea>
                </div>
              </div>

              <div class="my-3 d-flex justify-content-end">
                <Button
                  :loading="submitting"
                  class="fw-bold"
                  color="primary"
                  loading-message="Updating..."
                  size="md"
                  type="submit">Submit Request
                </Button>
              </div>
            </card-body>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {apiUrl, redirect, startWorking, stopWorking} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";

export default {
  name: "edit",
  middleware: ['isAuth'],
  head: {
    title: 'Update Profile'
  },
  data() {
    return {
      userId: null,
      submitting: false,
      is_fetching: false,
      breadcrumbs: [
        {
          name: 'Profile',
          url: '/profile'
        },
        {
          name: 'VAN Request',
        },
      ],
      form: {
        reason: '',
      }
    }
  },
  methods: {
    update() {
      startWorking('Updating')
      this.submitting = true
      this.xhrPost(apiUrl('profile/request-van'), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'Virtual Account Number',
            html: 'VAN request submitted successfully, we will get back to you shortly',
            icon: 'success'
          }).then(() => redirect('/profile'))
        })
        .finally(() => {
          this.submitting = false
          stopWorking()
        })
    },
  },
  async mounted() {
    this.is_fetching = false
  }
}
</script>

<style scoped>

</style>
