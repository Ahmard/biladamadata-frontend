<template>
  <div>
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <card>
          <template #head>
            <card-header :loading="isFetching">
              <template #title>Data Plan Category</template>
              <template #desc>Update Data Plan Category</template>
            </card-header>
          </template>
          <card-body>
            <form @submit.prevent="save">
              <div class="row mt-1">
                <div class="col-md">
                  <div class="mb-3">
                    <label class="form-label text-muted" for="name">Name</label>
                    <input id="name" v-model="form.name" class="form-control" placeholder="Plan Name"
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
                  loading-message="Updating"
                >Update DPC
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
  watch: {
    'form.amount': function (amount) {
      this.form.amount = formatInputValue(amount)
    }
  },
  data() {
    return {
      loader: null,
      loading: false,
      isFetching: true,
      networkProviderId: '',
      dpcId: null,
      breadcrumbs: [],
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

      this.xhrPut(apiAdminUrl(`data-plan-categories/${this.dpcId}`), payload)
        .then(resp => {
          Swal.fire({
            title: 'Data Plan Category',
            html: 'Data plan category updated successfully',
            icon: 'success'
          }).then(() => {
            this.$router.push(`/admin/data-plan-categories/${this.dpcId}`)
          })
        })
        .catch(() => this.loading = false)
    },
  },
  mounted() {
    this.dpcId = this.$route.params.id

    this.breadcrumbs = [
      {
        name: 'Data Plan Categories',
        url: '/admin/data-plans'
      },
      {
        name: 'DPC Info',
        url: `/admin/data-plan-categories/${this.dpcId}`
      },
      {
        name: 'Update Info'
      }
    ];

    this.xhrGet(apiAdminUrl(`data-plan-categories/${this.dpcId}`))
      .then(resp => {
        const plan = DataPlan.fromData(resp.data.data).prepareData()
        this.form = {
          name: plan.dpc_name,
          desc: plan.dpc_desc,
        }
      })
      .finally(() => this.isFetching = false)
  }
}
</script>

<style scoped>

</style>
