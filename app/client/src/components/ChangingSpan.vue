<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useUtilAnimations } from '@/composables/animations/useUtilAnimations.js';

const props = defineProps({
    text: { type: [String, Number, null], required: true },
    simple: { type: Boolean, default: false },
});

const { fadeIn, fadeOut } = useUtilAnimations();

const changingSpan = ref(null);
const localText = ref(props.text);

const items = ref([]);
let uniqueIdCounter = 0;

function createItems(str) {
    const string = `${str}`;
    return string.split('').map((char) => ({
        id: uniqueIdCounter++,
        char,
    }));
}

function updateText(newText) {
    const oldItems = items.value;
    const oldText = oldItems.map((i) => i.char).join('');

    let prefixLen = 0;
    while (prefixLen < oldText.length && prefixLen < newText.length && oldText[prefixLen] === newText[prefixLen]) {
        prefixLen++;
    }

    let oldEnd = oldText.length - 1;
    let newEnd = newText.length - 1;

    while (oldEnd >= prefixLen && newEnd >= prefixLen && oldText[oldEnd] === newText[newEnd]) {
        oldEnd--;
        newEnd--;
    }

    const nextItems = [];

    for (let i = 0; i < prefixLen; i++) {
        nextItems.push(oldItems[i]);
    }

    for (let i = prefixLen; i <= newEnd; i++) {
        nextItems.push({
            id: uniqueIdCounter++,
            char: newText[i],
        });
    }

    for (let i = oldEnd + 1; i < oldItems.length; i++) {
        nextItems.push(oldItems[i]);
    }

    items.value = nextItems;
}

onMounted(() => {
    if (!props.simple) {
        items.value = createItems(props.text);
    }
});

watch(
    () => props.text,
    (newVal) => {
        if (!props.simple) {
            updateText(newVal);
        } else {
            fadeOut({
                selector: changingSpan.value,
                onComplete: async () => {
                    localText.value = newVal;
                    await nextTick();
                    fadeIn({ selector: changingSpan.value });
                },
            });
        }
    },
);

const onEnter = (el, done) => {
    fadeIn({ selector: el, onComplete: done });
};

const onLeave = (el, done) => {
    el.style.position = 'absolute';
    fadeOut({ selector: el, onComplete: done });
};
</script>

<template>
    <template v-if="!simple">
        <span class="changing-span-wrapper" :aria-label="text" role="text">
            <TransitionGroup tag="span" :css="false" aria-hidden="true" @enter="onEnter" @leave="onLeave">
                <span v-for="item in items" :key="item.id" class="char-item">
                    {{ item.char }}
                </span>
            </TransitionGroup>
        </span>
    </template>
    <template v-else>
        <span ref="changingSpan">{{ localText }}</span>
    </template>
</template>

<style lang="scss" scoped>
.changing-span-wrapper {
    position: relative;
    display: inline-block;
    white-space: pre;
}

.char-item {
    position: relative;
    display: inline-block;
    transition: all 0.3s ease;
}

.v-move {
    transition: transform 0.3s ease;
}
</style>
