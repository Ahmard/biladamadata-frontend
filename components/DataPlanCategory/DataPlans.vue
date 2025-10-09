<template>
  <card>
    <card-body class="table-responsive table-responsive-md">
      <data-table :id="tableId">
        <thead>
        <tr>
          <th>#ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Husmo ID</th>
          <th>Quantity</th>
          <th>Expiration</th>
          <th>Created By</th>
          <th>Status</th>
          <th>Created At</th>
          <th></th>
        </tr>
        </thead>
        <tbody></tbody>
      </data-table>
    </card-body>
  </card>
</template>

<script>
import {initDataTable} from "~/plugins/helpers/datatable";
import {apiAdminUrl, formatKobo, startWorking, stopWorking} from "~/plugins/helpers/misc";
import {User} from "~/plugins/models/user";
import {data_plan_status} from "~/plugins/status/data_plan_status";
import Swal from "sweetalert2";
import {formatFileSize} from "~/plugins/helpers/str";
import {DataPlanCategory} from "~/plugins/models/data.plan.category";

export default {
  name: "DataPlans",
  props: {
    networkProviderId: {default: null},
    endpoint: {default: null},
    pageLength: {default: 5},
    tableId: {default: 'admin-data-plans'},
  },
  data() {
    return {
      $table: null,
    }
  },
  mounted() {
    initDataTable(`#${this.tableId}`, {
      url: this.endpoint,
      pageLength: this.pageLength,
      reInitTable: {
        onFilterChange: true,
      },
      columns: [
        {data: 'data_plan_id'},
        {data: 'dp_name'},
        {data: 'dpc_name', name: 'data_plan_categories.dpc_name'},
        {data: 'plan_price', searchable: false},
        {data: 'huzmo_id'},
        {data: 'data_quantity'},
        {data: 'expired_in'},
        {data: 'creator_first_name', name: 'creator.first_name'},
        {data: 'status'},
        {data: 'created_at'},
        {data: 'data_plan_id'},
      ],
      onRowClick: (e, tableRow, rowData) => {
        this.$router.push(`/admin/data-plans/${rowData['data_plan_id']}`)
      },
      columnDefs: [
        {
          targets: 2,
          render(data, type, row) {
            return DataPlanCategory.fromData(row).viewPageLink('data_plan_category_id');
          }
        },
        {
          targets: 3,
          render(data, type, row) {
            return formatKobo(row['plan_price'], 0);
          }
        },
        {
          targets: 5,
          render(data, type, row) {
            return formatFileSize(row['data_quantity'] * (1024 * 1024));
          }
        },
        {
          targets: 6,
          render(data, type, row) {
            return `${row['expired_in']} Days`
          }
        },
        {
          targets: 7,
          render(data, type, row) {
            return User.fromData(row).viewPageLink('admin', 'created_by', 'creator')
          }
        },
        {
          targets: 8,
          render(data, type, row) {
            return data_plan_status(row['status']);
          }
        },
      ],
      dropdown: [
        {
          html: 'Edit',
          icon: 'edit-alt',
          href: data => `/admin/data-plans/${data['data_plan_id']}/edit`
        },
        // Disable Plan
        // 2105326661 - Abdullahi Ibrahim - UBA
        {
          icon: 'block',
          html: 'Disable',
          showIf: {
            status: 'active'
          },
          onClick: data => {
            Swal.fire({
              title: 'Deactivate Plan',
              text: "Are you sure you want to disable this plan?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, disable!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Deactivating')

                this.xhrPatch(apiAdminUrl(`data-plans/${data['data_plan_id']}/disable`))
                  .then(() => {
                    this.$table.ajax.reload()
                    Swal.fire(
                      'Data Plan',
                      'Data plan has been disabled',
                      'success'
                    )
                  })
                  .finally(() => stopWorking())
              }
            })
          }
        },

        // Enable Plan
        {
          icon: 'check-double',
          html: 'Activate',
          showIf: {
            status: 'inactive'
          },
          onClick: data => {
            Swal.fire({
              title: 'Enable Plan',
              text: "Are you sure you want to enable this plan?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, enable!'
            }).then((result) => {
              if (result.isConfirmed) {
                startWorking('Activating')

                this.xhrPatch(apiAdminUrl(`data-plans/${data['data_plan_id']}/enable`))
                  .then(() => {
                    Swal.fire(
                      'Data Plan',
                      'Data plan has been enabled',
                      'success'
                    )
                  })
                  .finally(() => stopWorking())
              }
            })
          },
        }
      ],
    }).then($t => this.$table = $t)
  }
}
</script>

<style scoped>

</style>
