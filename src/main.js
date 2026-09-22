import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { vReveal } from './composables/useReveal'

createApp(App).directive('reveal', vReveal).mount('#app')
