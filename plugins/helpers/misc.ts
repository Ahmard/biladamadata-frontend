import {jQuery, MiscScoped} from "~/types/misc";
import {NuxtApp} from "@nuxt/types/app";
import {LooseStringObject} from "~/types/loose.object";

// @ts-ignore
const scoped: MiscScoped = {};

export function initMisc($nuxt: NuxtApp, $: jQuery) {
  // @ts-ignore
  scoped.$nuxt = $nuxt;
  // @ts-ignore
  scoped.$ = $;
}

export function nuxt(): NuxtApp {
  if (!scoped.$nuxt) {
    throw new Error('Nuxt is not Initialised yet');
  }

  return scoped.$nuxt
}

export function jQuery(): jQuery {
  if (!scoped.$) {
    throw new Error('jQuery is not Initialised yet');
  }

  return scoped.$
}

export function authToken(raw_token: boolean = false): string {
  // @ts-ignore
  const token: string = nuxt().$auth.strategy.token.get();

  if (raw_token) {
    return token.split('Bearer ')[1]
  }

  return token;
}

export function serverUrl(url: string): string {
  return `${process.env.BACKEND_SERVER_ADDRESS}${url}`;
}

export function apiUrl(url: string): string {
  const version = process.env.BACKEND_API_VERSION
  return serverUrl(`api/${version}/${url}`);
}

export function apiAdminUrl(url: string, params: LooseStringObject = {}): string {
  return apiUrl(`admin/${url}?${$.param(params)}`);
}

export function apiMerchantUrl(url: string): string {
  return apiUrl(`merchant/${url}`);
}

export function apiResellerUrl(url: string): string {
  return apiUrl(`reseller/${url}`);
}

export function toKobo(number: number) {
  return number * 100
}

export function fromKobo(number: number) {
  return number / 100
}

export function formatNumber(number: number, minFractionDigits: number = 2) {
  return Intl
    .NumberFormat('en-NG', {minimumFractionDigits: minFractionDigits})
    .format(number);
}

export function formatMoneyAmount(number: number, minFractionDigits: number = 2) {
  return new Intl.NumberFormat(`en-NG`, {
    currency: `NGN`,
    style: 'currency',
    minimumFractionDigits: minFractionDigits
  }).format(number)
}

export function formatKobo(
  number: number | string,
  minFractionDigits: number = 2,
  currency_symbol: string | null = null,
  default_val = 'N/A',
) {
  if (!number) {
    return default_val;
  }

  let normalized_number = parseInt(<string>number) / 100;

  if (currency_symbol) {
    return `${currency_symbol} ${formatNumber(normalized_number, minFractionDigits)}`
  }

  return formatMoneyAmount(normalized_number, minFractionDigits)
}

export function formatKoboNumber(number: number, minFractionDigits: number = 2) {
  return Intl
    .NumberFormat('en-NG', {minimumFractionDigits: minFractionDigits})
    .format(number / 100);
}

export function formatMoneyAmountDisplay(num: any, nairaSign: Boolean = false) {
  if (num === null) return 0;

  num = num.tostring().replace(/[^0-9.]/g, '');
  if (num < 1000) {
    return num;
  }
  let si = [
    {v: 1E3, s: "K"},
    {v: 1E6, s: "M"},
    {v: 1E9, s: "B"},
    {v: 1E12, s: "T"},
    {v: 1E15, s: "P"},
    {v: 1E18, s: "E"}
  ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
    if (num >= si[index].v) {
      break;
    }
  }

  const formatted = (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;

  if (nairaSign) {
    let amount = formatted.slice(0, -1)
    let unit = formatted.slice(formatted.length - 2, 1)

    return formatMoneyAmount(parseInt(amount))
  }

  return formatted
}

export function getMonthName(month: number): string {
  const date = new Date();
  date.setMonth(month);
  return date.toLocaleString("default", {month: "long"});
}

export function captureCustomLinks($router: any) {
  document.querySelectorAll('a.custom-link').forEach(node => {
    node.addEventListener('click', event => {
      event.preventDefault();

      const href: string = node.getAttribute('href') ?? '';

      if (-1 !== href.indexOf('http://') || -1 !== href.indexOf('https://')) {
        window.open(href, '_blank')
        return;
      }

      $router.push(href)
    })
  })
}

export function windowLoaded(callback: () => void) {
  if (process.client) {
    setTimeout(() => {
      // @ts-ignore
      $(callback)
    });
  }
}

export function redirect(uri: string) {
  nuxt().$router.push(uri);
}

export function reinitializeDropdowns(debug_scope = 'page') {
  console.info(`Reinitializing dropdowns: ${debug_scope}...`)
  $(".dropdown-toggle,.dropdown-toggle-custom").off('click').on("click", function () {
    // @ts-ignore
    $(this).dropdown("show");
  });
}

export function decodeHtml(html: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export function isMobileDevice() {
  // @ts-ignore
  return navigator.userAgentData.mobile;
}

export function startWorking(message?: string) {
  nuxt().$store.commit('data/startWorking', message);
}

export function stopWorking() {
  nuxt().$store.commit('data/stopWorking');
}

export function loadCachedScript(url: string): Promise<string> {
  // @ts-ignore
  return $.cachedScript(url).done(function () {
    console.log('JQ Script Loaded: ' + url);
  });
}

export function isEmpty(value: any): boolean {
  return (!value?.length);
}

export function getPageQueries(): LooseStringObject {
  const URI = require('urijs');
  const splitPath = window.location.hash.split('?');
  const pageSearchQueries = '?' + splitPath.at(splitPath.length - 1)
  return new URI(pageSearchQueries).query(true)
}

export function mergePageQueries(queries: LooseStringObject): LooseStringObject {
  const pageQueries = getPageQueries();
  for (const queriesKey in queries) {
    if (pageQueries.hasOwnProperty(queriesKey) && isEmpty(queries[queriesKey])) {
      continue;
    }

    pageQueries[queriesKey] = queries[queriesKey]
  }
  return pageQueries;
}
