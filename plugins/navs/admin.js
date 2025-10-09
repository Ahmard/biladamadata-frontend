export default [
  {
    url: '/admin/agents',
    name: 'Agents',
    icon: 'user-list-fill',
    slug: '',
  },
  {
    url: '',
    name: 'Premium Payments',
    icon: 'sign-kobo-alt',
    slug: '',
    submenu: [
      {
        url: '/admin/premium-payments',
        name: 'Payments List',
      },
      {
        url: '/admin/premium-payments/manual-capture',
        name: 'Manual Capture',
      },
    ],
  },
  {
    url: '/notifications',
    name: 'Notifications',
    icon: 'bell',
    slug: '',
  },
]
