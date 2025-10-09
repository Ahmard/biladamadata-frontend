<template>
  <div>
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <card>
          <template #head>
            <card-header>
              <template #title>Data Plan Category</template>
              <template #desc>Create Data Plan Category</template>
            </card-header>
          </template>
          <card-body>
            <form @submit.prevent="save">
              <div class="row mt-1">
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label text-muted" for="name">Name</label>
                    <input name="dpc_name" id="name" v-model="form.name" class="form-control" placeholder="Plan Name"
                           type="text"/>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label text-muted" for="desc">Description</label>
                    <textarea id="desc" v-model="form.desc" class="form-control" cols="30" name="desc" placeholder="Plan Description"
                              rows="3"></textarea>
                  </div>
                </div>
              </div>
              <div class="text-end">
                <Button
                  :loading="loading"
                  color="primary"
                  loading-message="Submitting"
                >Submit
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
import {cloneFormData, formatInputValue} from "@/plugins/helpers/form";
import {apiAdminUrl, apiUrl} from "@/plugins/helpers/misc";
import Swal from "sweetalert2";
import {DataPlan} from "~/plugins/models/data.plan";

export default {
  name: "UpdateDataPrice",
  middleware: ['isAdmin'],
  head: {
    title: 'Update Data Price'
  },
  data() {
    return {
      loader: null,
      isFetching: true,
      dpcId: null,
      breadcrumbs: [
        {
          name: 'Data Plan Categories',
          url: '/admin/data-plans'
        },
      ],
      form: {
        name: '',
        desc: '',
      }
    }
  },
  methods: {
    apiAdminUrl,
    save() {
      this.loading = true
      const payload = cloneFormData(this.form);

      this.xhrPost(apiAdminUrl('data-plan-categories'), payload)
        .then(resp => {
          Swal.fire({
            title: 'Data Plan Category',
            html: 'Data plan category created successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/admin/data-plan-categories/${resp.data.data['dpc_id']}`)
          })
        })
        .catch(() => this.loading = false)
    },
  },
}
</script>

<style scoped>

</style>
