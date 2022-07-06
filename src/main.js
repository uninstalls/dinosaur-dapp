import Vue from 'vue';
import App from './App.vue';
import router from './router';

import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import swal from 'sweetalert2';
import Web3 from 'web3';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

const i18n = new VueI18n({
  locale: 'en_US',
  messages: {
    'en_US': require('./lang/language-en_US.json')
  }
});

const toast = (msg, icon) => {
  swal.fire({
    toast: true,
    icon: icon || 'error',
    text: msg || 'Something Wrong ...',
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
}

Vue.prototype.$toast = toast;
// Vue.config.errorHandler = (err) => {
//   toast(err.message);
// }

// window.addEventListener('unhandledrejection', (err) => {
//   toast(err.reason)
// });

const store = new Vuex.Store({
  state: {
    accounts: undefined,
    networkId: undefined,
    isConnected: false,
    web3: new Web3('http://127.0.0.1:8545')
  }
});

new Vue({
  el: '#app',
  router,
  render: h => h(App),
  i18n,
  store
});
