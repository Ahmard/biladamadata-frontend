<template>
  <div class="container">
    <breadcrumb :items="breadcrumbs"/>

    <div class="row">
      <div class="col-md-6">
        <card>
          <card-header :loading="isFetching" loading-message="Fetching Settings">
            <template #title>Module Settings</template>
            <template #desc>
              <spinner :small-icon="true" :spin="isSubmitting" color="primary">
                Saving settings
              </spinner>
              <div v-if="isSavedMessageVisible" class="text-success fw-bold">
                <i class="ni ni-check-circle-fill"></i> Settings Updated
              </div>
            </template>
          </card-header>
          <card-body v-if="!isFetching">
            <item-group v-if="isFormReady">
              <switch-item
                v-model="form.system_status"
                :is-updatable="!isSubmitting"
                desc="Modules such as login,register,order, etc will not be available when system is inactive"
                no-text="inactive"
                title="System Status"
                yes-text="active"
              />

              <switch-item
                v-model="form.login_module_status"
                :is-updatable="!isSubmitting"
                desc="Whether login module is active or not"
                no-text="inactive"
                title="Login Module Status"
                yes-text="active"
              />

              <switch-item
                v-model="form.register_module_status"
                :is-updatable="!isSubmitting"
                desc="Whether register module is active or not"
                no-text="inactive"
                title="Register Module Status"
                yes-text="active"
              />

              <switch-item
                v-model="form.mail_module_status"
                :is-updatable="!isSubmitting"
                desc="Whether mail (sending emails) module is active or not"
                no-text="inactive"
                title="Mail Module Status"
                yes-text="active"
              />

              <switch-item
                v-model="form.wallet_module_status"
                :is-updatable="!isSubmitting"
                desc="Whether wallet module is active or not"
                no-text="inactive"
                title="Wallet Module Status"
                yes-text="active"
              />

              <switch-item
                v-model="form.airtime_module_status"
                :is-updatable="!isSubmitting"
                desc="Whether airtime module is active or not"
                no-text="inactive"
                title="Airtime Module Status"
                yes-text="active"
              />

              <switch-item
                v-model="form.data_module_status"
                :is-updatable="!isSubmitting"
                desc="Whether data module is active or not"
                no-text="inactive"
                title="Data Module Status"
                yes-text="active"
              />

              <switch-item
                v-model="form.payment_module_status"
                :is-updatable="!isSubmitting"
                desc="Whether payment module is active or not"
                no-text="inactive"
                title="Payment Module Status"
                yes-text="active"
              />

              <switch-item
                v-model="form.referral_module_status"
                :is-updatable="!isSubmitting"
                desc="Whether referral module is active or not"
                no-text="inactive"
                title="Referral Module Status"
                yes-text="active"
              />
            </item-group>
          </card-body>
        </card>
      </div>


      <div class="col-md-6">
        <card>
          <card-header :loading="isFetching" loading-message="Fetching Settings">
            <template #title>System Settings</template>
            <template #desc>
              <spinner :small-icon="true" :spin="isSubmitting" color="primary">
                Saving settings
              </spinner>
              <div v-if="isSavedMessageVisible" class="text-success fw-bold">
                <i class="ni ni-check-circle-fill"></i> Settings Updated
              </div>
            </template>
          </card-header>
          <card-body v-if="!isFetching">
            <item-group v-if="isFormReady">
              <!--              <input-item-->
              <!--                title="Moniepoint VAT"-->
              <!--                desc="Value added tax for Moniepoint"-->
              <!--                :is-updatable="!isSubmitting"-->
              <!--                :items="payment_gateways"-->
              <!--                v-model="form.moniepoint_vat"-->
              <!--              />-->

              <!--              <input-item-->
              <!--                title="Moniepoint Card Charges"-->
              <!--                desc="Card payment charges for Moniepoint"-->
              <!--                :is-updatable="!isSubmitting"-->
              <!--                :items="payment_gateways"-->
              <!--                v-model="form.moniepoint_card_charges"-->
              <!--              />-->

              <!--              <input-item-->
              <!--                title="Moniepoint Transfer Charges"-->
              <!--                desc="Transfer payment charges for Moniepoint"-->
              <!--                :is-updatable="!isSubmitting"-->
              <!--                :items="payment_gateways"-->
              <!--                v-model="form.moniepoint_transfer_charges"-->
              <!--              />-->

              <select-item
                v-model="form.payment_gateway"
                :is-updatable="!isSubmitting"
                :items="payment_gateways"
                desc="Choose default system payment gateway"
                title="Payment Gateway"
              />

              <textarea-item
                v-model="form.system_maintenance_message"
                :is-updatable="!isSubmitting"
                :items="payment_gateways"
                desc="This message will be shown when system is under maintenance"
                title="System Maintenance Message"
              />
            </item-group>
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import InputItem from "~/components/Settings/InputItem.vue";
import ItemGroup from "~/components/Settings/ItemGroup.vue";
import {apiAdminUrl, fromKobo} from "~/plugins/helpers/misc";
import SelectItem from "~/components/Settings/SelectItem.vue";
import _, {cloneDeep} from "lodash";
import SwitchItem from "~/components/Settings/SwitchItem.vue";
import TextareaItem from "~/components/Settings/TextareaItem.vue";

export default {
  name: "settings",
  components: {TextareaItem, SwitchItem, SelectItem, ItemGroup, InputItem},
  middleware: ['isAdmin'],
  head: {
    title: 'Settings'
  },
  watch: {
    form: {
      deep: true,
      handler(val) {
        if (this.isFormReady) {
          this.isSubmitting = true
          this.xhrPut(apiAdminUrl('settings'), val)
            .then(resp => {
              this.isFormReady = false
              this.prepareSettings(resp.data.data)
              this.isSavedMessageVisible = true
              setTimeout(() => this.isSavedMessageVisible = false)
            })
            .finally(() => this.isSubmitting = false)
            .catch(() => {
              this.form = this.settings
              this.isFormReady = false

              setTimeout(() => this.isFormReady = true, 100)
            })
        }
      }
    }
  },
  data() {
    return {
      settings: {},
      isFetching: true,
      isFormReady: false,
      isEditMode: false,
      isSubmitting: false,
      payment_gateways: [],
      isSavedMessageVisible: false,
      form: {
        data_module_status: null,
        airtime_module_status: null,
        day_price_rate: null,
        page_price_rate: null,
        payment_gateway: null,
        system_status: null,
        login_module_status: null,
        register_module_status: null,
        mail_module_status: null,
        wallet_module_status: null,
        payment_module_status: null,
        referral_module_status: null,
        system_maintenance_message: null,

        moniepoint_vat: null,
        moniepoint_card_charges: null,
        moniepoint_transfer_charges: null,
      },
      breadcrumbs: [
        {
          name: 'System Setups',
          url: '/admin/system-setups'
        },
        {
          name: 'Settings',
        }
      ]
    }
  },
  methods: {
    getEditElement(e) {
      return e.currentTarget.querySelector('a.edit');
    },
    editValue() {
      this.isEditMode = true
    },
    hideActionButton(e) {
      const editEl = this.getEditElement(e)
      if (editEl) {
        editEl.classList.remove('d-block')
        editEl.classList.add('d-none')
      }
    },
    showActionButton(e) {
      const editEl = this.getEditElement(e)
      if (editEl) {
        editEl.classList.remove('d-none')
        editEl.classList.add('d-block')
      }
    },

    prepareSettings(settings) {
      const options = settings.options

      this.form = settings.current

      this.form.moniepoint_vat = fromKobo(this.form.moniepoint_vat)
      this.form.moniepoint_card_charges = fromKobo(this.form.moniepoint_card_charges)
      this.form.moniepoint_transfer_charges = fromKobo(this.form.moniepoint_transfer_charges)

      this.settings = cloneDeep(settings.current)

      this.payment_gateways = options['payment_gateways'].map(pg => {
        return {
          id: pg,
          text: _.upperFirst(pg)
        }
      })

      setTimeout(() => this.isFormReady = true, 100)
    }
  },
  mounted() {
    this.xhrGet(apiAdminUrl('settings'))
      .then(resp => this.prepareSettings(resp.data.data))
      .finally(() => this.isFetching = false)
  }
}
</script>

<style scoped>

</style>
