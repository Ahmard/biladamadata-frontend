<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <form @submit.prevent="update">
        <div class="col-md-5">
          <div class="card">
            <card-header :loading="is_fetching">
              <template #title>
                <span class="text-uppercase">Change Your Username</span>
              </template>
            </card-header>
            <card-body v-if="!is_fetching" class="mt-3">

              <div class="row">
                <div class="col-md">
                  <div class="text-warning mb-3">
                    <i class="bx bx-sun"></i>
                    Valid username can only contain these characters <b>a-z</b>, <b>0-9</b>, <b>. _</b>
                  </div>
                  <div class="d-flex justify-content-between mb-0">
                    <label class="form-label mb-0" for="username">Username</label>
                    <label ref="availability" class="form-label mb-0" for="username">{{ availability_message }}</label>
                  </div>
                  <input
                    id="username"
                    v-model="form.username"
                    autocomplete="off"
                    autofocus
                    class="form-control form-control-lg"
                    maxlength="100"
                    minlength="3"
                    name="bvn_number"
                    pattern="^[A-Za-z0-9_.]+$"
                    placeholder="Enter your bvn number"
                    required
                    type="text"
                    @input="checkAvailability"
                  />
                </div>
              </div>

              <div class="my-2 d-flex justify-content-end">
                <Button
                  :disabled="submitting || !is_available"
                  :loading="submitting"
                  class="fw-bold"
                  color="primary"
                  loading-message="Changing..."
                  size="md"
                  type="submit">Change Username
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
import Alert from "~/plugins/helpers/alert";

export default {
  name: "edit",
  middleware: ['isAuth'],
  head: {
    title: 'Username: Change'
  },
  data() {
    return {
      userId: null,
      submitting: false,
      is_fetching: false,
      is_available: false,
      availability_message: '',
      current_username: '',
      breadcrumbs: [
        {
          name: 'Profile',
          url: '/profile'
        },
        {
          name: 'Change Username',
        },
      ],
      form: {
        username: '',
        reason: '',
      }
    }
  },
  methods: {
    update() {
      if (this.form.username.length < 3 || this.form.username === this.current_username) {
        return;
      }

      startWorking('Changing')
      this.submitting = true

      this.xhrPatch(apiUrl('profile/username-change'), this.form)
        .then(async resp => {
          Alert.success({
            title: 'Username',
            html: 'Username has been updated successfully',
            redirect_url: '/profile'
          })
        })
        .finally(() => {
          this.submitting = false
          stopWorking()
        })
    },

    checkAvailability() {
      this.$refs['availability'].classList.add('text-danger')
      this.availability_message = 'unavailable'

      if (this.form.username.length < 3 || this.form.username === this.current_username) {
        return;
      }

      this.xhrPost(apiUrl('profile/username-availability'), this.form)
        .then(async resp => {
          if (resp.data.data.available) {
            this.is_available = true
            this.availability_message = 'available'
            this.$refs['availability'].classList.remove('text-danger')
            this.$refs['availability'].classList.add('text-success')
          }

          if (!resp.data.data.available) {
            this.is_available = false
            this.availability_message = 'unavailable'
            this.$refs['availability'].classList.remove('text-success')
            this.$refs['availability'].classList.add('text-danger')
          }
        })
        .catch(() => {
          this.is_available = false
          this.availability_message = ''
        })
    }
  },
  async mounted() {
    const user = (await this.$auth.fetchUser()).data;

    if (!user) {
      await redirect('/')
    }

    this.form.username = user.username['displayable']
    this.current_username = user.username['displayable']
    this.is_fetching = false

    this.checkAvailability()
  }
}
</script>

<style scoped>

</style>
