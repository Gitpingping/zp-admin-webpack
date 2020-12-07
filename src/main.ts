import { createApp } from 'vue'
import App from './App'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './registerServiceWorker'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).use(Antd).mount('#app')
