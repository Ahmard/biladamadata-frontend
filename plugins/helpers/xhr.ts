import Swal from "sweetalert2";
import {NuxtApp} from "@nuxt/types/app";
import {AxiosRequestConfig} from "axios";
import {LooseObject} from "~/types/loose.object";

export async function handleSuccessError(response: any) {
  return response
}

export async function handleError(error: any) {
  const response = error.response
  const data = response ? response.data : undefined

  let title = 'Error!';
  let icon: string = 'error'
  let message: string = 'Something went wrong';


  if (response) {
    // BAD REQUEST
    if (400 === response.status || 422 === response.status) {
      // Warning Message
      if (data.hasOwnProperty('error')) {
        let warning_msg = data.error.message;

        if (typeof warning_msg === 'string') {
          warning_msg = JSON.parse(warning_msg)
        }

        error.additionalData = warning_msg.additional_data;
        title = 'Information'
        icon = 'warning'
        message = warning_msg.message
      }

      // Validation Error
      if (data.hasOwnProperty('errors')) {
        title = 'Form Error'
        icon = 'warning'
        // @ts-ignore
        message = Object.values(data.errors)[0][0]
      }
    }

    // NOT FOUND
    if (404 === response.status) {
      if (data.hasOwnProperty('error')) {
        title = 'Not Found'
        icon = 'warning'
        message = data.error.message
      }
    }

    // NOT FOUND
    if (500 === response.status) {
      if (data.hasOwnProperty('error')) {
        title = 'An Error Occurred'
        icon = 'warning'
        message = data.error.message
      }
    }
  }

  // @ts-ignore
  await Swal.fire({
    title: title,
    html: message,
    icon: icon,
    confirmButtonText: 'Okay'
  })

  return Promise.reject(error)
}

export async function post(nuxt: NuxtApp, url: string, data: {}, config?: AxiosRequestConfig) {
  // @ts-ignore
  return nuxt.$axios.post(url, data, config)
    .then((response: any) => handleSuccessError(response))
    .catch((error: any) => handleError(error))
}

export async function get(nuxt: NuxtApp, url: string, data: LooseObject = {}) {
  return nuxt.$axios.get(url, {params: data})
    .then((response: any) => handleSuccessError(response))
    .catch((error: any) => handleError(error))
}

export async function remove(nuxt: NuxtApp, url: string, data: LooseObject = {}) {
  return nuxt.$axios.delete(url, {params: data})
    .then((response: any) => handleSuccessError(response))
    .catch((error: any) => handleError(error))
}

export async function patch(nuxt: NuxtApp, url: string, data: LooseObject = {}) {
  return nuxt.$axios.patch(url, data)
    .then((response: any) => handleSuccessError(response))
    .catch((error: any) => handleError(error))
}

export async function put(nuxt: NuxtApp, url: string, data: LooseObject = {}) {
  return nuxt.$axios.put(url, data)
    .then((response: any) => handleSuccessError(response))
    .catch((error: any) => handleError(error))
}
