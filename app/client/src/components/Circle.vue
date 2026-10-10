<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { useSettingsStore } from '@/stores/settingsStore';

const props = defineProps({
    gameActive: { type: Boolean },
    gameCircle: { type: Boolean, default: true },
    localSize: { type: [String, Number], default: null },
    inputActive: { type: Boolean },
});

const emit = defineEmits(['click', 'endGame']);

const settingsStore = useSettingsStore();

const animating = ref(false);
const paused = ref(false);

onMounted(() => {
    if (props.gameCircle) {
        animating.value = true;
    } else {
        openCircle();
    }
});

function circleClick() {
    paused.value = true;
    emit('click');
}

function openCircle({ tl = gsap.timeline() } = {}) {
    tl.to('.circle', {
        duration: 0.3,
        ease: 'power3.out',
        scale: 1,
        opacity: 1,
    });
}

function closeCircle({ tl = gsap.timeline() } = {}) {
    tl.to('.circle', {
        duration: 0.2,
        ease: 'power3.in',
        scale: 0,
        opacity: 0,
    });
}

defineExpose({ openCircle, closeCircle });
</script>

<template>
    <div
        class="circle"
        :class="`${!gameCircle ? 'start-circle' : undefined}`"
        :style="{
            height: `${localSize ? localSize : settingsStore.circleSize}px`,
            width: `${localSize ? localSize : settingsStore.circleSize}px`,
        }"
    >
        <button
            :class="{ animate: animating, 'fade-out': paused || !gameActive }"
            :style="{
                animationDuration: `${settingsStore.shrinkTime}s`,
                height: `${localSize ? localSize : settingsStore.circleSize}px`,
                width: `${localSize ? localSize : settingsStore.circleSize}px`,
            }"
            @mousedown="gameCircle ? circleClick() : null"
            @animationend="$emit('endGame')"
        >
            <span v-if="inputActive && localSize >= 50" :style="{ fontSize: localSize >= 65 ? '1.2em' : '1em' }"
                >{{ localSize }}px</span
            >
        </button>
        <span v-if="inputActive && localSize < 50" class="outer-value">{{ localSize }}px</span>
    </div>
</template>

<style lang="scss" scoped>
.circle {
    position: relative;
    @include flexCenterAll;

    &.start-circle {
        opacity: 0;
        transform: scale(0);
    }

    span {
        font-family: $primary-font-stack;
        font-weight: 500;
        color: $color-text-secondary-dark;

        &.outer-value {
            position: absolute;
            right: -$size-11;
            color: $color-text-primary-light;
            text-shadow: 1px 1px 2px #0003;
        }
    }

    button {
        background-color: $color-bg-secondary;
        border: 0;
        border-radius: 100%;
        box-shadow: 1px 2px 3px #0001;
        opacity: 1;
        transition: opacity 0.3s ease;

        @keyframes shrink {
            0% {
                transform: scale(1);
            }

            100% {
                transform: scale(0.1);
            }
        }

        &.animate {
            animation-name: shrink;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
        }

        &.fade-out {
            opacity: 0;
            animation-play-state: paused;
        }
    }
}
</style>
