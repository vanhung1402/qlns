import Vue from 'vue'
import App from './app'
import router from '@router'
import store from '@state/store'
import '@components/_globals'

import BootstrapVue from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import Vuelidate from 'vuelidate'
import VueMask from 'v-mask'
import vco from 'v-click-outside'
import VueRouter from 'vue-router'
import VueFeather from 'vue-feather'
import flatPickr from 'vue-flatpickr-component'

import DisableAutocomplete from '@aacassandra/vue-disable-autocomplete'
import VueSweetalert2 from 'vue-sweetalert2'

import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
import 'sweetalert2/dist/sweetalert2.min.css'

import axios from 'axios'

const recruitmentApi = axios.create({
  baseURL: process.env.RECRUITMENT_API_URL ? process.env.RECRUITMENT_API_URL : 'http://localhost:3001/',
})

const authenticateApi = axios.create({
  baseURL: process.env.AUTHENTICATE_API_URL ? process.env.AUTHENTICATE_API_URL : 'http://authenticate-service:3000/',
})

const staffApi = axios.create({
  baseURL: process.env.STAFF_API_URL ? process.env.STAFF_API_URL : 'http://localhost:3003/',
})

window.toastr = require('toastr')

Vue.prototype.$recruitment = recruitmentApi
Vue.prototype.$authenticate = authenticateApi
Vue.prototype.$staff = staffApi
Vue.use(VueToastr2)
Vue.use(VueSweetalert2)
Vue.use(DisableAutocomplete)
Vue.use(VueFeather)
Vue.use(flatPickr)

Vue.use(VueRouter)
Vue.use(vco)

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'

// If running inside Cypress...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Ensure tests fail when Vue emits an error.
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}

Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(VueMask)

Vue.component('apexchart', VueApexCharts)

// Uncomment this if you are having api served through other url or do not want to use fake backend
// Vue.prototype.$http = require('axios')
// Vue.prototype.$http.defaults.baseURL  = 'http://mock-api.coderthemes.com/'

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

// If running e2e tests...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`.
  window.__app__ = app
}
