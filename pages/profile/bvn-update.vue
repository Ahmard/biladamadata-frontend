<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <form @submit.prevent="update">
        <div class="col-md-5">
          <div class="card">
            <card-header :loading="is_fetching">
              <template v-slot:title>
                <span class="text-uppercase">Update Bank Verification Number</span>
              </template>
            </card-header>
            <card-body v-if="!is_fetching" class="mt-3">
              <div class="text-center">
                <img alt="BVN Logo" height="150" src="/assets/img/Central_Bank_of_Nigeria_logo.svg.png" width="130">
              </div>

              <div class="row mt-2">
                <div class="col-md">
                  <label class="form-label" for="bvn_number">BVN Number <span
                    class="ms-1 text-warning">(<i>11 Numbers</i>)</span></label>
                  <input
                    id="bvn_number"
                    v-model="form.bvn_number"
                    autocomplete="off"
                    autofocus
                    class="form-control"
                    maxlength="11"
                    minlength="11"
                    name="bvn_number"
                    placeholder="Enter your bvn number"
                    required
                    type="text"
                    @keyup="validateNumber"
                  />
                </div>
              </div>

              <div class="my-3 d-flex justify-content-end">
                <Button
                  :loading="submitting"
                  class="fw-bold"
                  color="primary"
                  loading-message="Updating..."
                  size="md"
                  type="submit">Update BVN
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
import {numberOnly} from "~/plugins/helpers/form";

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
          name: 'Update BVN',
        },
      ],
      form: {
        bvn_number: '',
      }
    }
  },
  methods: {
    validateNumber(input) {
      this.form.bvn_number = numberOnly(input.currentTarget.value)
    },
    update() {
      startWorking('Updating')
      this.submitting = true
      this.xhrPut(apiUrl('profile/update-bvn'), this.form)
        .then(async resp => {
          Swal.fire({
            title: 'Bank Verification Number',
            html: 'BVN updated successfully',
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
    const bvn = await this.xhrGet(apiUrl('profile/bvn'));
    this.is_fetching = false
  }
}
</script>

<style scoped>

</style>
