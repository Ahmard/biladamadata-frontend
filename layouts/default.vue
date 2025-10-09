<template>
  <div>
    <div class="layout-wrapper layout-content-navbar">
      <div class="layout-container">
        <!-- Menu -->

        <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
          <div class="app-brand demo">
            <NuxtLink to="/" class="app-brand-link">
              <span class="app-brand-logo demo">
                <img src="/assets/img/logo-transparent-150x80.png" alt="">
              </span>
            </NuxtLink>

            <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
              <i class="bx bx-chevron-left bx-sm align-middle"></i>
            </a>
          </div>

          <div class="menu-inner-shadow"></div>

          <ul class="menu-inner py-1 mt-3">
            <!-- Wallet -->
            <li class="menu-item active">
              <div @click="fetchUserInfo" class="menu-link cursor-pointer d-flex justify-content-between">
                <span class="px-3">
<!--                  <i v-if="!isFetchingUser" class="menu-icon tf-icons bx bx-wallet-alt"></i>-->
                  <Spinner color="primary" :spin="isFetchingUser" class="me-2"/>
                  <span
                    data-i18n="Analytics"
                    style="margin-left: -10px; padding-top: 100px">
                    Wallet: <span v-if="isWalletVisible">{{ walletBalance }}</span>
                  </span>
                  <span v-if="!isWalletVisible">[Hidden]</span>
                </span>
                <div @click="toggleWalletVisibility"><i :class="`visibility-icon bx bx-${walletVisibilityIcon}`"></i>
                </div>
              </div>
            </li>

            <li class="menu-header small text-uppercase">
              <span class="menu-header-text">Pages</span>
            </li>
            <li class="menu-item" v-for="nav in navs.data">
              <NuxtLink v-if="!nav['submenu']" :to="nav['url']" class="menu-link">
                <i :class="`menu-icon tf-icons bx bx-${nav['icon']}`"></i>
                <div data-i18n="Account Settings">{{ nav['name'] }}</div>
              </NuxtLink>

              <a v-if="nav['submenu']" href="javascript:void(0);" class="menu-link menu-toggle">
                <i :class="`menu-icon tf-icons bx bx-${nav['icon']}`"></i>
                <div :data-i18n="navs['name']">{{ nav['name'] }}</div>
              </a>
              <ul v-if="nav['submenu']" class="menu-sub">
                <li class="menu-item" v-for="subMenu in nav['submenu']">
                  <NuxtLink :to="subMenu['url']" class="menu-link">
                    <div :data-i18n="subMenu['name']">{{ subMenu['name'] }}</div>
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </aside>
        <!-- / Menu -->

        <!-- Layout container -->
        <div class="layout-page">
          <!-- Navbar -->

          <nav
            class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
            id="layout-navbar"
          >
            <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                <i class="bx bx-menu bx-sm"></i>
              </a>
            </div>

            <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">

              <ul class="navbar-nav flex-row align-items-center ms-auto">
                <!-- Place this tag where you want the button to render. -->
                <li class="nav-item lh-1 me-3">
                  <div class="text-muted fw-bold">{{ user.phone_number }}</div>
                  <div class="" style="text-transform: capitalize!important;">{{ user.first_name }} {{ user.last_name }}</div>
                </li>

                <!-- User -->
                <li class="nav-item navbar-dropdown dropdown-user dropdown">
                  <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                    <div class="avatar avatar-online">
                      <img src="/assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle"/>
                    </div>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="#">
                        <div class="d-flex">
                          <div class="flex-shrink-0 me-3">
                            <div class="avatar avatar-online">
                              <img src="/assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle"/>
                            </div>
                          </div>
                          <div class="flex-grow-1">
                            <span class="d-block">{{ user.first_name }} {{ user.last_name }}</span>
                            <small class="text-muted text-primary fw-semibold">Wallet: {{ walletBalance }}</small>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <div class="dropdown-divider"></div>
                    </li>
                    <li>
                      <NuxtLink class="dropdown-item" to="/profile">
                        <i class="bx bx-user me-2"></i>
                        <span class="align-middle">My Profile</span>
                      </NuxtLink>
                    </li>
                    <!--                    <li>-->
                    <!--                      <a class="dropdown-item" href="#">-->
                    <!--                        <i class="bx bx-cog me-2"></i>-->
                    <!--                        <span class="align-middle">Settings</span>-->
                    <!--                      </a>-->
                    <!--                    </li>-->
                    <li>
                      <div class="dropdown-divider"></div>
                    </li>
                    <li>
                      <a class="dropdown-item" @click.prevent="authLogout" style="cursor: pointer">
                        <i class="bx bx-power-off me-2"></i>
                        <span class="align-middle">Log Out</span>
                      </a>
                    </li>
                  </ul>
                </li>
                <!--/ User -->
              </ul>
            </div>
          </nav>

          <!-- / Navbar -->

          <!-- Content wrapper -->
          <div class="content-wrapper">
            <!-- Content -->

            <div class="container-xxl flex-grow-1 container-p-y" data-app>
              <Working :value="isWorking" :message="workingMessage"/>
              <RegistrationPaymentNotification :user="user"/>

              <Nuxt/>
            </div>
            <!-- / Content -->

            <!-- Footer -->
            <footer class="content-footer footer bg-footer-theme">
              <div class="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                <div class="mb-2 mb-md-0">
                  © {{ copy_right }}
                </div>
                <div>
                  <!--                  <a-->
                  <!--                    href=""-->
                  <!--                    target="_blank"-->
                  <!--                    class="footer-link me-4"-->
                  <!--                  >Support</a>-->
                </div>
              </div>
            </footer>
            <!-- / Footer -->

            <div class="content-backdrop fade"></div>
          </div>
          <!-- Content wrapper -->
        </div>
        <!-- / Layout page -->
      </div>

      <!-- Overlay -->
      <div class="layout-overlay layout-menu-toggle"></div>
    </div>
    <!-- / Layout wrapper -->

    <!--    <div class="buy-now">-->
    <!--      <a-->
    <!--        href="https://themeselection.com/products/sneat-bootstrap-html-admin-template/"-->
    <!--        target="_blank"-->
    <!--        class="btn btn-danger btn-buy-now"-->
    <!--      >Upgrade to Pro</a-->
    <!--      >-->
    <!--    </div>-->
  </div>
</template>

<script>
import {formatKobo, initMisc, reinitializeDropdowns} from "~/plugins/helpers/misc";
import Vue from "vue";

export default Vue.extend({
  name: "default.vue",
  data() {
    return {
      user: {username: {}},
      roleName: '',
      walletBalance: '',
      isFetchingUser: false,
      isWalletVisible: false,
      walletVisibilityIcon: 'show',
      copy_right: (new Date).getFullYear() + ' BiladamaData',
      navs: {
        data: [],
        sideBar: true,
        topBar: true
      }
    }
  },
  computed: {
    isWorking() {
      return this.$store.state.data.isWorking
    },
    workingMessage() {
      return this.$store.state.data.workingMessage
    }
  },
  watch: {
    $route(to, from) {
      console.log('Page changing...')

      this.pushPositionUpdateEvent(from, to)

      // Re-initialize dropdowns
      setTimeout(() => {
        if (typeof $().DataTable === "undefined") {
          // console.log('Reinitializing datatable...')

          // const scripts = [];
          // const body = document.querySelector('body')
          //
          // const first = document.createElement('script');
          // first.src = '/assets/js/jquery.dataTables.js'
          // scripts.push(first)
          //
          // const second = document.createElement('script');
          // second.src = '/assets/js/dataTables.bootstrap5.min.js'
          // scripts.push(second)

          // scripts.forEach(script => body.appendChild(script))
        }
        reinitializeDropdowns()
      }, 200)
    },
  },
  methods: {
    async authLogout() {
      await this.$auth.logout();
      await this.$router.push('/login');
    },

    pushPositionUpdateEvent(from, to) {
      if (this.$wsPhoenix) {
        this.$wsPhoenix.send('position_update', {from: from.path, to: to.path})
      }
    },

    toggleWalletVisibility() {
      this.isWalletVisible = !this.isWalletVisible
      this.walletVisibilityIcon = this.isWalletVisible ? 'show' : 'hide'

      localStorage.setItem('wallet_visibility', this.isWalletVisible)
    },

    switchMode() {

    },

    async fetchUserInfo(event) {
      if (event) {
        if (event.target.classList.contains('visibility-icon')) {
          return;
        }
      }

      this.isFetchingUser = true
      const user = await this.$auth.fetchUser()
      this.prepareUserInfo(user.data)
      this.isFetchingUser = false
    },

    prepareUserInfo(user) {
      if (!user) {
        window.location.reload();
        return;
      }

      if (user) {
        this.user = user

        this.roleName = ''
        this.navs.data = []
        this.walletBalance = formatKobo(user.wallet['amount'])

        user['roles'].forEach(role => {
          const navData = require(`~/plugins/navs/${user['frontend_layout']}.js`).default
          this.navs.data.push(...navData)

          this.roleName += (this.roleName.length ? '&middot' : '') + role.name.replaceAll('_', ' ').toLowerCase()
        })

        reinitializeDropdowns('sidebar-navs')
      }
    }
  },

  async mounted() {
    window.onNuxtReady((app) => {
      initToggler();
    })

    window.modals = {};

    this.prepareUserInfo(this.$auth.user)

    initMisc(this.$nuxt, window.$)

    const visibility = localStorage.getItem('wallet_visibility')
    this.isWalletVisible = 'true' === visibility || null === visibility

    $(() => {
      const menuItems = document.querySelectorAll('ul.nk-menu li');

      menuItems.forEach(menuItem => {
        menuItem.classList.remove('active');
        menuItem.classList.remove('current-page');
      })

      for (let i = 0; i < menuItems.length; i++) {
        const menuItem = menuItems.item(i);
        const link = menuItem.querySelector('a');

        if (link && link.getAttribute('href') === window.location.href) {
          menuItem.classList.add('active');
          menuItem.classList.add('current-page');
          return false;
        }
      }

      $('a.nk-menu-toggle:last').click()
      $('a.nk-menu-toggle:first').click().click()
    })

    // HANDLE SETTINGS & PROFILE SYNCHRONIZATION
    setInterval(async () => {
      const lastSync = localStorage.getItem('profile_last_sync')

      if (!lastSync) {
        const user = await this.$auth.fetchUser()
        this.prepareUserInfo(user.data)
        localStorage.setItem('profile_last_sync', Date.now().toString())
        return
      }

      const expected_expiry_time = (lastSync / 100) + 3000 // +2 minutes

      if ((Date.now() / 100) > expected_expiry_time) {
        this.fetchUserInfo();
        localStorage.setItem('profile_last_sync', Date.now().toString())
      }
    }, 15_000)

    if (this.$wsPhoenix) {
      this.$wsPhoenix.joinRoom('universal')
      this.$wsPhoenix.onOpen(() => {
        this.pushPositionUpdateEvent('/', this.$route.path)
      })
    }
  }
})
</script>

<style scoped>

</style>
