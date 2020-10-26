import 'normalize.css/normalize.css'
import "@/assets/scss/main.scss";
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate';

Vue.use(Vuelidate)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
