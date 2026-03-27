import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vant from 'vant';
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all.min.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Vant)

app.mount('#app')
