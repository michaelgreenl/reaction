<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ChangingSpan from '@/components/ChangingSpan.vue';

const props = defineProps({
    text: { type: String, default: 'Loading' },
});

const dotCount = ref(0);
const loadingText = computed(() => `${props.text}${'.'.repeat(dotCount.value)}`);

let intervalId = null;
onMounted(() => {
    intervalId = setInterval(() => {
        dotCount.value = (dotCount.value + 1) % 4;
    }, 500);
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<template>
    <div class="loading-wrapper">
        <ChangingSpan :text="loadingText" />
    </div>
</template>

<style lang="scss" scoped>
.loading-wrapper {
    @include flexCenterAll;

    span {
        width: 7.5ch;
        text-align: left;
        text-shadow: 1px 1px 2px #0003;
        text-wrap: nowrap;
    }
}
</style>
