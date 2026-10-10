import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import { useAuthStore } from '@/stores/authStore';

const app = createApp(App);
const pinia = createPinia();

pinia.use(({ store }) => {
    store.$router = router;
});

app.use(pinia);
app.use(router);

const authStore = useAuthStore();
await authStore.initializeAuth();

app.mount('#app');
