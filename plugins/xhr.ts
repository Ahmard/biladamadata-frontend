import Vue from 'vue'
import {LooseObject} from "~/types/loose.object";
import {get, patch, post, put, remove} from "~/plugins/helpers/xhr";
import {AxiosRequestConfig, AxiosResponse} from "axios";

interface ResponseData {
  data: LooseObject,
  status: number,
  success: boolean
}

declare module 'vue/types/vue' {
  interface Vue {
    xhrGet<T = ResponseData, R = AxiosResponse<T>>(url: string, data?: LooseObject): Promise<R>

    xhrDelete<T = ResponseData, R = AxiosResponse<T>>(url: string, data?: LooseObject): Promise<R>

    xhrPut<T = ResponseData, R = AxiosResponse<T>>(url: string, data: LooseObject): Promise<R>

    xhrPatch<T = ResponseData, R = AxiosResponse<T>>(url: string, data?: LooseObject): Promise<R>

    xhrPost<T = ResponseData, R = AxiosResponse<T>>(url: string, data: LooseObject, config?: AxiosRequestConfig): Promise<R>
  }
}

Vue.prototype.xhrGet = function (url: string, data?: LooseObject) {
  return get(this, url, data);
}

Vue.prototype.xhrDelete = function (url: string, data?: LooseObject) {
  return remove(this, url, data);
}

Vue.prototype.xhrPut = function (url: string, data: LooseObject) {
  return put(this, url, data);
}

Vue.prototype.xhrPatch = function (url: string, data: LooseObject) {
  return patch(this, url, data);
}

Vue.prototype.xhrPost = function (url: string, data: LooseObject, config?: AxiosRequestConfig) {
  return post(this, url, data, config);
}
