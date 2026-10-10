<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAuthStore } from '@/stores/authStore';
import { useBreakpoints } from '@/composables/useBreakpoints.js';
import { gsap } from 'gsap';
import Button from '@/components/Button.vue';
import Circle from '@/components/Circle.vue';
import RangeInput from '@/components/Inputs/Range.vue';
import NumberInput from '@/components/Inputs/Number.vue';
import CloseIcon from '@/components/Icons/CloseSVG.vue';

const props = defineProps({
    showSettings: { type: Boolean, required: true },
    gamePlayed: { type: Boolean, default: false },
});

const emit = defineEmits(['startingCloseSettings', 'closeSettings']);

const { isMobile } = useBreakpoints();

const settingsStore = useSettingsStore();
const authStore = useAuthStore();

const settingsCircleRef = ref(null);

const isLoading = ref(false);
const rangeInputActive = ref(false);

const localSettings = reactive({
    circleSize: settingsStore.circleSize,
    spawnInterval: settingsStore.spawnInterval,
    shrinkTime: settingsStore.shrinkTime,
});

const settingsChanged = computed(() => {
    return (
        localSettings.circleSize !== settingsStore.circleSize ||
        localSettings.spawnInterval !== settingsStore.spawnInterval ||
        localSettings.shrinkTime !== settingsStore.shrinkTime
    );
});

onMounted(async () => {
    if (authStore.isAuthenticated) {
        await settingsStore.getSettings();
        resetLocalSettings();
    }
});

watch(
    () => props.showSettings,
    async (newVal) => {
        if (newVal) {
            await nextTick();
            openSettingsAnim();
        }
    },
);

function resetLocalSettings() {
    localSettings.circleSize = settingsStore.circleSize;
    localSettings.spawnInterval = settingsStore.spawnInterval;
    localSettings.shrinkTime = settingsStore.shrinkTime;
}

async function saveSettings() {
    if (!settingsChanged.value) return;

    isLoading.value = true;
    await settingsStore.setSettings({ ...localSettings }).then(() => {
        settingsStore.$patch({ ...localSettings });
        isLoading.value = false;
    });
}

function closeSettings() {
    if (settingsChanged.value) {
        resetLocalSettings();
    }

    isLoading.value = false;

    emit('startingCloseSettings');
    closeSettingsAnim();
    emit('closeSettings');

    // Closing circle since going going back to end-screen (where the circle doesn't show)
    if (props.gamePlayed) {
        settingsCircleRef.value.closeCircle();
    }
}

async function openSettingsAnim({ tl = gsap.timeline() } = {}) {
    tl.to(
        '.form-container',
        {
            duration: 0.3,
            ease: 'power3.out',
            opacity: 1,
            height: '12.25em',
            width: '22em',
            marginTop: '1.5em',
            marginRight: !isMobile.value ? '2em' : 0,
        },
        0,
    ).to('.form-header, .form-hr, .form-group', { duration: 0.1, ease: 'circ', stagger: 0, opacity: 1 }, 0.1);

    // Opening circle since coming from end-screen (where the circle doesn't show)
    if (props.gamePlayed) {
        await nextTick();
        settingsCircleRef.value.openCircle();
    }
}

function closeSettingsAnim({ tl = gsap.timeline(), onComplete = () => {} } = {}) {
    tl.to('.form-header, .form-hr, .form-group', { duration: 0.1, ease: 'power3.in', opacity: 0 })
        .to('.form-group', { duration: 0.1, ease: 'power3.in', stagger: 0.1, opacity: 0 })
        .to(
            '.form-container',
            {
                duration: 0.3,
                ease: 'power3.in',
                marginTop: 0,
                marginRight: 0,
                opacity: 0,
                height: 0,
                width: 0,
                onComplete,
            },
            0,
        );
}

defineExpose({ saveSettings, resetLocalSettings, settingsChanged, isLoading, closeSettings, closeSettingsAnim });
</script>

<template>
    <div class="settings-container">
        <div class="form-circle">
            <form v-if="showSettings" class="form-container psuedo-border" @submit.prevent="saveSettings">
                <div class="form-header">
                    <h2>Settings</h2>
                    <Button class="close-button" preset="icon-only" :icon-left="CloseIcon" @click="closeSettings()" />
                </div>
                <hr class="form-hr" />
                <div class="form-group">
                    <label for="circleSize">Circle Size</label>
                    <RangeInput
                        id="circleSize"
                        v-model="localSettings.circleSize"
                        :min="25"
                        :max="125"
                        :disabled="isLoading"
                        @mousedown="rangeInputActive = true"
                        @mouseup="rangeInputActive = false"
                    />
                </div>
                <div class="form-group">
                    <label for="spawnInterval">Spawn Interval</label>
                    <NumberInput
                        v-model="localSettings.spawnInterval"
                        :step-up-disabled="isLoading || localSettings.spawnInterval >= 2"
                        :step-down-disabled="isLoading || localSettings.spawnInterval === 0.25"
                        @step-up="localSettings.spawnInterval += 0.25"
                        @step-down="localSettings.spawnInterval -= 0.25"
                    />
                </div>
                <div class="form-group">
                    <label for="shrinkTime">Shrink Time</label>
                    <NumberInput
                        v-model="localSettings.shrinkTime"
                        :step-up-disabled="isLoading || localSettings.shrinkTime >= 2"
                        :step-down-disabled="isLoading || localSettings.shrinkTime === 0.25"
                        @step-up="localSettings.shrinkTime += 0.25"
                        @step-down="localSettings.shrinkTime -= 0.25"
                    />
                </div>
            </form>
            <Circle
                v-if="!gamePlayed || showSettings"
                ref="settingsCircleRef"
                class="settings-circle"
                :game-active="true"
                :game-circle="false"
                :local-size="localSettings.circleSize"
                :input-active="rangeInputActive"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.settings-container {
    @include flexCenterAll;

    flex-direction: column;
}

.form-circle {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    margin-bottom: $size-4;
    font-size: 0.95em;

    @include bp-sm-phone {
        flex-direction: row;
    }
}

.form-container {
    width: 22em;
    width: 0;
    height: 0;
    padding: $size-4 $size-6 $size-3;
    overflow: hidden;
    opacity: 0;
}

.form-header {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    opacity: 0;

    h2 {
        margin: 0;
        font-size: 1.4em;
        color: $color-accent;
    }

    .close-button {
        &:hover {
            background: #ec6e9e22;
        }

        :deep(.icon) {
            width: 0.9em;
            height: 0.9em;
            stroke: $color-accent;

            path {
                stroke-width: 14 !important;
            }

            @include bp-xxl-desktop {
                font-size: 1.2em;
            }
        }
    }
}

.form-hr {
    position: relative;
    z-index: 2;
    height: 1px;
    margin: $size-2 0;
    background-color: $color-primary-light;
    border: 0;
    opacity: 0;
}

.form-group {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $size-1;
    opacity: 0;
    transition: opacity 0.3s ease;

    label {
        font-size: 0.9em;
        color: $color-text-secondary-dark;
    }

    input[type='range'] {
        width: 40% !important;
    }

    :deep(.number-input) {
        span {
            font-size: 0.85em;
        }
    }
}
</style>
