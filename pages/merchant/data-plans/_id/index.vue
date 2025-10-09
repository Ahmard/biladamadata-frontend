<template>
  <div class="flex-grow-1 container-p-y">
    <Breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-5">
        <card>
          <card-header :loading="loading">
            <template #title>Data Plan Information</template>
          </card-header>
          <card-body>
            <div class="list-group list-group-flush">
              <div class="list-group-item">
                <b>Name:</b> {{ dataPlan['dp_name'] }}
              </div>
              <div class="list-group-item">
                <b>Network:</b>
                <span v-html="dataPlan['np_name']"></span>
              </div>
              <div class="list-group-item">
                <b>Description:</b> {{ dataPlan['dp_desc'] }}
              </div>
              <div class="list-group-item">
                <b>Data Quantity:</b> {{ dataPlan['data_quantity_formatted'] }}
              </div>
              <div class="list-group-item">
                <b>Plan Lifetime:</b> {{ dataPlan['expired_in'] }}<i>Days</i>
              </div>
            </div>
          </card-body>
        </card>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-md-12">
        <div class="card card-bordered card-preview">
          <CardHeader>
            <template v-slot:title>Price Configurations</template>
            <template v-slot:desc>
              <NuxtLink :to="`${dataPlanId}/configure`" class="btn btn-sm btn-primary fw-bold">
                <i class='bx bx-sync'></i> Configure Price
              </NuxtLink>
            </template>
          </CardHeader>
          <div class="mx-4 table-responsive table-responsive-md table-responsive-xl mt-2">
            <table id="users" class="table table-hover">
              <thead>
              <tr>
                <th>#ID</th>
                <th>#Plan ID</th>
                <th>Network Provider</th>
                <th>Plan Name</th>
                <th>Original Price</th>
                <th>Configured Price</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div><!-- .card-preview -->
      </div>
    </div>
  </div><!-- wrapper -->
</template>

<script>
import {apiMerchantUrl, formatKobo} from "~/plugins/helpers/misc";
import {initDataTable} from "~/plugins/helpers/datatable";
import Swal from "sweetalert2";
import {merchant_price_config_status} from "~/plugins/status/merchant_price_config_status";
import {MerchantPriceConfig} from "~/plugins/models/merchant.price.config";
import {DataPlan} from "~/plugins/models/data.plan";

export default {
  name: "MerchantPriceConfigs",
  middleware: ['isMerchant'],
  head: {
    title: 'Price Configurations'
  },
  data() {
    return {
      loading: true,
      $table: null,
      dataPlanId: '',
      dataPlan: '',
      breadcrumbs: [
        {
          name: 'Data Plans',
          url: '/merchant/data-plans'
        },
        {
          name: 'Price Configurations',
        },
      ],
      filterStatuses: [
        {name: 'All', value: 'all'},
        {name: 'Paid', value: 'paid'},
        {name: 'Approved', value: 'approved'},
        {name: 'Pending Approval', value: 'forwarded'},
        {name: 'Rejected', value: 'rejected'},
      ],
    }
  },
  mounted() {
    this.dataPlanId = this.$route.params.id
    this.xhrGet(apiMerchantUrl(`data-plans/${this.dataPlanId}`))
      .then(resp => this.dataPlan = DataPlan.fromData(resp.data.data).prepareData())
      .finally(() => this.loading = false)

    initDataTable('table#users', {
      ajax: {
        url: apiMerchantUrl(`data-plans/${this.dataPlanId}/price-configs`),
        data: {}
      },
      order: [[6, 'asc']],
      reInitTable: {onFilterChange: true},
      columns: [
        {data: 'mpc_id'},
        {data: 'data_plan_id'},
        {data: 'np_name'},
        {data: 'dp_name'},
        {data: 'original_price'},
        {data: 'amount'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'mpc_id'},
      ],
      columnDefs: [
        {
          targets: 4,
          render(data, type, row) {
            return formatKobo(row['original_price'])
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return MerchantPriceConfig.fromData(row).prepareData().amount_formatted
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return merchant_price_config_status(row['status'])
          }
        },
      ],
      dropdown: [
        {
          html: 'Deactivate',
          icon: 'trash-alt',
          onClick: data => {
            Swal.fire({
              title: 'Deactivate Price Config?',
              text: "You won't be able to revert this",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, deactivate!'
            }).then((result) => {
              if (result.isConfirmed) {
                this.xhrPatch(apiMerchantUrl(`price-configs/${data['mpc_id']}/deactivate`))
                  .then(() => {
                    Swal.fire(
                      'Price Config',
                      'Price has been removed',
                      'success'
                    ).then(() => this.$table.ajax.reload())
                  })
              }
            })
          }
        },
      ]
    }).then($t => this.$table = $t)
  }
}
</script>

<style scoped>

</style>
