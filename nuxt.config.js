import colors from 'vuetify/es5/util/colors'

const BACKEND_SERVER = 'http://localhost:3301';
// const BACKEND_SERVER = 'https://backend.biladamadata.com';
const BACKEND_ADDRESS = BACKEND_SERVER;

// const WS_SERVER_ADDRESS = 'ws://localhost:3302';
const WS_SERVER_ADDRESS = 'wss://realtime.biladamadata.com';

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,

  server: {
    port: process.env.SERVER_PORT,
    host: process.env.SERVER_HOST
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - BiladamaData',
    title: 'BiladamaData',
    htmlAttrs: {
      lang: 'en',
      class: 'light-style layout-menu-fixed',
      dir: 'ltr',
      'data-theme': 'theme-default',
      // 'data-assets-path': '',
      'data-template' : 'vertical-menu-template-free',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    script: [
      // <script src="https://myawesome-lib.js"></script>
      {src: '/assets/vendor/js/helpers.js'},
      {src: '/assets/js/ui-config.js'},
      {src: '/assets/vendor/libs/popper/popper.js', body: true},
      {src: '/assets/vendor/js/bootstrap.js', body: true},
      {src: '/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js', body: true},
      {src: '/assets/vendor/js/menu.js', body: true},
      {src: '/assets/js/main.js', body: true},
      // {src: '/assets/js/dashboards-analytics.js', body: true},
      // {src: '/assets/js/buttons.js', body: true},
    ],
    link: [
      // <link rel="stylesheet" href="https://myawesome-lib.css">
      {rel: 'stylesheet', href: '/assets/vendor/fonts/boxicons.css'},
      {rel: 'stylesheet', href: '/assets/vendor/css/core.css'},
      {rel: 'stylesheet', href: '/assets/vendor/css/theme-default.css'},
      {rel: 'stylesheet', href: '/assets/css/demo.css'},
      {rel: 'stylesheet', href: '/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css'},
      {rel: 'stylesheet', href: '/assets/css/custom.css'},
      // {rel: 'stylesheet', href: '/assets/vendor/libs/apex-charts/apex-charts.css'},
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/custom.less',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/xhr.ts',
    '~/plugins/hello.ts',
    '~/plugins/plugins.js',
    '~/plugins/datano.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // Compress app to reduce load time
    'nuxt-compress'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-compress'
  ],

  'nuxt-compress': {
    gzip: {
      threshold: 8192
    },
    brotli: {
      threshold: 8192
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      // dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    icons: {
      iconfont: 'bx', // default - only for display purposes
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // analyze: true,
  },

  auth: {
    plugins: [],
    cookie: {
      options: {
        sameSite: 'lax'
      }
    },
    strategies: {
      'laravelJWT': {
        provider: 'laravel/jwt',
        url: process.env.BACKEND_SERVER,
        endpoints: {
          login: {
            url: `/api/${process.env.BACKEND_API_VERSION}/auth/login`
          },
          logout: {
            url: `/api/${process.env.BACKEND_API_VERSION}/auth/logout`
          },
          user: {
            url: `/api/${process.env.BACKEND_API_VERSION}/auth/me`
          }
        },
        token: {
          name: 'Auth-Token',
          property: 'access_token',
          maxAge: 30 * 60 // 30 minutes
        },
        refreshToken: {
          maxAge: 3 * 24 * 60 * 60  // 3 days,
        }
      }
    }
  },

  router: {
    middleware: ['auth'],
    mode: 'hash'
  },

  env: {
    APP_NAME: process.env.APP_NAME,
    BACKEND_SERVER: process.env.BACKEND_SERVER + '/',
    BACKEND_SERVER_ADDRESS: process.env.BACKEND_SERVER + '/',
    FRONTEND_SERVER_ADDRESS: process.env.FRONTEND_SERVER_ADDRESS,
    WS_SERVER_ADDRESS: process.env.WS_SERVER_ADDRESS,
    BACKEND_API_VERSION: process.env.BACKEND_API_VERSION
  },

  loading: {
    color: 'green',
    height: '5px',
    throttle: 0
  }
}
