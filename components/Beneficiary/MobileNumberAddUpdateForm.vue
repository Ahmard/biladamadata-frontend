<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-content-between">
          <span class="text-h5 text-uppercase text-secondary">
            {{ is_create ? 'Create' : 'Update' }} Beneficiary
          </span>
      </v-card-title>

      <v-card-text class="mt-3">
        <v-text-field
          v-model="form.mobile_number"
          label="Mobile Number"
          outlined
        ></v-text-field>

        <v-select
          v-model="form.network_provider_id"
          :items="network_providers()"
          label="Network Provider"
          density="compact"
          item-text="text"
          item-value="id"
          outlined
          append-icon=""
        ></v-select>
      </v-card-text>

      <v-card-actions style="margin-top: -30px">
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="submitForm" type="button">
          Submit
        </v-btn>
        <v-btn color="blue darken-1" text @click="hideDialog" type="button">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {network_providers} from "~/plugins/network_providers";
import {apiUrl, startWorking, stopWorking} from "~/plugins/helpers/misc";
import Alert from "~/plugins/helpers/alert";

export default {
  name: "MobileNumberAddUpdateForm",
  props: {
    value: {default: false},
    is_create_mode: {default: false},
    is_update_mode: {default: false},
    mobile_number: {default: null},
    beneficiary: {default: null},
    endpointPrefix: {default: ''},
  },
  watch: {
    value(val) {
      this.dialog = val
    },
    is_create_mode(val) {
      this.is_create = val
    },
    is_update_mode(val) {
      this.is_update = val
    },
    beneficiary(ben) {
      this.beneficiary = ben
    },
    mobile_number(num) {
      this.mobile_number = num
      this.form = {
        mobile_number: this.mobile_number.mobile_number,
        network_provider_id: this.mobile_number.network_provider_id,
      }
    }
  },
  data() {
    return {
      dialog: this.value,
      is_create: false,
      is_update: false,
      form: {
        full_name: null,
        mobile_number: null,
        network_provider_id: null,
      }
    }
  },
  methods: {
    network_providers,

    submitForm() {
      // Create
      if (this.is_create) {
        startWorking('Creating')
        this.dialog = false
        this.create().finally(stopWorking)
      }

      // Update
      if (this.is_update) {
        startWorking('Updating')
        this.dialog = false
        this.update().finally(stopWorking)
      }
    },

    create() {
      return this
        .xhrPost(apiUrl(`${this.endpointPrefix}beneficiaries/${this.beneficiary['beneficiary_id']}/mobile-numbers`), this.form)
        .then(resp => {
          this.$emit('created', resp.data.data)
          Alert.success({
            title: 'Mobile Number',
            html: 'Mobile number has added updated successfully'
          })
        })
    },

    update() {
      return this
        .xhrPut(apiUrl(`${this.endpointPrefix}beneficiaries/${this.mobile_number['beneficiary_id']}/mobile-numbers/${this.mobile_number['bmn_id']}`), this.form)
        .then(resp => {
          this.$emit('updated', resp.data.data)
          Alert.success({
            title: 'Mobile Number',
            html: 'Mobile number has been updated successfully'
          })
        })
    },

    hideDialog() {
      this.$emit('input', false)
      this.dialog = false
    }
  },
  mounted() {
    this.is_create = this.is_create_mode
    this.is_update = this.is_update_mode

    if (this.is_update) {
      this.form = {
        mobile_number: this.mobile_number.mobile_number,
        network_provider_id: this.mobile_number.network_provider_id,
      }
    }
  }
}
</script>

<style scoped>

</style>
