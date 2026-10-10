<script setup>
defineProps({
    modelValue: { type: Number, required: true },
    required: { type: Boolean, default: false },
    stepUpDisabled: { type: Boolean, default: false },
    stepDownDisabled: { type: Boolean, default: false },
});

defineEmits(['stepUp', 'stepDown']);
</script>

<template>
    <div class="number-input">
        <span> {{ Number.isInteger(modelValue) ? modelValue.toFixed(1) : modelValue.toString() }}s </span>
        <div class="step-buttons">
            <button :disabled="stepUpDisabled" type="button" @click="$emit('stepUp')">+</button>
            <button :disabled="stepDownDisabled" type="button" @click="$emit('stepDown')">−</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.number-input {
    @include flexCenterAll;

    gap: 0.1em;

    span {
        width: $size-10;
        color: $color-text-secondary-dark;
        text-align: right;
    }

    .step-buttons {
        @include flexCenterAll;

        flex-direction: column;
        height: 100%;
        padding-top: 0.1em;

        button {
            flex: 1;
            padding: 0 $size-1;
            font-size: 1.5em;
            line-height: 0.7em;
            color: $color-gray4;
            background: transparent;
            border: 0;
            transition: all 0.1s ease;

            &:hover {
                color: $color-accent;
                transform: scale(1.1);
            }

            &:active {
                transform: scale(0.9);
            }
        }
    }
}
</style>
