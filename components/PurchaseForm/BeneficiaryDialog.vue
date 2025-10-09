<template>
  <div>
    <template>
      <v-dialog v-model="dialog_beneficiaries" persistent max-width="600px">
        <v-card>
          <v-card-title class="d-flex justify-content-between">
            <span class="text-h5 text-uppercase text-secondary">
              Beneficiaries
            </span>
            <div>
              <NuxtLink to="/beneficiaries" class="btn btn-sm btn-outline-secondary">
                <i class="bx bxs-user-detail"></i> Manage
              </NuxtLink>
            </div>
          </v-card-title>

          <v-card-text class="mt-3">
            <v-text-field
              v-model="form.search_field"
              label="Find Beneficiary"
              outlined
            ></v-text-field>
          </v-card-text>

          <v-card-text class="list-group list-group-flush" style="margin-top: -30px">
            <div v-if="searching" class="text-center">
              <Spinner :spin="searching" :small-icon="false" color="primary"/>
            </div>
            <div
              v-for="beneficiary in search_result"
              class="list-group-item beneficiary-item"
              @click="chooseBeneficiary(beneficiary)">
              <div class="d-flex justify-content-start">
                <div class="me-2">
                  <i class="bx bx-user-circle" style="font-size: 40px"></i>
                </div>
                <div>
                  <div>{{ beneficiary['full_name'] }}</div>
                  <small class="fw-bold">
                    <span>{{ beneficiary['stringified_number'] }}</span>
                  </small>
                </div>
              </div>
            </div>

            <div
              class="text-muted text-center"
              v-if="!search_result.length && form.search_field.length"
              style="margin-top: -10px">
              (no beneficiary with given name found)
            </div>
          </v-card-text>

          <v-card-actions style="margin-top: -30px">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog" type="button">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template>
      <style>
        .number-item:hover {
          background-color: #eaeaea;
        }
      </style>
      <v-dialog v-model="dialog_beneficiary_numbers" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="text-h5 text-uppercase text-secondary">
              Beneficiary Numbers
            </span>
          </v-card-title>

          <v-card-text class="mt-3 list-group" style="margin-top: -30px">
            <div v-for="number in chosen_beneficiary.mobile_numbers" class="list-group-item number-item"
                 @click="chooseNumber(number)">
              <div>{{ number['mobile_number'] }}</div>
              <div>{{ number['np_name'] }}</div>
            </div>
          </v-card-text>

          <v-card-actions style="margin-top: -30px">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog_beneficiary_numbers = false" type="button">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import {apiUrl} from "~/plugins/helpers/misc";

export default {
  name: "BeneficiaryDialog",
  props: {
    value: {default: true},
  },
  watch: {
    value(val) {
      this.dialog_beneficiaries = val

      if (this.is_first_toggle) {
        this.is_first_toggle = false
        this.search('')
      }
    },
    'form.search_field': function (query) {
      this.search(query)
    }
  },
  data() {
    return {
      is_first_toggle: true,
      searching: false,
      search_result: [],
      search_timeout: null,
      dialog_beneficiaries: this.value,
      chosen_beneficiary: {},
      dialog_beneficiary_numbers: false,
      form: {
        search_field: ''
      }
    }
  },
  methods: {
    chooseBeneficiary(beneficiary) {
      this.chosen_beneficiary = beneficiary

      // Handle multiple numbers
      if (beneficiary.mobile_numbers.length > 1) {
        this.dialog_beneficiary_numbers = true
        return;
      }

      const number = beneficiary.mobile_numbers[0]

      if (!number) {
        this.dialog_beneficiary_numbers = false
        return;
      }

      this.chooseNumber(number)
    },

    chooseNumber(number) {
      this.dialog_beneficiary_numbers = false

      this.chosen_beneficiary.chosen = {
        mobile_number: number['mobile_number'],
        network_provider_id: number['network_provider_id'],
      }

      this.$emit('beneficiary', this.chosen_beneficiary)
    },

    closeDialog() {
      this.dialog_beneficiaries = false
      this.$emit('input', false)
    },

    search(query) {
      if (this.search_timeout) {
        clearTimeout(this.search_timeout);
      }

      this.searching = true
      this.search_result = []

      this.search_timeout = setTimeout(() => {
        this.search_timeout = null
        const payload = {
          q: query,
          limit: 6,
          purpose: 'form_select'
        };

        this.xhrGet(apiUrl('beneficiaries'), payload)
          .then(resp => {
            this.search_result = resp.data.data.map(beneficiary => {
              beneficiary.stringified_number = ''
              beneficiary.mobile_numbers.forEach(num => {
                beneficiary.stringified_number += num.mobile_number + ', '
              })

              beneficiary.stringified_number = beneficiary.stringified_number.slice(0, -2)
              return beneficiary
            })
          })
          .finally(() => this.searching = false)
      }, 400)
    }
  },
}
</script>

<style>
.beneficiary-item:hover {
  background-color: #efefef !important;
}
</style>
