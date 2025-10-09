<template>
  <div>
    <card v-if="is_fetching_acc_num && withLoader">
      <card-header :loading="is_fetching_acc_num" loading-message="loading">
        <template #title>Account Numbers</template>
      </card-header>
    </card>

    <div class="row" v-if="!is_fetching_acc_num" style="margin-top: 1px">
      <div class="mb-2" v-for="acc in acc_nums" :class="`col-md-${colSize}`">
        <card>
          <card-body :class="getBackgroundColor(acc)" :style="`color: wheat!important;height: ${cardHeight}!important;`">
            <div class="list-group list-group-flush">
              <div class="list-group-item text-white">
                <b>Bank:</b> <span class="">{{ acc.bank_name }}</span>
              </div>
              <div class="list-group-item text-white">
                <b>Account Name:</b> <span class="">BiladamaData NG
                -{{ acc.account_name }}</span>
              </div>
              <div class="list-group-item text-white">
                <b>Account Number:</b> <span class="">{{ acc.account_number }}</span>
              </div>
            </div>

            <div v-if="withTip" class="mt-2" style="font-family: Arial,serif">
              <b>ACCOUNT TIP:</b>
              <span class="tip-message">
                You can top up your wallet instantly by doing a transfer to this account number.
                Save it as a beneficiary on your banking app so you can send money to it at any time!
              </span>
            </div>
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "AccountNumbers",
  props: {
    colSize: {default: '3'},
    accNums: {default: null},
    withTip: {default: true},
    endpoint: {default: null},
    withLoader: {default: true},
    cardHeight: {default: '380px'},
  },
  data() {
    return {
      acc_nums: [],
      is_fetching_acc_num: true,
    }
  },
  methods: {
    getBackgroundColor(bank) {
      if (bank.bank_code === '232') {
        return 'sterling-bank'
      }

      if (bank.bank_code === '035') {
        return 'wema-bank'
      }

      if (bank.bank_code === '50515') {
        return 'moniepoint-bank'
      }
    },
  },
  mounted() {
    if (this.accNums) {
      this.acc_nums = this.accNums
      this.is_fetching_acc_num = false
    }

    if (!this.accNums) {
      this.xhrGet(this.endpoint)
        .then(resp => {
          this.acc_nums = resp.data.data.van
          this.$emit('numbers', resp.data.data)
        })
        .finally(() => this.is_fetching_acc_num = false)
    }
  }
}
</script>

<style scoped>
.list-group-item {
  padding: 13px !important
}

.sterling-bank {
  background-color: #c97d7d
}

.wema-bank {
  background-color: mediumpurple;
}

.moniepoint-bank {
  background-color: cornflowerblue;
}

.tip-message {
  color: lightgoldenrodyellow;
}
</style>
