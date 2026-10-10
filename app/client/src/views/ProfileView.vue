<script setup>
import { computed, ref, reactive, onMounted, nextTick } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';
import { useSettingsStore } from '@/stores/settingsStore.js';
import { useBreakpoints } from '@/composables/useBreakpoints.js';
import { useProfileAnimations } from '@/composables/animations/useProfileAnimations.js';
import { useUtilAnimations } from '@/composables/animations/useUtilAnimations.js';
import { formatTime } from '@/utils/time.js';
import { gsap } from 'gsap';
import Flip from 'gsap/Flip';
import Button from '@/components/Button.vue';
import GameHistoryTable from '@/components/GameHistoryTable.vue';
import Loader from '@/components/Loader.vue';
import RangeInput from '@/components/Inputs/Range.vue';
import NumberInput from '@/components/Inputs/Number.vue';
import CheckboxInput from '@/components/Inputs/Checkbox.vue';
import LogoSVG from '@/components/Icons/LogoSVG.vue';

gsap.registerPlugin(Flip);

const isMounted = ref(false);

const { isMobile } = useBreakpoints();

const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const filterDropdownRef = ref(null);

const isLoading = ref(true);
const loadingGames = ref(true);

const showFilters = ref(false);
const showFilterInputs = ref(false);
const showSettings = ref(true);
const headerShowSettings = ref(true);

const offset = ref(0);
const activePage = ref(1);
const activeGames = reactive({
    filtered: false,
    sorted: { by: 'createdAt', order: 'DESC' },
    games: [],
});

const filterToggles = reactive({ circleSize: false, spawnInterval: false, shrinkTime: false });
const addedFilters = ref([]);
const savedFilters = ref([]);
const settingsFilters = reactive({ ...settingsStore });
const rangeInputActive = ref(false);

const filterInputs = computed(() => [
    {
        key: 'circleSize',
        label: 'Circle Size',
        component: RangeInput,
        props: {
            min: 25,
            max: 125,
            disabled: loadingGames.value || !filterToggles.circleSize,
            showValue: true,
            inputActive: rangeInputActive.value,
        },
        on: {
            mousedown: () => (rangeInputActive.value = true),
            mouseup: () => (rangeInputActive.value = false),
        },
    },
    {
        key: 'spawnInterval',
        label: 'Spawn Interval',
        component: NumberInput,
        props: {
            stepUpDisabled: isLoading.value || !filterToggles.spawnInterval || settingsFilters.spawnInterval >= 2,
            stepDownDisabled: isLoading.value || !filterToggles.spawnInterval || settingsFilters.spawnInterval <= 0.25,
        },
        on: {
            stepUp: () => (settingsFilters.spawnInterval += 0.25),
            stepDown: () => (settingsFilters.spawnInterval -= 0.25),
        },
    },
    {
        key: 'shrinkTime',
        label: 'Shrink Time',
        component: NumberInput,
        props: {
            stepUpDisabled: loadingGames.value || !filterToggles.shrinkTime || settingsFilters.shrinkTime >= 2,
            stepDownDisabled: loadingGames.value || !filterToggles.shrinkTime || settingsFilters.shrinkTime <= 0.25,
        },
        on: {
            stepUp: () => (settingsFilters.shrinkTime += 0.25),
            stepDown: () => (settingsFilters.shrinkTime -= 0.25),
        },
    },
]);

const visibleFilterInputs = computed(() => {
    return addedFilters.value.map((key) => filterInputs.value.find((input) => input.key === key));
});

const filtersAdded = computed(() => {
    return addedFilters.value.length > 0;
});

const { flipFrom } = useUtilAnimations();
const {
    showFilterDropdownAnim,
    hideFilterDropdownAnim,
    showFilterInputsAnim,
    hideFilterInputsAnim,
    enterFilterInputAnim,
    exitFilterInputAnim,
    enterAllFilterInputsAnim,
    exitAllFilterInputsAnim,
    enterFilterButtonsAnim,
    exitFilterButtonsAnim,
    showTableCellsAnim,
    hideTableCellsAnim,
    showSettingsColumnsAnim,
    hideSettingsColumnsAnim,
} = useProfileAnimations({
    visibleFilterInputs,
    showSettings,
    isMobile,
});

onMounted(async () => {
    if (!authStore.initLoading && !authStore.userStats) {
        await authStore.initializeAuth();
    }

    await getUnfilteredGames().then(async () => {
        isLoading.value = false;
        loadingGames.value = false;
        isMounted.value = true;

        await nextTick();
        showTableCellsAnim();
    });
});

async function getUnfilteredGames({ onAnimComplete = () => {} } = {}) {
    const getGamesLogic = async () => {
        activeGames.filtered = false;
        const games = await authStore.getGames(10, offset.value, activeGames.sorted);
        activeGames.games.length = 0;
        activeGames.games.push(...games);
    };

    if (isMounted.value) {
        await hideTableCellsAnim({
            onComplete: async () => {
                onAnimComplete();
                await nextTick();
                await getGamesLogic();
                showTableCellsAnim();
            },
        });
    } else {
        await getGamesLogic();
    }
}

async function filterGamesBySettings() {
    if (!filtersAdded.value && activeGames.filtered) {
        await resetFilters();
        return;
    } else if (!activeGames.filtered) {
        offset.value = 0;
        activePage.value = 1;
        activeGames.filtered = true;
    }

    hideTableCellsAnim({
        onComplete: async () => {
            loadingGames.value = true;
            const games = await authStore.getGamesBySettings(10, offset.value, savedFilters.value, activeGames.sorted);
            loadingGames.value = false;
            activeGames.games.length = 0;

            if (games) {
                activeGames.games.push(...games);
            }

            await nextTick();
            showTableCellsAnim();
        },
    });
}

async function getGames({ onAnimComplete = () => {} } = {}) {
    if (!savedFilters.value.length) {
        await getUnfilteredGames({ onAnimComplete });
    } else {
        onAnimComplete();
        await filterGamesBySettings();
    }
}

async function handleSort(by) {
    const onAnimComplete = () => {
        offset.value = 0;
        activePage.value = 1;

        if (activeGames.sorted.by === by) {
            activeGames.sorted.order = activeGames.sorted.order === 'DESC' ? 'ASC' : 'DESC';
        } else {
            activeGames.sorted.by = by;
            activeGames.sorted.order = 'DESC';
        }
    };

    await getGames({ onAnimComplete });
}

async function saveSettingFilters() {
    savedFilters.value.length = 0;
    Object.keys(filterToggles).forEach((toggle) => {
        if (filterToggles[`${toggle}`]) {
            savedFilters.value.push({ filter: toggle, value: settingsFilters[`${toggle}`] });
        }
    });

    await getGames();
}

async function switchPage(newOffset, pageNum) {
    const onAnimComplete = () => {
        activePage.value = pageNum;
        offset.value = newOffset;
    };

    await getGames({ onAnimComplete });
}

async function addAllFilters() {
    const state = Flip.getState('.filters, .filter-form-group, .filter-form-buttons, .filter-form-seperator');

    showFilterInputs.value = true;

    const keysToAdd = Object.keys(filterToggles);
    keysToAdd.forEach((key) => {
        if (!filterToggles[key]) {
            filterToggles[key] = true;
            addedFilters.value.push(key);
        }
    });

    await nextTick();
    showFilterInputsAnim();
    enterAllFilterInputsAnim();
    enterFilterButtonsAnim();
    flipFrom({ state, opts: { nested: true } });
    toggleFilterDropdown();
}

async function resetFilters() {
    const resetValues = () => {
        Object.keys(filterToggles).forEach((toggle) => {
            filterToggles[toggle] = false;
        });
        addedFilters.value = [];
        savedFilters.value = [];

        settingsFilters.circleSize = settingsStore.circleSize;
        settingsFilters.spawnInterval = settingsStore.spawnInterval;
        settingsFilters.shrinkTime = settingsStore.shrinkTime;

        activeGames.filtered = false;
    };

    const onComplete = async () => {
        await nextTick();
        if (!savedFilters.value.length) {
            resetValues();
        } else {
            await getGames({
                onAnimComplete: () => {
                    resetValues();
                    offset.value = 0;
                    activePage.value = 1;
                },
            });
        }
    };

    const tl = gsap.timeline();
    exitAllFilterInputsAnim({
        onStart: () => {
            setTimeout(() => {
                hideFilterInputsAnim({ tl, onComplete });
            }, 250);
        },
    });
}

async function toggleFilterInput(key) {
    const state = Flip.getState('.filters, .filter-form-group, .filter-form-buttons, .filter-form-seperator');

    const tl = gsap.timeline();
    if (!filterToggles[key]) {
        const oldFiltersAdded = filtersAdded.value;

        filterToggles[key] = true;
        addedFilters.value.push(key);
        showFilterInputs.value = filtersAdded.value;

        await nextTick();

        if (!oldFiltersAdded) {
            showFilterInputsAnim({ tl });
            enterFilterButtonsAnim({ tl });
            enterFilterInputAnim({ key, delay: 0.1 });
        } else {
            enterFilterInputAnim({ key, delay: 0.2 });
            flipFrom({ state, opts: { nested: true } });
        }
    } else {
        const onComplete = async () => {
            filterToggles[key] = false;

            const index = addedFilters.value.indexOf(key);
            if (index > -1) {
                addedFilters.value.splice(index, 1);
            }

            saveSettingFilters();
            showFilterInputs.value = filtersAdded.value;

            await nextTick();
            flipFrom({ state, opts: { nested: true } });
        };

        if (visibleFilterInputs.value.length === 1) {
            exitFilterInputAnim({ key, tl });
            hideFilterInputsAnim({ tl, onComplete });
        } else {
            exitFilterInputAnim({ key, tl, onComplete });
        }
    }
}

const filterDropdownListener = async (e) => {
    if (!showFilters.value) {
        showFilters.value = true;
        await nextTick();
        showFilterDropdownAnim();
    } else if (e) {
        if (e.target !== filterDropdownRef.value && !e.composedPath().includes(filterDropdownRef.value)) {
            hideFilterDropdownAnim({ onComplete: () => (showFilters.value = false) });
            window.removeEventListener('click', filterDropdownListener);
        }
    } else {
        hideFilterDropdownAnim({ onComplete: () => (showFilters.value = false) });
        window.removeEventListener('click', filterDropdownListener);
    }
};

function toggleFilterDropdown() {
    if (!showFilters.value) {
        window.addEventListener('click', filterDropdownListener);
    } else {
        filterDropdownListener();
    }
}

function toggleSettingsColumns() {
    let filterState;
    if (filtersAdded.value) {
        filterState = Flip.getState('.filters, .filter-form-group, .filter-form-buttons, .filter-form-seperator');

        if (!isMobile.value && (visibleFilterInputs.value.length > 1 || !showSettings.value)) {
            exitFilterButtonsAnim();
            exitAllFilterInputsAnim();
        }
    }

    const statsState = Flip.getState('.stat-wrapper');
    const headerState = Flip.getState('.logo, .toggle-buttons');

    if (showSettings.value) {
        hideSettingsColumnsAnim({
            onComplete: async () => {
                headerShowSettings.value = false;

                await nextTick();
                flipFrom({ state: statsState, opts: { duration: 0.2, ease: 'power2.out' } });
                flipFrom({ state: headerState, onComplete: () => (showSettings.value = !showSettings.value) });

                if (!isMobile.value && filtersAdded.value) {
                    flipFrom({
                        state: filterState,
                        onComplete: () => {
                            enterAllFilterInputsAnim();
                            enterFilterButtonsAnim();
                        },
                    });
                }
            },
        });
    } else {
        showSettingsColumnsAnim({
            onComplete: async () => {
                showSettings.value = true;
                headerShowSettings.value = true;

                await nextTick();
                flipFrom({ state: statsState, opts: { duration: 0.2, ease: 'power2.out', nested: true } });

                if (!isMobile.value && filtersAdded.value) {
                    await nextTick();
                    flipFrom({
                        state: filterState,
                        onComplete: () => {
                            enterAllFilterInputsAnim();
                            enterFilterButtonsAnim();
                        },
                    });
                }
            },
        });
    }
}
</script>

<template>
    <div v-if="isLoading" class="loader loader-games">
        <Loader text="Loading Games" />
    </div>
    <div v-else class="profile-container">
        <div class="user-stats psuedo-border" :class="`${headerShowSettings ? 'show-settings' : undefined}`">
            <div class="stat-wrapper">
                <span class="label">High Score:</span>
                <hr />
                <span class="stat">{{ authStore.userStats?.highScore }}</span>
            </div>
            <span class="seperator user-stats-seperator"> | </span>
            <div class="stat-wrapper">
                <span class="label">Longest Time:</span>
                <hr />
                <span class="stat">{{ formatTime(authStore.userStats?.highTime) }}</span>
            </div>
            <span class="seperator user-stats-seperator"> | </span>
            <div class="stat-wrapper">
                <span class="label">Games Played:</span>
                <hr />
                <span class="stat">{{ authStore.userStats?.totalGames }}</span>
            </div>
        </div>
        <div class="main-wrapper">
            <div class="table-container psuedo-border" :class="`${showSettings ? 'show-settings' : undefined}`">
                <div class="table-header" :class="`${headerShowSettings ? 'show-settings' : undefined}`">
                    <div class="logo">
                        <LogoSVG />
                        <h1>Game History</h1>
                    </div>
                    <div class="toggle-buttons">
                        <Button
                            preset="primary-alt"
                            :text="`${headerShowSettings ? 'Hide' : 'Show'} Settings`"
                            animate-span
                            @click="toggleSettingsColumns"
                        />
                        <Button preset="primary-alt" text="Add Filters ▾" @click="toggleFilterDropdown()" />
                    </div>
                    <div
                        v-if="showFilters"
                        ref="filterDropdownRef"
                        class="filter-toggles psuedo-border"
                        :class="`${showSettings ? 'show-settings' : undefined}`"
                    >
                        <div
                            v-for="key in Object.keys(settingsStore.settingsKeyVal)"
                            :key="key"
                            class="form-group filter-toggles-form-group"
                        >
                            <CheckboxInput
                                :id="`${key}Filter`"
                                type="checkbox"
                                :disabled="loadingGames"
                                :model="filterToggles[`${key}`]"
                                @input="toggleFilterInput(key)"
                            />
                            <label :for="`${key}Filter`">
                                {{ settingsStore.settingsKeyVal[`${key}`] }}
                            </label>
                        </div>
                        <Button
                            class="filter-toggles-button"
                            preset="primary-alt"
                            text="+All"
                            @click="addAllFilters()"
                        />
                    </div>
                </div>
                <hr class="header-border" />
                <div
                    v-if="showFilterInputs"
                    class="filters"
                    :class="`${headerShowSettings ? 'show-settings' : undefined}`"
                >
                    <form v-if="filtersAdded" @submit.prevent="saveSettingFilters">
                        <div class="form-groups">
                            <template v-for="(input, i) in visibleFilterInputs" :key="input.key">
                                <div class="form-group filter-form-group" :class="`form-group-${input.key}`">
                                    <label :for="input.key">{{ input.label }}</label>
                                    <span
                                        v-if="isMobile || !showSettings || !headerShowSettings"
                                        class="seperator filter-form-seperator"
                                        :class="`seperator-${i}`"
                                    >
                                        -
                                    </span>
                                    <component
                                        :is="input.component"
                                        :id="input.key"
                                        v-model="settingsFilters[input.key]"
                                        v-bind="input.props"
                                        v-on="input.on"
                                    />
                                </div>
                                <span
                                    v-if="
                                        !isMobile &&
                                        i < visibleFilterInputs.length - 1 &&
                                        (showSettings || headerShowSettings)
                                    "
                                    class="seperator filter-form-seperator"
                                    :class="`seperator-${i}`"
                                >
                                    |
                                </span>
                            </template>
                        </div>
                        <div class="filter-form-buttons">
                            <Button
                                class="filter-form-button"
                                preset="primary-alt"
                                type="button"
                                text="Reset"
                                :disabled="loadingGames || !filtersAdded"
                                @click="resetFilters"
                            />
                            <Button
                                class="filter-form-button"
                                preset="primary-alt"
                                type="submit"
                                text="Save"
                                :disabled="loadingGames || (!filtersAdded && !activeGames.filtered)"
                            />
                        </div>
                    </form>
                </div>
                <GameHistoryTable
                    :games="activeGames.games"
                    :loading="loadingGames"
                    :show-settings="showSettings"
                    :sorted="activeGames.sorted"
                    :page="activePage"
                    :disable-prev="offset === 0"
                    :disable-next="activeGames.games.length < 10 || authStore.userStats?.totalGames <= 10"
                    @sort="handleSort"
                    @prev-page="switchPage(offset - 10, activePage - 1)"
                    @next-page="switchPage(offset + 10, activePage + 1)"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profile-container {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    align-items: center;
    justify-content: center;
    padding-left: calc(100vw - 100%); // prevent's layout shift when the page become's scrollable
}

.user-stats {
    position: relative;
    flex-direction: column;
    gap: $size-1;
    width: 19em;
    padding: $size-3 $size-4;
    @include flexCenterAll;

    @include bp-custom-min(450) {
        width: 22em;
    }

    @include bp-sm-phone {
        &.show-settings {
            flex-direction: row;
            gap: $size-3;
            width: 33.25em;

            .seperator {
                display: block;
            }

            .stat-wrapper {
                width: fit-content;

                hr {
                    display: none;
                    transform: scaleX(0);
                }
            }
        }
    }

    > span {
        position: relative;
        z-index: 2;
        font-size: 0.5em;
        font-weight: 500;
        color: $color-gray3;
    }

    .seperator {
        display: none;
    }

    .stat-wrapper {
        position: relative;
        z-index: 2;
        display: flex;
        gap: $size-1;
        justify-content: space-between;
        width: 100%;

        span {
            font-size: 0.95em !important;
            line-height: 1.6ch;
            color: $color-text-secondary-dark;
            white-space: nowrap;

            &.label {
                line-height: 1.6ch;
                color: $color-accent;
            }
        }

        hr {
            flex: 1;
            align-self: flex-end;
            margin: 0 0 $size-1;
            border: 0;
            border-bottom: dotted 2px $color-gray4;
            transform: scaleX(1);
        }
    }
}

.main-wrapper {
    @include flexCenterAll;

    flex-direction: column;
    width: 100%;
}

.table-container {
    position: relative;
    flex-direction: column;
    max-width: 19em !important;
    padding: $size-4 $size-6;
    margin-bottom: $size-4;
    border: solid 1px $color-gray3;
    @include flexCenterAll;

    @include bp-custom-min(450) {
        max-width: 22em !important;
    }

    @include bp-sm-phone {
        &.show-settings {
            width: 33.25em;
            max-width: 33.25em !important;
        }
    }
}

.header-border {
    position: relative;
    z-index: 2;
    width: 100%;
    min-height: 1px;
    max-height: 1px;
    margin: 0;
    background-color: $color-primary-light;
    border: 0;
}

.table-header {
    position: relative;
    z-index: 3;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 18em;
    padding: $size-1 $size-1 $size-3;

    @include bp-sm-phone {
        &.show-settings {
            justify-content: space-between;
            width: 100%;
            max-width: 100%;
        }
    }

    .logo {
        @include flexCenterAll;

        svg {
            width: 1.7em;
            height: 1.7em;
        }

        h1 {
            margin: 0;
            margin-left: -2px;
            font-size: 1.5em;
            color: $color-accent;
            white-space: nowrap;
        }
    }

    .toggle-buttons {
        display: flex;
        padding-left: $size-1;
        margin-top: $size-1;

        @include bp-md-tablet {
            :deep(button) {
                font-size: 0.8em;
            }
        }
    }
}

.filter-toggles {
    position: absolute;
    top: 3.5em;
    right: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: $size-1;
    width: fit-content;
    width: 0;
    height: 0;
    padding: 0.5em;
    padding-right: $size-3;
    margin: $size-1 $size-2;
    overflow: hidden;

    @include bp-xs-phone {
        right: $size-4;
    }

    @include bp-sm-phone {
        &.show-settings {
            top: 2em;
            right: 0;
        }
    }

    .form-group {
        position: relative;
        z-index: 2;
        display: flex;
        gap: $size-1;
        align-items: center;
        margin: 0 $size-1;
        opacity: 0;

        &:first-child {
            margin-top: $size-1;
        }

        input {
            cursor: pointer;
        }

        label {
            font-size: 0.8em;
            color: $color-text-primary-dark;
            white-space: nowrap;
        }
    }

    :deep(button) {
        position: relative;
        z-index: 2;
        align-self: flex-end;
        padding-right: 0;
        margin: 0 $size-1;
        font-size: 0.75em;
        opacity: 0;
    }
}

.filters {
    position: relative;
    z-index: 2;
    width: 25em;
    height: 0;
    font-size: 0.7em;

    @include bp-sm-phone {
        .seperator {
            display: none;
        }

        &.show-settings {
            width: 49em;

            .form-groups {
                flex-wrap: nowrap;
                width: fit-content;
            }

            .seperator {
                display: block !important;
            }

            .form-group {
                width: fit-content;
                max-width: 15em;
            }

            .filter-form-buttons {
                padding-right: $size-5;
            }
        }
    }

    form {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: $size-1 $size-4;

        @include bp-sm-phone {
            .table-container.show-settings & {
                height: 100%;
            }
        }

        .form-groups {
            @include flexCenterAll;

            flex-wrap: wrap;
            align-self: flex-start;
            width: 100%;
            padding: $size-2;
            margin: 0 auto;

            .seperator {
                margin: 0 $size-4;
                font-size: 0.5em;
                color: $color-gray3 !important;
                opacity: 0;
                transform: scale(0);
            }

            .form-group {
                position: relative;
                display: flex;
                gap: $size-2;
                align-items: center;
                justify-content: space-between;
                width: 200%;
                opacity: 0;

                label {
                    font-size: 1.1em;
                }

                label,
                span {
                    color: $color-text-secondary-dark;
                    white-space: nowrap;
                }

                :deep(.number-input) {
                    span {
                        font-size: 1em;
                    }
                }

                :deep(input[type='range']) {
                    margin: 0.85em 0;
                }
            }
        }

        .filter-form-buttons {
            @include flexCenterAll;

            margin-left: auto;

            :deep(button) {
                font-size: 1.1em;
                opacity: 0;
            }
        }
    }
}
</style>
