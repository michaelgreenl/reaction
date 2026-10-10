import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import apiFetch from '@/api.js';
import { useAuthStore } from '@/stores/authStore.js';

export const useSettingsStore = defineStore('settings', () => {
    const circleSize = ref(85);
    const spawnInterval = ref(1);
    const shrinkTime = ref(1);
    const settingsKeyVal = reactive({
        circleSize: 'Circle Size',
        spawnInterval: 'Spawn Interval',
        shrinkTime: 'Shrink Time',
    });
    const authStore = useAuthStore();

    async function setSettings(settings) {
        if (!authStore.isAuthenticated) return;

        try {
            const userId = authStore.user.id;
            await apiFetch('/settings', {
                method: 'PUT',
                body: { userId, ...settings },
            });
            return { success: true };
        } catch (error) {
            console.error('Settings update failed:', error.message);
            return { success: false, message: error.message };
        }
    }

    async function getSettings() {
        if (!authStore.isAuthenticated) return;

        try {
            const userId = authStore.user.id;
            const settings = await apiFetch(`/settings?userId=${userId}`, {
                method: 'GET',
            });

            circleSize.value = settings.circleSize;
            spawnInterval.value = settings.spawnInterval;
            shrinkTime.value = settings.shrinkTime;

            return { success: true };
        } catch (error) {
            console.error('Settings fetch failed:', error.message);
            return { success: false, message: error.message };
        }
    }

    return { circleSize, spawnInterval, shrinkTime, setSettings, getSettings, settingsKeyVal };
});
