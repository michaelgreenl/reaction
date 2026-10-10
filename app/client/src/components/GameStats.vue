<script setup>
import { formatTime } from '@/utils/time.js';

defineProps({
    score: { type: Number, required: true },
    time: { type: Number, required: true },
    adjustTimeSize: { type: Boolean, default: false },
});

// Hacky solution for preventing the changing time value from changing width of parent element
function timeValueSize(timeMs) {
    const seconds = timeMs / 1000;

    if (seconds >= 60) {
        return '1.8ch';
    } else if (seconds >= 20) {
        return '2.8ch';
    } else {
        return '2.4ch';
    }
}
</script>

<template>
    <div class="stat-wrapper">
        <span class="label">Score:</span>
        <span class="stat">{{ score }}</span>
    </div>
    <span> | </span>
    <div class="stat-wrapper">
        <span class="label">Time:</span>
        <span
            class="stat"
            :style="{
                width: adjustTimeSize ? timeValueSize(time) : '',
                paddingRight: adjustTimeSize && timeValueSize(time) !== '1.8ch' ? '1.1em' : '',
            }"
            >{{ formatTime(time) }}</span
        >
    </div>
</template>

<style lang="scss" scoped>
span {
    position: relative;
    z-index: 2;
    font-size: 0.5em;
    font-weight: 500;
    color: $color-gray3;
}

.stat-wrapper {
    position: relative;
    z-index: 2;
    display: flex;
    gap: $size-1;

    span {
        font-size: 1em !important;
        line-height: 1.6ch;
        color: $color-text-secondary-dark;

        &.label {
            color: $color-accent;
        }
    }
}
</style>
