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
          v-model="form.full_name"
          label="Full Name"
          outlined
        ></v-text-field>

        <div class="row" v-if="is_create">
          <div class="col-md">
            <v-text-field
              v-model="form.mobile_number"
              label="Mobile Number"
              outlined
            ></v-text-field>
          </div>
          <div class="col-md">
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
          </div>
        </div>
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
  name: "CreateUpdateForm",
  props: {
    value: {default: false},
    endpointPrefix: {default: ''},
    is_create_mode: {default: false},
    is_update_mode: {default: false},
    beneficiary: {default: null},
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
      this.form = {full_name: ben.full_name}
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

        Alert.success({
          title: 'Beneficiary',
          html: 'Beneficiary has been created successfully'
        })

        this.dialog = false
        this.create().finally(stopWorking)
      }

      // Update
      if (this.is_update) {
        startWorking('Updating')

        Alert.success({
          title: 'Beneficiary',
          html: 'Beneficiary has been updated successfully'
        })

        this.dialog = false
        this.update().finally(stopWorking)
      }
    },

    create() {
      return this
        .xhrPost(apiUrl(`${this.endpointPrefix}beneficiaries`), this.form)
        .then(resp => this.$emit('created', resp.data.data))
    },

    update() {
      return this
        .xhrPut(apiUrl(`${this.endpointPrefix}beneficiaries/${this.beneficiary['beneficiary_id']}`), this.form)
        .then(resp => this.$emit('updated', resp.data.data))
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
      this.form = {full_name: this.beneficiary.full_name}
    }
  }
}
</script>

<style scoped>

</style>
