<template>
  <div class="app">
    <!-- Navbar -->
    <nav class="navbar" :class="{ scrolled: scrolled }">
      <div class="nav-container">
        <div class="logo">BiladamaData</div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <span v-if="!mobileMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>

        <!-- Desktop Navigation -->
        <ul class="nav-links desktop-nav">
          <li><a @click="scrollTo('services')">Services</a></li>
          <li><a @click="scrollTo('features')">Features</a></li>
          <li><a @click="scrollTo('contact')">Contact</a></li>
          <li><a @click="scrollTo('download')">Download</a></li>
          <li><button class="btn-primary" @click="openModal">Login</button></li>
        </ul>

        <!-- Mobile Navigation -->
        <transition name="slide">
          <div v-if="mobileMenuOpen" class="mobile-nav">
            <ul class="mobile-nav-links">
              <li><a @click="scrollTo('services'); mobileMenuOpen = false">Services</a></li>
              <li><a @click="scrollTo('features'); mobileMenuOpen = false">Features</a></li>
              <li><a @click="scrollTo('contact'); mobileMenuOpen = false">Contact</a></li>
              <li><a @click="scrollTo('download'); mobileMenuOpen = false">Download</a></li>
              <li><button class="btn-primary btn-block" @click="openModal; mobileMenuOpen = false">Login</button></li>
            </ul>
          </div>
        </transition>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1>Your Complete Service Platform</h1>
          <p>Buy airtime & data, pay electricity bills, subscribe to cable TV, and more - all in one place</p>
          <div class="hero-buttons">
            <button class="btn-primary" @click="openModal">Get Started</button>
            <button class="btn-secondary" @click="scrollTo('services')">Learn More</button>
          </div>
        </div>
        <div class="hero-image">
          <div class="phone-mockup">
            <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="280" height="580" rx="40" fill="white" stroke="#667eea" stroke-width="3"/>
              <rect x="30" y="80" width="240" height="480" rx="15" fill="#f8f9fa"/>
              <circle cx="150" cy="45" r="8" fill="#667eea"/>
              <rect x="110" y="35" width="80" height="20" rx="10" fill="#e2e8f0"/>
              <rect x="50" y="120" width="200" height="80" rx="15" fill="url(#grad1)"/>
              <rect x="50" y="220" width="95" height="100" rx="15" fill="#667eea" opacity="0.2"/>
              <rect x="155" y="220" width="95" height="100" rx="15" fill="#764ba2" opacity="0.2"/>
              <rect x="50" y="340" width="95" height="100" rx="15" fill="#667eea" opacity="0.3"/>
              <rect x="155" y="340" width="95" height="100" rx="15" fill="#764ba2" opacity="0.3"/>
              <defs>
                <linearGradient id="grad1" x1="50" y1="120" x2="250" y2="200">
                  <stop offset="0%" stop-color="#667eea"/>
                  <stop offset="100%" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
      <div class="services-container">
        <div class="section-title">
          <h2>Powerful Features</h2>
          <p>Everything you need to manage your daily services</p>
        </div>
        <div class="services-grid">
          <div class="service-card" v-for="service in services" :key="service.id">
            <div class="service-icon">{{ service.icon }}</div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <ul class="service-features">
              <li v-for="(feature, index) in service.features" :key="index">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="services-container">
        <div class="section-title">
          <h2>Why Choose BiladamaData?</h2>
          <p>Experience seamless service delivery like never before</p>
        </div>
        <div class="features-grid">
          <div class="feature-item" v-for="(feature, index) in whyChoose" :key="index">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Data Plans Section -->
    <section class="data-plans">
      <div class="services-container">
        <div class="section-title">
          <h2>Affordable Data Plans</h2>
          <p>Choose from our cheapest data plans - always delivered, never fails!</p>
        </div>

        <div class="network-tabs">
          <button
            v-for="network in dataPlans"
            :key="network.network"
            class="network-tab"
            :class="{ active: selectedNetwork === network.network }"
            @click="selectedNetwork = network.network">
            {{ network.network }}
          </button>
        </div>

        <div class="plans-grid">
          <div
            class="plan-card"
            v-for="(plan, index) in currentPlans"
            :key="index"
            @click="buyPlan(plan)">
            <div class="plan-size">{{ plan.size }}</div>
            <div class="plan-validity">{{ plan.validity }}</div>
            <div class="plan-price">₦{{ plan.price.toLocaleString() }}</div>
            <div class="plan-badge">Instant Delivery</div>
            <button class="buy-now-btn">Buy Now</button>
          </div>
        </div>

        <div class="guarantee-badge">
          <strong>✓ 100% Transaction Success Guarantee</strong>
          <div>Our transactions never fail. Instant delivery or immediate refund!</div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <div class="services-container">
        <div class="section-title">
          <h2>Get In Touch</h2>
          <p>We're here to help you 24/7</p>
        </div>
        <div class="contact-container">
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">📞</div>
              <div class="contact-details">
                <h4>Phone</h4>
                <p>Call us anytime, we're always available</p>
                <a href="tel:+2348145579433">+234 814 557 9433</a><br>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon">✉️</div>
              <div class="contact-details">
                <h4>Email</h4>
                <p>Send us an email, we'll respond within 24 hours</p>
                <a href="mailto:noreply@biladamadata.com">noreply@biladamadata.com</a><br>
                <a href="mailto:info@biladamadata.com">info@biladamadata.com</a>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon">📍</div>
              <div class="contact-details">
                <h4>Address</h4>
                <p>Visit our office during business hours</p>
                <p><strong>No 7, Kaduna Street, Sabo Pegi Lafia, Nasarawa State</strong></p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Mon - Fri: 9:00 AM - 6:00 PM<br>
                  Sat: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          <div class="map-container">
            <iframe
              class="map-frame"
              :src="mapAddress"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
            <div class="map-overlay">
              <h4>BiladamaData Office</h4>
              <p>Lafia, Nasarawa State</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="download" class="cta">
      <h2>Get Started Today</h2>
      <p>Download our mobile app or login to our web platform</p>
      <div class="app-badges">
        <div class="app-badge" @click="openModal">
          <div class="app-badge-icon">🌐</div>
          <div class="app-badge-text">
            <small>Access via</small>
            <strong>Web Platform</strong>
          </div>
        </div>
        <div class="app-badge">
          <div class="app-badge-icon">📱</div>
          <div class="app-badge-text">
            <small>Download on</small>
            <strong>App Store</strong>
          </div>
        </div>
        <div class="app-badge">
          <div class="app-badge-icon">🤖</div>
          <div class="app-badge-text">
            <small>Get it on</small>
            <strong>Google Play</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h4>BiladamaData</h4>
          <p>Your trusted platform for all digital services. Fast, secure, and reliable.</p>
          <div style="margin-top: 1rem;">
            <p><strong>📞</strong> +234 814 557 9433</p>
            <p><strong>✉️</strong> noreply@biladamadata.com</p>
          </div>
        </div>
        <div class="footer-section">
          <h4>Services</h4>
          <ul>
            <li><a href="#">Data & Airtime</a></li>
            <li><a href="#">Electricity Bills</a></li>
            <li><a href="#">Cable Subscription</a></li>
            <li><a href="#">More Services</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a @click="scrollTo('contact')">Contact</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 BiladamaData. All rights reserved.</p>
      </div>
    </footer>

    <!-- Login Modal -->
    <transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <button class="modal-close" @click="closeModal">&times;</button>
          <h3>Welcome Back</h3>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>Email or Phone</label>
              <input type="text" v-model="loginForm.username" placeholder="Enter your email or phone" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" v-model="loginForm.password" placeholder="Enter your password" required>
            </div>
            <button type="submit" class="btn-primary btn-block">Login</button>
          </form>
          <p style="text-align: center; margin-top: 1.5rem; color: #718096;">
            Don't have an account? <a href="#" style="color: #667eea; font-weight: 600;">Sign up</a>
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import "assets/css/landing.css";

export default {
  name: 'BiladamaData',
  auth: 'guest',
  layout: 'extra_stripped',
  data() {
    const encodedAddress = encodeURIComponent('No 7, Kaduna Street, Sabo Pegi Lafia, Nasarawa State');
    return {
      scrolled: false,
      showModal: false,
      mobileMenuOpen: false,
      mapAddress: `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`,
      loginForm: {
        username: '',
        password: ''
      },
      services: [
        {
          id: 1,
          icon: '📱',
          title: 'Data & Airtime',
          description: 'Buy data and airtime seamlessly for all major networks with instant delivery.',
          features: [
            'All networks supported',
            'Instant delivery',
            'Automated recharge',
            'Bulk purchase available'
          ]
        },
        {
          id: 2,
          icon: '⚡',
          title: 'Electricity Purchase',
          description: 'Pay for your electricity bills quickly and conveniently from anywhere.',
          features: [
            'All DISCOs supported',
            'Instant token delivery',
            'Payment history',
            'Auto-reminders'
          ]
        },
        {
          id: 3,
          icon: '📺',
          title: 'Cable Subscription',
          description: 'Subscribe to your favorite cable TV packages without hassle.',
          features: [
            'DSTV, GOTV, Startimes',
            'Flexible packages',
            'Instant activation',
            'Renewal reminders'
          ]
        },
        {
          id: 4,
          icon: '🎓',
          title: 'Education Services',
          description: 'Purchase exam pins and educational tokens for WAEC, NECO, JAMB, and more.',
          features: [
            'All exam boards',
            'Instant PIN delivery',
            'Bulk purchase',
            'Result checking'
          ]
        },
        {
          id: 5,
          icon: '🌐',
          title: 'Internet Services',
          description: 'Subscribe to internet services from Smile, Spectranet, and other providers.',
          features: [
            'Multiple providers',
            'Flexible data plans',
            'Instant activation',
            'Usage monitoring'
          ]
        },
        {
          id: 6,
          icon: '💳',
          title: 'Bill Payments',
          description: 'Pay all your utility bills and subscriptions in one convenient place.',
          features: [
            'Water bills',
            'Waste management',
            'Insurance premiums',
            'Government payments'
          ]
        }
      ],
      whyChoose: [
        {
          icon: '🚀',
          title: 'Instant Processing',
          description: 'All transactions are processed instantly with real-time confirmation'
        },
        {
          icon: '🔒',
          title: 'Secure & Safe',
          description: 'Bank-level security with encrypted transactions and data protection'
        },
        {
          icon: '💰',
          title: 'Cheapest Data Plans',
          description: 'Industry-leading prices with the most affordable data plans in the market'
        },
        {
          icon: '✅',
          title: '100% Success Rate',
          description: 'Our transactions never fail - guaranteed delivery or instant refund'
        }
      ],
      dataPlans: [
        {
          network: 'MTN',
          plans: [
            { size: '500MB', validity: '30 Days', price: 150 },
            { size: '1GB', validity: '30 Days', price: 280 },
            { size: '2GB', validity: '30 Days', price: 560 },
            { size: '3GB', validity: '30 Days', price: 840 },
            { size: '5GB', validity: '30 Days', price: 1400 },
            { size: '10GB', validity: '30 Days', price: 2800 }
          ]
        },
        {
          network: 'Airtel',
          plans: [
            { size: '500MB', validity: '30 Days', price: 145 },
            { size: '1GB', validity: '30 Days', price: 275 },
            { size: '2GB', validity: '30 Days', price: 550 },
            { size: '3GB', validity: '30 Days', price: 825 },
            { size: '5GB', validity: '30 Days', price: 1375 },
            { size: '10GB', validity: '30 Days', price: 2750 }
          ]
        },
        {
          network: 'Glo',
          plans: [
            { size: '500MB', validity: '30 Days', price: 140 },
            { size: '1GB', validity: '30 Days', price: 270 },
            { size: '2GB', validity: '30 Days', price: 540 },
            { size: '3GB', validity: '30 Days', price: 810 },
            { size: '5GB', validity: '30 Days', price: 1350 },
            { size: '10GB', validity: '30 Days', price: 2700 }
          ]
        },
        {
          network: '9mobile',
          plans: [
            { size: '500MB', validity: '30 Days', price: 155 },
            { size: '1GB', validity: '30 Days', price: 285 },
            { size: '2GB', validity: '30 Days', price: 570 },
            { size: '3GB', validity: '30 Days', price: 855 },
            { size: '5GB', validity: '30 Days', price: 1425 },
            { size: '10GB', validity: '30 Days', price: 2850 }
          ]
        }
      ],
      selectedNetwork: 'MTN'
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  computed: {
    currentPlans() {
      const network = this.dataPlans.find(n => n.network === this.selectedNetwork);
      return network ? network.plans : [];
    }
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 50;
    },
    scrollTo(id) {
      this.mobileMenuOpen = false;
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    },
    openModal() {
      this.showModal = true;
      this.mobileMenuOpen = false;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.showModal = false;
      document.body.style.overflow = 'auto';
    },
    handleLogin() {
      alert('Login functionality would be connected to your backend API here!');
      console.log('Login attempted with:', this.loginForm);
      this.closeModal();
    },
    buyPlan(plan) {
      alert(`You selected ${plan.size} for ₦${plan.price} on ${this.selectedNetwork}\n\nLogin to complete your purchase!`);
      this.openModal();
    }
  }
};
</script>

<style scoped></style>
