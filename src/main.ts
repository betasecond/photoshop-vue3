import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Varlet from '@varlet/ui'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) //use pinia
app.use(router) //use router
app.use(Varlet) // use Varlet
app.mount('#app')
