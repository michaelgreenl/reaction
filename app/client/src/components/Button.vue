<script setup>
import Loader from '@/components/Loader.vue';
import ChangingSpan from '@/components/ChangingSpan.vue';

defineProps({
    text: { type: String, default: null },
    showText: { type: Boolean, default: true },
    preset: { type: String, default: 'primary' },
    iconLeft: { type: Object, default: null },
    iconRight: { type: Object, default: null },
    isLoading: { type: Boolean, default: false },
    animateSpan: { type: Boolean, default: false },
});

defineEmits(['click']);
</script>

<template>
    <button :class="preset" :aria-label="text" @click="$emit('click')">
        <component :is="iconLeft" class="icon icon-left" />
        <span v-if="showText && !isLoading && !animateSpan">{{ text }}</span>
        <ChangingSpan v-if="showText && !isLoading && animateSpan" :text="text" />
        <Loader v-if="isLoading" />
        <component :is="iconRight" class="icon icon-right" />
    </button>
</template>

<style lang="scss" scoped>
button {
    cursor: pointer;
    border: 0;

    span {
        letter-spacing: 0.05em;
        white-space: nowrap;
    }

    &.primary,
    &.primary-alt,
    &.secondary {
        font-family: $primary-font-stack;
        border-radius: $border-radius-xs;
        transition: transform 0.1s ease-in;

        &:hover {
            transform: scale(1.05);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    &.primary,
    &.primary-alt {
        font-style: oblique;
        background: transparent;
    }

    &.primary {
        color: $color-bg-secondary;
        text-shadow: 1px 1px 2px #0003;

        &:disabled {
            color: #dee2e699;
        }
    }

    &.primary-alt {
        color: $color-accent;

        &:disabled {
            color: $color-gray3;
        }
    }

    &.secondary {
        padding: $size-2 $size-4;
        color: $color-gray1;
        background: $color-accent;

        &:disabled {
            color: $color-gray3;
            background: $color-gray5;
        }
    }

    &.icon-only {
        @include flexCenterAll;

        padding: 0.6em;
        background: $color-bg-secondary;
        border-radius: 20px;
        transition: background 0.1s ease;
    }

    :deep(.loading-wrapper) {
        .changing-span-wrapper {
            width: 5.2ch;
        }
    }
}
</style>
