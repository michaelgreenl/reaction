<script setup>
defineProps({
    id: { type: String, required: true },
    model: { type: null, required: true },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

defineEmits(['input']);
</script>

<template>
    <input
        :id="id"
        type="checkbox"
        :checked="model"
        :required="required"
        :disabled="disabled"
        @input="$emit('input')"
    />
</template>

<style lang="scss" scoped>
input[type='checkbox'] {
    appearance: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.2em;
    height: 1.2em;
    margin: 0;
    border: solid 2px $color-primary-light;
    border-radius: 5px;

    @include bp-xl-desktop {
        font-size: 0.8em;
    }

    &::before {
        width: 1.2em;
        height: 1.2em;
        margin: 0;
        color: white;
        text-align: center;
        content: '✓';
        background-color: $color-primary-light;
        border-radius: 5px;
        opacity: 0;
    }

    &:checked::before {
        opacity: 1;
    }
}
</style>
