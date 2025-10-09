<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-12 order-3 order-md-2">
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-3 mb-4" @click="redirect('/admin/funding-history')">
            <div class="card">
              <div class="card-body">
                <div class="card-title d-flex align-items-start justify-content-between">
                  <div class="avatar flex-shrink-0">
                    <img src="/assets/img/icons/unicons/paypal.png" alt="Credit Card" class="rounded">
                  </div>
                  <div class="dropdown">
                    <button class="btn p-0" type="button" id="cardOpt4" data-bs-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                      <a class="dropdown-item" href="javascript:void(0);">View More</a>
                    </div>
                  </div>
                </div>
                <span class="d-block mb-1">Payments</span>
                <h3 v-if="!isLoading" class="card-title text-nowrap mb-2">{{ metrics.total_today_payments }}</h3>
                <small v-if="!isLoading" class="text-danger fw-semibold"><i class="bx bx-down-arrow-alt"></i> -14.82%</small>
                <Spinner :spin="isLoading" />
              </div>
            </div>
          </div>

          <div class="col-sm-12 col-md-6 col-lg-3 mb-4" @click="redirect('/admin/data/transactions')">
            <div class="card">
              <div class="card-body">
                <div class="card-title d-flex align-items-start justify-content-between">
                  <div class="avatar flex-shrink-0">
                    <img src="/assets/img/icons/unicons/cc-primary.png" alt="Credit Card" class="rounded">
                  </div>
                  <div class="dropdown">
                    <button class="btn p-0" type="button" id="cardOpt1" data-bs-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="cardOpt1">
                      <a class="dropdown-item" href="javascript:void(0);">View More</a>
                    </div>
                  </div>
                </div>
                <span class="fw-semibold d-block mb-1">Transactions</span>
                <h3 v-if="!isLoading" class="card-title mb-2">{{ metrics.total_today_transactions }}</h3>
                <small v-if="!isLoading" class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i> +28.14%</small>
                <Spinner :spin="isLoading" />
              </div>
            </div>
          </div>

          <div class="col-sm-12 col-md-6 col-lg-3 mb-4" @click="redirect('/admin/merchants')">
            <div class="card">
              <div class="card-body">
                <div class="card-title d-flex align-items-start justify-content-between">
                  <div class="avatar flex-shrink-0">
                    <img src="/assets/img/icons/unicons/chart.png" alt="Credit Card" class="rounded">
                  </div>
                  <div class="dropdown">
                    <button class="btn p-0" type="button" id="cardOpt4" data-bs-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                      <a class="dropdown-item" href="javascript:void(0);">View More</a>
                    </div>
                  </div>
                </div>
                <span class="d-block mb-1">Merchants</span>
                <h3 v-if="!isLoading" class="card-title text-nowrap mb-2">{{ metrics.total_merchants }}</h3>
                <small v-if="!isLoading" class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i> +28.14%</small>
                <Spinner :spin="isLoading" />
              </div>
            </div>
          </div>

          <div class="col-sm-12 col-md-6 col-lg-3 mb-4" @click="redirect('/admin/resellers')">
            <div class="card">
              <div class="card-body">
                <div class="card-title d-flex align-items-start justify-content-between">
                  <div class="avatar flex-shrink-0">
                    <img src="/assets/img/icons/unicons/chart.png" alt="Credit Card" class="rounded">
                  </div>
                  <div class="dropdown">
                    <button class="btn p-0" type="button" id="cardOpt4" data-bs-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                      <a class="dropdown-item" href="javascript:void(0);">View More</a>
                    </div>
                  </div>
                </div>
                <span class="d-block mb-1">Resellers</span>
                <h3 v-if="!isLoading" class="card-title text-nowrap mb-2">{{ metrics.total_resellers }}</h3>
                <small v-if="!isLoading" class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i> +28.14%</small>
                <Spinner :spin="isLoading" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


    <div class="row">
      <!-- Order Statistics -->
      <div class="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex align-items-center justify-content-between pb-0">
            <div class="card-title mb-0">
              <h5 class="m-0 me-2">Data Statistics</h5>
              <small class="text-muted">Total Data Transactions</small>
            </div>
            <div class="dropdown">
              <button
                class="btn p-0"
                type="button"
                id="orederStatistics"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-end" aria-labelledby="orederStatistics">
                <a class="dropdown-item" href="javascript:void(0);">Refresh</a>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex flex-column align-items-center gap-1">
                <h2 class="mb-2">{{ metrics.total_data_transactions }}</h2>
                <span>Total Transactions</span>
              </div>
              <div id="orderStatisticsChart"></div>
            </div>
            <ul class="p-0 m-0">
              <li
                class="d-flex mb-4 pb-1"
                v-for="summary in metrics.data_summary"
                @click="redirect(`/admin/network-providers/${summary['network_provider_id']}`)"
              >
                <div class="avatar flex-shrink-0 me-3">
                            <span class="avatar-initial rounded bg-label-primary"
                            ><i class="bx bx-mobile-alt"></i
                            ></span>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div class="me-2">
                    <h6 class="mb-0">{{ summary.np_name }}</h6>
                    <small class="text-muted">Data Transactions</small>
                  </div>
                  <div class="user-progress">
                    <small class="fw-semibold">{{ summary.total_data_transactions }}</small>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--/ Order Statistics -->

      <!-- Transactions -->
      <div class="col-md-6 col-lg-4 order-2 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title m-0 me-2">Transactions</h5>
            <div class="dropdown">
              <button
                class="btn p-0"
                type="button"
                id="transactionID"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                <a class="dropdown-item" href="javascript:void(0);">Today</a>
              </div>
            </div>
          </div>
          <div class="card-body">
            <ul class="p-0 m-0">
              <li
                class="d-flex mb-4 pb-1"
                v-for="transaction in metrics.top_transactions"
                @click="redirect(`/admin/network-providers/${transaction['network_provider_id']}`)"
              >
                <div class="avatar flex-shrink-0 me-3">
                  <img src="/assets/img/icons/unicons/cc-success.png" alt="User" class="rounded"/>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div class="me-2">
                    <small class="text-muted d-block mb-1">{{ transaction.np_name }}</small>
                    <h6 class="mb-0">{{ transaction.dp_name }}</h6>
                  </div>
                  <div class="user-progress d-flex align-items-center gap-1">
                    <h6 class="mb-0">{{ transaction.data_computed_price }}</h6>
                    <span class="text-muted">NGN</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--/ Transactions -->

      <!-- Notifications -->
      <div class="col-md-6 col-lg-4 order-2 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title m-0 me-2">Top Notifications</h5>
            <div class="dropdown">
              <button
                class="btn p-0"
                type="button"
                id="transactionID"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                <a class="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                <a class="dropdown-item" href="javascript:void(0);">Last Month</a>
                <a class="dropdown-item" href="javascript:void(0);">Last Year</a>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-inner table-responsive table-responsive-md m-3">
              <Table id="notifications">
                <thead>
                <tr>
                  <th>Status</th>
                  <th>Title</th>
                  <th>Date & Time</th>
                </tr>
                </thead>
                <tbody></tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  apiAdminUrl,
  apiUrl,
  decodeHtml,
  formatKobo, formatKoboNumber,
  formatMoneyAmount,
  redirect,
  serverUrl
} from "~/plugins/helpers/misc";
import {formatNumber} from "~/plugins/helpers/form";
import {initDataTable} from "~/plugins/helpers/datatable";
import {notification_status} from "~/plugins/status/notification_status";

export default {
  name: "SuperAdminDashboard",
  methods: {redirect},
  data() {
    return {
      isLoading: true,
      user: {roles: []},
      role: {name: ''},
      metrics: {
        data_summary: [],
        top_transactions: [],
        total_merchants: 0,
        total_resellers: 0,
        total_today_payments: 0,
        total_today_transactions: 0,
        total_data_transactions: 0,
      }
    }
  },
  mounted() {
    this.user = this.$auth.user

    this.xhrGet(apiAdminUrl('dashboard'))
      .then(resp => {
        const metrics = resp.data.data;
        metrics.total_merchants = formatNumber(metrics.total_merchants)
        metrics.total_resellers = formatNumber(metrics.total_resellers)
        metrics.total_today_payments = formatKobo(metrics.total_today_payments, 0)
        metrics.total_today_transactions = formatKobo(metrics.total_today_transactions, 0)

        let total_transactions = 0
        metrics.data_summary.forEach(summary => {
          const parsedTransactions = parseInt(summary.total_data_transactions)
          total_transactions += !isNaN(parsedTransactions) ? parsedTransactions : 0
          summary.total_data_transactions = formatKobo(summary.total_data_transactions)
        })

        metrics.top_transactions.forEach(transaction => {
          transaction.data_computed_price = formatKobo(transaction.data_computed_price)
        })

        metrics.total_data_transactions = formatKoboNumber(total_transactions, 0)
        this.metrics = metrics
        this.isLoading = false
      })

    initDataTable('table#notifications', {
      ajax: {
        url: apiUrl(`notifications`),
        data: {purpose: 'dashboard'},
      },
      onRowClick: function (e, tableRow, data,) {
        window.open(serverUrl(`notifications/${data['notification_id']}`), '_blank')
      },
      reInitTable: {onFilterChange: true,},
      pageLength: 5,
      searching: false,
      paging: false,
      dom: 'rtip',
      columns: [
        {data: 'status'},
        {data: 'title'},
        {data: 'created_at'},
      ],
      columnDefs: [
        {
          targets: 0,
          render(data, type, row) {
            return notification_status(row['status'])
          }
        },
        {
          targets: 1,
          render(data, type, row) {
            return decodeHtml(row['title'])
          }
        },
      ]
    })

  }
}
</script>

<style scoped>

</style>
