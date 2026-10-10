<script setup>
import { ref, onBeforeUnmount } from 'vue';

const props = defineProps({
    id: { type: String, required: true },
    modelValue: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    showValue: { type: Boolean, default: false },
    inputActive: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'mousedown', 'mouseup']);

const rangeInput = ref(null);

const isActive = ref(false);

function onPointerDown(e) {
    isActive.value = true;
    emit('mousedown', e);
    window.addEventListener('pointerup', onGlobalPointerUp, { once: true });
    window.addEventListener('mouseup', onGlobalPointerUp, { once: true });
    window.addEventListener('touchend', onGlobalPointerUp, { once: true });
}

function onGlobalPointerUp(e) {
    if (isActive.value) {
        isActive.value = false;
        emit('mouseup', e);
    }
}

onBeforeUnmount(() => {
    window.removeEventListener('pointerup', onGlobalPointerUp);
    window.removeEventListener('mouseup', onGlobalPointerUp);
    window.removeEventListener('touchend', onGlobalPointerUp);
});

function getCircleSizePercent() {
    const percent = (props.modelValue - props.min) / (props.max - props.min);
    const width = rangeInput?.value?.offsetWidth || 0;
    const outerLeft = width - width * 0.167;
    const outerRight = width - width * 0.056;
    return `${outerLeft - percent * outerRight}px`;
}
</script>

<template>
    <input
        :id="id"
        ref="rangeInput"
        type="range"
        :value="modelValue"
        :min="min"
        :max="max"
        :required="required"
        :disabled="disabled"
        @pointerdown="onPointerDown"
        @input="$emit('update:modelValue', Number($event.target.value))"
        @blur="onGlobalPointerUp"
    />
    <span
        v-if="showValue && inputActive"
        class="range-value"
        :style="{ right: getCircleSizePercent(modelValue), top: '-0.9em' }"
    >
        {{ modelValue }}px
    </span>
</template>

<style lang="scss" scoped>
input[type='range'] {
    position: relative;
    width: 50%;
    height: 0.5em;
    margin: 0.5em 0;
    font-size: 1em;
    background: $color-gray3;
    border-radius: 10px;
    appearance: none;

    &::-webkit-slider-thumb {
        position: relative;
        z-index: 2;
        width: 1em;
        height: 1em;
        cursor: grab;
        background: $color-accent;
        border-radius: 50%;
        transition: all 75ms ease;
        appearance: none;

        &:active {
            width: 0.5em;
            height: 0.5em;
            cursor: grabbing;
        }
    }

    &:active {
        &::-webkit-slider-thumb {
            width: 0.5em;
            height: 0.5em;
            cursor: grabbing;
            transition: all 75ms ease;
        }
    }
}

.range-value {
    position: absolute;
    right: 0;
    color: $color-text-secondary-dark;
}
</style>
