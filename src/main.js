import Vue from 'vue'
import App from './App.vue'
import * as io from "socket.io-client";
import VueSocketIO from "vue-socket.io";
import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from '@/router/index.js';
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSession from 'vue-session';

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install .the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);

Vue.use(VueSession, {
  expires: 3600,
  persist: true
});

Vue.config.productionTip = false

let  url = "ws://localhost:50515/"
if (process.env.NODE_ENV.toLowerCase() === "production") {
  url = "ws://vogprc-be.herokuapp.com/"
}
var vueSocketIO = new VueSocketIO({
  connection: io(url, {
    transports: ["websocket"]
  }),
  rejectUnauthorized: false,
  persist: true,
  url: url,
  transports: ["websocket", "flashsocket"]
});

Vue.use(
    vueSocketIO,
    io(url, {
      transports: ["websocket", "flashsocket"]
    }),
);

new Vue({
  router,
  sockets: {
    connect: function () {
      console.log("Connected to backend.");
    },
    error: function (err) {
      console.log(err);
    }
  },

  render: h => h(App)
}).$mount("#app");
