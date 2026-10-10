<script setup>
import { formatDate, formatTime } from '@/utils/time.js';
import Button from '@/components/Button.vue';
import ChangingSpan from '@/components/ChangingSpan.vue';

const props = defineProps({
    games: {
        type: Array,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    showSettings: {
        type: Boolean,
        default: false,
    },
    sorted: {
        type: Object,
        required: true,
    },
    page: {
        type: Number,
        default: 1,
    },
    disableNext: {
        type: Boolean,
        default: false,
    },
    disablePrev: {
        type: Boolean,
        default: true,
    },
});

defineEmits(['sort', 'next-page', 'prev-page']);

function getSortLabel(field, label) {
    if (props.sorted.by !== field) return label;
    return props.sorted.order === 'ASC' ? `▴ ${label}` : `▾ ${label}`;
}

function formatFloat(float) {
    return float.toString().length === 4 ? float.toFixed(2) : float.toFixed(1);
}
</script>

<template>
    <div class="table-wrapper">
        <div v-if="games.length === 0 && !loading" class="loader">
            <ChangingSpan text="No Games Found." />
        </div>
        <div v-else class="table">
            <div class="column">
                <div class="column-header">
                    <Button
                        preset="primary-alt"
                        :text="getSortLabel('score', 'Score')"
                        :disabled="loading"
                        :aria-label="`Sort by Score`"
                        animate-span
                        @click="$emit('sort', 'score')"
                    />
                </div>
                <div
                    v-for="game in games"
                    :key="game.createdAt"
                    class="column-cell"
                    :class="{ sorted: sorted.by === 'score' }"
                >
                    <span>
                        {{ game.score }}
                    </span>
                </div>
            </div>
            <div class="column">
                <div class="column-header">
                    <Button
                        preset="primary-alt"
                        :text="getSortLabel('time', 'Time')"
                        :disabled="loading"
                        :aria-label="`Sort by Time`"
                        animate-span
                        @click="$emit('sort', 'time')"
                    />
                </div>
                <div
                    v-for="game in games"
                    :key="game.createdAt"
                    class="column-cell"
                    :class="{ sorted: sorted.by === 'time' }"
                >
                    <span>
                        {{ formatTime(game.time) }}
                    </span>
                </div>
            </div>
            <div v-if="showSettings" class="column column-setting">
                <div class="column-header column-header-setting">
                    <Button text="Circle Size" class="setting" />
                </div>
                <div v-for="game in games" :key="game.createdAt" class="column-cell setting-cell">
                    <span> {{ game.settings.circleSize }}px </span>
                </div>
            </div>
            <div v-if="showSettings" class="column column-setting">
                <div class="column-header column-header-setting">
                    <Button text="Spawn Interval" class="setting" />
                </div>
                <div v-for="game in games" :key="game.createdAt" class="column-cell setting-cell">
                    <span>
                        {{ formatFloat(game.settings.spawnInterval) }}
                    </span>
                </div>
            </div>
            <div v-if="showSettings" class="column column-setting">
                <div class="column-header column-header-setting">
                    <Button text="Shrink Time" class="setting" />
                </div>
                <div v-for="game in games" :key="game.createdAt" class="column-cell setting-cell">
                    <span>
                        {{ formatFloat(game.settings.shrinkTime) }}
                    </span>
                </div>
            </div>
            <div class="column">
                <div class="column-header">
                    <Button
                        preset="primary-alt"
                        :text="getSortLabel('createdAt', 'Date')"
                        :disabled="loading"
                        :aria-label="`Sort by Date`"
                        animate-span
                        @click="$emit('sort', 'createdAt')"
                    />
                </div>
                <div
                    v-for="game in games"
                    :key="game.createdAt"
                    class="column-cell"
                    :class="{ sorted: sorted.by === 'createdAt' }"
                >
                    <span>
                        {{ formatDate(game.createdAt) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="table-nav">
        <Button preset="primary-alt" text="prev" :disabled="loading || disablePrev" @click="$emit('prev-page')" />
        <ChangingSpan class="page-number" :text="page" simple />
        <Button preset="primary-alt" text="next" :disabled="loading || disableNext" @click="$emit('next-page')" />
    </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
    position: relative;
    z-index: 2;
    max-width: 17em;
    padding: $size-1 $size-2;
    overflow-x: scroll;

    @include bp-custom-min(450) {
        max-width: 20em;
    }

    @include bp-sm-phone {
        max-width: 33.25em;
        overflow-x: hidden;
    }

    &::-webkit-scrollbar {
        width: 6px !important;
        height: 6px !important;
        background: $color-bg-secondary;
    }

    &::-webkit-scrollbar-thumb {
        background: $color-gray3;
        border-radius: 6px;

        &:hover {
            background: darken-color($color-gray3, 5%);
        }

        &:active {
            background: darken-color($color-gray3, 10%);
        }
    }
}

.loader {
    height: 17.5em;
    margin: $size-4 auto 0;
    color: $color-text-secondary-dark;

    span {
        font-size: 0.9em;
        text-shadow: 1px 1px 2px #0003;
    }
}

.table {
    display: flex;
    height: 100%;
    font-size: 0.95em;

    @include bp-custom-min(450) {
        font-size: 1em;
    }
}

.column {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    max-width: 4.5em;
    height: 100%;

    &:last-child {
        max-width: 9.5em !important;

        .column-header,
        .column-cell {
            max-width: 9.5em !important;
        }

        .column-cell {
            font-family: $secondary-font-stack;
            font-size: 0.5em;
            font-size: 0.75em;
            font-weight: 400;
            color: $color-gray6;
            border-right: solid 1px $color-gray3;

            span {
                display: flex;
                justify-content: center;
                width: 8em;
            }
        }
    }

    &-header,
    &-cell {
        @include flexCenterAll;

        flex: 1;
        width: 100%;
        white-space: nowrap;
    }

    &-header {
        height: 2.8em;
        padding: $size-2 0 $size-3;
        font-size: 0.9em;
        border-bottom: solid 1px $color-gray3;

        :deep(button) {
            font-size: 1.2em;

            &.setting {
                font-size: 0.8em;
                color: $color-text-secondary-dark;
                cursor: auto;

                span {
                    white-space: wrap;
                }

                &:hover {
                    transform: scale(1);
                }
            }
        }
    }

    &-cell {
        padding: 3px $size-4;
        font-size: 0.85em;
        color: $color-text-secondary-dark;
        border-bottom: solid 1px $color-gray3;
        border-left: solid 1px $color-gray3;

        &.sorted {
            background: darken-color($color-gray1, 2%);
        }
    }
}

.table-nav {
    position: relative;
    z-index: 2;
    @include flexCenterAll;

    padding-top: $size-1;

    :deep(button) {
        font-size: 1em;
    }

    span {
        margin: 0 $size-1;
        color: $color-text-secondary-dark;
        text-align: center;
        border-bottom: solid 1px $color-gray3;
    }
}
</style>
