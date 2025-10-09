<template>
  <div class="card">
    <div class="card-body">
      <div class="table-responsive table-responsive-md">
        <table class="table table-hover" :id="theTableId">
          <thead>
          <tr>
            <th>#ID</th>
            <th>Type</th>
            <th>Husmo Price</th>
            <th>Price</th>
            <th>Merchant Max Price</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Created At</th>
            <th></th>
          </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiAdminUrl, formatKobo, formatMoneyAmount} from "~/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import {badge} from "~/plugins/helpers/html";
import {data_price_status} from "~/plugins/status/data_price_status";

export default {
  name: "DataPrice",
  props: ['dataPlanId'],
  data() {
    return {
      theTableId: '',
    }
  },
  mounted() {
    this.theTableId = `admin-data-plan-prices-${this.dataPlanId}`
    initDataTable(`table#${this.theTableId}`, {
      url: apiAdminUrl(`data-plans/${this.dataPlanId}/data-prices`),
      pageLength: 5,
      reInitTable: {onFilterChange: true,},
      order: [[5, 'asc']],
      columns: [
        {data: 'data_price_id'},
        {data: 'beneficiary_type'},
        {data: 'husmo_price'},
        {data: 'amount'},
        {data: 'merchant_max_price'},
        {data: 'status'},
        {data: 'creator_first_name', name: 'creator.first_name'},
        {data: 'created_at'},
        {data: 'data_price_id'},
      ],
      dropdown: [
        {
          icon: 'edit-alt',
          html: 'Disable',
          showIf: {status: 'active'},
          href: data => `/admin/data-plans/${data['data_plan_id']}/deactivate-price?id=${data['data_price_id']}`
        }
      ],
      columnDefs: [
        {
          targets: 1,
          render(data, type, row) {
            return badge('info-dim text-info', row['beneficiary_type']);
          }
        },
        {
          targets: 2,
          render(data, type, row) {
            return formatKobo(row['husmo_price']);
          }
        },
        {
          targets: 3,
          render(data, type, row) {
            return formatKobo(row['amount']);
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return row['merchant_max_price'] ? formatKobo(row['merchant_max_price']) : '';
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return data_price_status(row['status'])
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return User.fromData(row).viewPageLink('admin', 'created_by', 'creator')
          }
        },
      ]
    })
  }
}
</script>

<style scoped>

</style>
