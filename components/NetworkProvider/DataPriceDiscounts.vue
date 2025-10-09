<template>
  <div class="card">
    <div class="card-body table-responsive table-responsive-md">
      <table class="table table-hover" id="discounts">
        <thead>
        <tr>
          <th>#ID</th>
          <th>Beneficiary Type</th>
          <th>Discount Type</th>
          <th>Minimum Amount</th>
          <th>Discount Amount</th>
          <th>Created By</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiAdminUrl, formatNumber} from "~/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import {data_price_discount_status} from "~/plugins/status/data_price_discount_status";
import Swal from "sweetalert2";

export default {
  name: "DataPriceDiscounts",
  props: ['dataPlanId'],
  data() {
    return {
      $table: null,
      isLoading: true,
    }
  },
  mounted() {
    initDataTable('#discounts', {
      url: apiAdminUrl(`data-plans/${this.dataPlanId}/data-price-discounts`),
      pageLength: 5,
      reInitTable: {
        onFilterChange: true,
      },
      columns: [
        {data: 'data_price_discount_id'},
        {data: 'beneficiary_type'},
        {data: 'discount_type'},
        {data: 'minimum_data_amount'},
        {data: 'discount_amount'},
        {data: 'creator_first_name', name: 'creator.first_name'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'data_price_discount_id'},
      ],
      columnDefs: [
        {
          targets: 3,
          render(data, type, row) {
            return `<b>${row['minimum_data_amount']}GB</b>`;
          }
        },
        {
          targets: 4,
          render(data, type, row) {
            return formatNumber(row['discount_amount']);
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return User.fromData(row).viewPageLink('admin', 'created_by', 'creator')
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return data_price_discount_status(row['status'])
          }
        },
      ],
      dropdown: [
        {
          icon: 'trash',
          html: 'Disable',
          onClick: data => {
            Swal.fire({
              title: 'Deactivate Discount',
              text: "You won't be able to revert this",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, deactivate!'
            }).then((result) => {
              if (result.isConfirmed) {
                this.xhrPatch(apiAdminUrl(`data-price-discounts/${data['data_price_discount_id']}/mark-as-inactive`))
                  .then(() => {
                    Swal.fire(
                      'Discount',
                      'Discount has been deactivate',
                      'success'
                    ).then(() => this.$table.ajax.reload())
                  })
              }
            })
          }
        }
      ]
    }).then($t => {
      this.isLoading = false
      this.$table = $t
    })
  }
}
</script>

<style scoped>

</style>
