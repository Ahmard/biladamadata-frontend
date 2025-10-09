export default [
  {
    url: '/admin/funding-history',
    name: 'Funding History',
    icon: 'dollar-circle',
    slug: '',
  },
  {
    url: '/admin/referrals',
    name: 'Referral System',
    icon: 'layer-plus',
    slug: '',
  },
  {
    url: '/admin/network-providers',
    name: 'Network Providers',
    icon: 'globe-alt',
    slug: '',
  },
  {
    url: '',
    name: 'Airtime Management',
    icon: 'vector',
    slug: '',
    submenu: [
      {
        url: '/admin/airtime/transactions',
        name: 'Airtime Transactions',
      },
    ],
  },
  {
    url: '',
    name: 'Data Management',
    icon: 'network-chart',
    slug: '',
    submenu: [
      {
        url: '/admin/data-plans',
        name: 'Data Plans',
      },
      {
        url: '/admin/data-plan-categories',
        name: 'Data Plan Categories',
      },
      {
        url: '/admin/data/transactions',
        name: 'Data Transactions',
      },
    ],
  },
  {
    url: '',
    name: 'Beneficiaries',
    icon: 'user-check',
    slug: '',
    submenu: [
      {
        url: '/admin/beneficiaries',
        name: 'Beneficiaries',
      },
    ],
  },
  {
    url: '',
    name: 'User Management',
    icon: 'user-circle',
    slug: '',
    submenu: [
      {
        url: '/admin/users',
        name: 'Users',
      },
      {
        url: '/admin/merchants',
        name: 'Merchants',
      },
      {
        url: '/admin/resellers',
        name: 'Resellers',
      },
      {
        url: '/admin/wallets',
        name: 'Wallets',
      },
      {
        url: '/admin/van-requests',
        name: 'VAN Requests',
      },
      {
        url: '/admin/bvn',
        name: 'BVN Numbers',
      },
      {
        url: '/admin/users/auth-attempts',
        name: 'Auth Attempts',
      },
      {
        url: '/admin/users/live-tracker',
        name: 'Live Tracking',
      },
    ],
  },
  {
    url: '',
    name: 'Mailing System',
    icon: 'mail-send',
    slug: '',
    submenu: [
      {
        url: '/admin/mailing/send',
        name: 'Send New',
      },
    ],
  },
  {
    url: '',
    name: 'System Setup',
    icon: 'cog',
    slug: '',
    submenu: [
      {
        url: '/admin/settings',
        name: 'Settings',
      },
    ],
  },
  {
    url: '',
    name: 'Admin Airtime',
    icon: 'intersect',
    slug: '',
    submenu: [
      {
        url: '/airtime/buy',
        name: 'Buy Airtime',
      },
      {
        url: '/airtime',
        name: 'Transactions',
      },
    ],
  },
  {
    url: '',
    name: 'Admin Data Bundle',
    icon: 'unite',
    slug: '',
    submenu: [
      {
        url: '/data/buy',
        name: 'Buy Data',
      },
      {
        url: '/data',
        name: 'Transactions',
      },
    ],
  },
  {
    url: '',
    name: 'Admin Wallet',
    icon: 'wallet',
    slug: '',
    submenu: [
      {
        url: '/wallet',
        name: 'Wallet',
      },
      {
        url: '/wallet/fund',
        name: 'Fund Wallet',
      },
      {
        url: '/wallet/funding-history',
        name: 'Funding History',
      },
    ],
  },
  {
    url: '/beneficiaries',
    name: 'Admin Beneficiaries',
    icon: 'user-circle',
    slug: '',
  },
  {
    url: '/notifications',
    name: 'Admin Notifications',
    icon: 'bell',
    slug: '',
  },
]
