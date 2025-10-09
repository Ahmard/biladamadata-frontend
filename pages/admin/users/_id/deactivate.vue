<template>
  <div class="components-preview wide-xl mx-auto">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-7">
        <div class="card card-bordered card-preview">
          <CardHeader :loading="!user.id" loading-message="fetching user information...">
            <template v-slot:title>
              Deactivate user:
              <span v-if="user.id" class="text-primary">{{ user['full_name'] }} </span>
            </template>
          </CardHeader>
          <card-body>
            <form action="" @submit.prevent="deactivate">
              <label class="form-label text-muted" for="title">Why are you activating this user?</label>
              <div class="form-control-wrap">
                <div class="form-icon form-icon-left">
                  <em class="icon ni ni-text"></em>
                </div>
                <textarea id="name" v-model="form.reason" :disabled="!user.id" :readonly="submitting" class="form-control"
                          name="name"
                          placeholder="Deactivation reason"
                          required
                          type="text"></textarea>
              </div>

              <div class="mt-1 text-end">
                <Button
                  :disabled="!user.id"
                  :loading="submitting"
                  color="primary"
                  loading-message="Activating"
                  size="md"
                >Deactivate User
                </Button>
              </div>
            </form>
          </card-body>
        </div>
      </div>
    </div><!-- .card-preview -->
  </div> <!-- nk-block -->
</template>

<script>
import Vue from 'vue'
import {apiAdminUrl, redirect} from "~/plugins/helpers/misc";
import Swal from "sweetalert2";

export default Vue.extend({
  name: 'AdminUserDeactivate',
  middleware: ['isAdmin'],
  // meta: {
  //   auth: { permission: 'user_deactivate' }
  // },
  head() {
    return {
      title: 'User: Deactivate'
    }
  },
  data() {
    return {
      submitting: false,
      user: {id: 0},
      userId: 0,
      types: [],
      breadcrumbs: [],
      form: {
        reason: '',
      }
    }
  },
  methods: {
    deactivate() {
      this.submitting = true
      this.xhrPatch(apiAdminUrl(`users/${this.userId}/deactivate`), this.form)
        .then(() => {
          Swal.fire({
            title: 'User',
            html: 'User account has been deactivated',
            icon: 'success'
          }).then(() => redirect(`/admin/users/${this.userId}`))
        })
        .finally(() => this.submitting = false)
    }
  },
  mounted() {
    this.userId = this.$route.params.id

    this.xhrGet(apiAdminUrl(`users/${this.userId}`)).then(resp => {
      this.user = resp.data.data
    })

    this.breadcrumbs = [
      {
        name: 'Users',
        url: '/admin/users'
      },
      {
        name: 'User Info',
        url: `/admin/users/${this.userId}`
      },
      {
        name: 'Deactivate',
      },
    ];
  }
})
</script>
