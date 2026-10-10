<script setup>
defineProps({
    id: { type: String, required: true },
    modelValue: { type: String, required: true },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    showPassword: { type: Boolean, default: true },
    passwordHideButton: { type: Boolean, default: false },
});

defineEmits(['toggleHideButton', 'update:modelValue', 'focus', 'blur']);
</script>

<template>
    <input
        :id="id"
        :value="modelValue"
        :type="showPassword ? 'text' : 'password'"
        :required="required"
        :disabled="disabled"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
        v-if="passwordHideButton"
        type="button"
        class="toggle-password"
        @click="$emit('toggleHideButton')"
        @mousedown.prevent
    >
        {{ showPassword ? 'Hide' : 'Show' }}
    </button>
</template>

<style lang="scss" scoped>
input[type='text'],
input[type='password'] {
    width: 100%;
    padding: $size-2;
    color: $color-text-secondary-dark;
    background-color: $color-bg-secondary;
    border: 2px solid $color-primary-light;
    border-radius: $border-radius-sm;
    outline: 0;

    &:focus {
        border-color: $color-accent;
    }
}

.toggle-password {
    position: absolute;
    top: 50%;
    right: 8px;
    font-size: 0.8em;
    color: $color-accent-light;
    background: none;
    border: none;
    transform: translateY(-50%);

    &:hover {
        color: $color-accent;
    }
}
</style>
