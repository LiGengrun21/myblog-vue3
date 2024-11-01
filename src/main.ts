import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // register pinia
app.use(router)
app.use(ElementPlus)
app.use(CkeditorPlugin)

app.mount('#app')
