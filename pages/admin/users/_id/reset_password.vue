<template>
  <div class="components-preview mx-auto">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-5">
        <div class="card card-bordered">
          <CardHeader :loading="!user.id" loading-message="fetching user information...">
            <template v-slot:title>
              Reset user password:
              <span v-if="user.id" class="text-primary">{{ user['full_name'] }}</span>
            </template>
          </CardHeader>
          <card-body>
            <form action="#" @submit.prevent="submitForm">

              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label mb-0 text-muted" for="password">New Password</label>
                    <div class="form-control-wrap">
                      <div class="form-icon form-icon-left">
                        <em class="icon ni ni-lock-alt"></em>
                      </div>
                      <input id="password" v-model="form.password" class="form-control" placeholder=""
                             required type="password">
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label mb-0 text-muted" for="password_confirmation">Confirm Password</label>
                    <div class="form-control-wrap">
                      <div class="form-icon form-icon-left">
                        <em class="icon ni ni-lock-alt"></em>
                      </div>
                      <input id="password_confirmation" v-model="form.password_confirmation" class="form-control"
                             placeholder=""
                             required type="password">
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="text-end">
                    <button class="btn btn-primary text-white" type="submit">
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </card-body><!-- .components-preview -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Swal from "sweetalert2";
import {apiAdminUrl, redirect} from "~/plugins/helpers/misc";

export default Vue.extend({
  middleware: ['isAdmin'],
  name: 'AdminUserResetPassword',
  head() {
    return {
      title: "Reset Password"
    };
  },
  data() {
    return {
      userId: '',
      user: {id: 0},
      breadcrumbs: [],
      form: {
        password: '',
        password_confirmation: '',
      }
    }
  },
  methods: {
    submitForm() {
      this.xhrPost(apiAdminUrl(`users/${this.userId}/reset-password`), this.form).then(() => {
        Swal.fire({
          title: 'Password',
          html: 'Password reset successfully',
          icon: 'success',
        }).then(() => {
          redirect('../')
        })
      })
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
