<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';
import { useSettingsStore } from '@/stores/settingsStore.js';
import { useBreakpoints } from '@/composables/useBreakpoints.js';
import { useGameAnimations } from '@/composables/animations/useGameAnimations.js';
import { useUtilAnimations } from '@/composables/animations/useUtilAnimations.js';
import { getTimePassed } from '@/utils/time.js';
import { gsap } from 'gsap';
import Settings from '@/components/Settings.vue';
import Canvas from '@/components/Canvas.vue';
import Button from '@/components/Button.vue';
import GameStats from '@/components/GameStats.vue';
import ArrowSVG from '@/components/Icons/ArrowSVG.vue';
import CloseSVG from '@/components/Icons/CloseSVG.vue';

const isMounted = ref(false);

const { isMobile, isLgDesktop, isXlDesktop } = useBreakpoints();

const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const settingsRef = ref(null);

const gameActive = ref(false);
const showSettings = ref(false);
const showRecentGames = ref(false);
const score = ref(0);
const gamePlayed = ref(false);

const elapsedMs = ref(0);
let timerId;
let startTimestamp = 0;

const mainButtons = ref([
    {
        key: 'cancel',
        text: 'Cancel',
        preset: 'primary',
        condition: () => showSettings.value,
        disabled: () => !settingsRef.value?.settingsChanged,
        click: () => settingsRef.value?.resetLocalSettings(),
    },
    {
        key: 'save',
        text: 'Save',
        type: 'submit',
        preset: 'primary',
        condition: () => showSettings.value,
        disabled: () => settingsRef.value?.isLoading || !settingsRef.value?.settingsChanged,
        click: () => settingsRef.value?.saveSettings(),
    },
    {
        key: 'settings',
        text: 'Settings',
        preset: 'primary',
        condition: () => !showSettings.value,
        click: () => toggleSettings(),
    },
]);

const buttonList = computed(() => {
    return mainButtons.value.filter((button) => {
        return button.condition ? button.condition() : true;
    });
});

const { fadeOut } = useUtilAnimations();
const {
    openRecentGamesAnim,
    hideRecentGamesAnim,
    closeRecentGamesAnim,
    showRecentGamesAnim,
    enterButtonAnim,
    exitButtonAnim,
    showButtonsAnim,
    hideButtonsAnim,
    showEndScreenAnim,
    hideEndScreenAnim,
    shrinkButtonDivAnim,
    growButtonDivAnim,
} = useGameAnimations({ isXlDesktop, showRecentGames });

onMounted(async () => {
    showButtonsAnim();
    if (!authStore.initLoading && !authStore.recentUserGames.length) {
        await authStore.initializeAuth();
    }

    showRecentGamesAnim();

    isMounted.value = true;
});

onBeforeUnmount(() => {
    stopTimer();
    window.removeEventListener('resize', () => {});
});

function startTimer() {
    elapsedMs.value = 0;
    startTimestamp = performance.now();
    timerId = setInterval(() => {
        elapsedMs.value = performance.now() - startTimestamp;
    }, 10);
}

function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

async function startGame() {
    const tl = gsap.timeline();
    hideButtonsAnim();

    if (showSettings.value) {
        settingsRef.value?.closeSettingsAnim({ tl });
    }

    hideRecentGamesAnim({ tl });

    const onComplete = async () => {
        elapsedMs.value = 0;
        score.value = 0;
        showSettings.value = false;
        showRecentGames.value = false;
        gamePlayed.value = true;
        gameActive.value = true;
        authStore.gameActive = true;
    };

    if (!gamePlayed.value || showSettings.value) {
        fadeOut({
            selector: '.settings-circle',
            opts: {
                ease: 'power3.in',
                scale: 0,
            },
            onComplete,
        });
    } else {
        hideEndScreenAnim({ tl, onComplete });
    }
}

async function handleEndGame() {
    stopTimer();
    authStore.gameActive = false;
    gameActive.value = false;
    await nextTick();

    showRecentGamesAnim();
    showEndScreenAnim();
    showButtonsAnim();

    authStore.setGame(
        { score: score.value, time: elapsedMs.value },
        {
            circleSize: settingsStore.circleSize,
            spawnInterval: settingsStore.spawnInterval,
            shrinkTime: settingsStore.shrinkTime,
        },
    );
}

async function toggleSettings() {
    const onComplete = async () => {
        if (!showSettings.value) {
            growButtonDivAnim();
        }

        const setSettings = async (setTo, { tl = gsap.timeline() } = {}) => {
            showSettings.value = setTo;
            await nextTick();
            enterButtonAnim(tl);
        };

        const tl = gsap.timeline();
        if (!showSettings.value && showRecentGames.value && authStore.isAuthenticated) {
            const toggleValues = () => {
                showRecentGames.value = false;
                setSettings(true, { tl });
            };

            /*
             * Handling UI collsions and responsive DOM state
             *  - on mobile, the recent games element needs to be hidden
             *  - on lg desktop's, the recent games element isn't changed
             */
            if (!isMobile.value && !isLgDesktop.value) {
                closeRecentGamesAnim({ onStart: toggleValues });
            } else if (isMobile.value) {
                hideRecentGamesAnim({ onComplete: toggleValues });
            } else {
                setSettings(true);
            }
        } else if (!showSettings.value && !showRecentGames.value) {
            setSettings(true, { tl });

            if (isMobile.value) {
                hideRecentGamesAnim();
            }
        } else {
            if (isMobile.value) {
                showRecentGamesAnim();
            }

            setSettings(false, { tl });
            if (gamePlayed.value) {
                await nextTick();
                showEndScreenAnim();
            }
        }
    };

    const tl = gsap.timeline();
    exitButtonAnim({ tl, onComplete: (tl) => onComplete(tl) });

    if (gamePlayed.value && !showSettings.value) {
        hideEndScreenAnim({ tl });
    }

    if (showSettings.value) {
        shrinkButtonDivAnim({ delay: 0.2 });
    }
}

async function toggleRecentGames() {
    const onComplete = async () => {
        showRecentGames.value = true;
        await nextTick();
        openRecentGamesAnim();
    };

    if (showSettings.value && !showRecentGames.value && !isLgDesktop.value) {
        settingsRef.value?.closeSettings();
        shrinkButtonDivAnim();

        exitButtonAnim({ onComplete });
    } else if (!showRecentGames.value) {
        onComplete();
    } else {
        closeRecentGamesAnim({ onStart: () => (showRecentGames.value = false) });
    }
}
</script>

<template>
    <div class="game-container" :class="`${showSettings ? 'showing-settings' : undefined}`">
        <div v-if="!gameActive" class="game-start">
            <div v-if="authStore.recentUserGames.length" key="recentGames" class="recent-games psuedo-border">
                <div class="recent-games-header">
                    <h2>Recent Scores</h2>
                    <Button
                        v-if="!showRecentGames"
                        preset="icon-only"
                        :icon-left="ArrowSVG"
                        @click="toggleRecentGames"
                    />
                    <Button
                        v-if="showRecentGames"
                        preset="icon-only"
                        :icon-left="CloseSVG"
                        @click="toggleRecentGames"
                    />
                </div>
                <hr :style="{ width: `${!showRecentGames ? '94%' : '98%'}` }" />
                <ul v-if="showRecentGames && (!showSettings || isLgDesktop)" class="recent-games-list">
                    <li v-for="game in authStore.recentUserGames" :key="game.createdAt">
                        <GameStats :score="game.score" :time="game.time" />
                        <span class="separator"> - </span>
                        <span>{{ getTimePassed(game.createdAt) }} </span>
                    </li>
                </ul>
            </div>
            <div v-if="gamePlayed && !showSettings" class="end-screen psuedo-border">
                <h1 class="end-screen-child">Game Over</h1>
                <hr class="end-screen-child" />
                <div class="stats end-screen-child">
                    <GameStats :score="score" :time="elapsedMs" />
                </div>
            </div>
            <Settings
                ref="settingsRef"
                class="settings"
                :show-settings="showSettings"
                :game-played="gamePlayed"
                @starting-close-settings="exitButtonAnim(gsap.timeline())"
                @close-settings="toggleSettings"
            />
            <div class="main-buttons">
                <Button
                    v-for="button in buttonList"
                    :key="button.key"
                    :class="['main-button', button.class]"
                    :preset="button.preset"
                    :text="button.text"
                    :type="button.type"
                    :is-loading="button.isLoading && button.isLoading()"
                    :disabled="button.disabled && button.disabled()"
                    @click="button.click"
                />
                <Button class="start-button" preset="primary animated" text="Start" @click="startGame" />
            </div>
        </div>
        <Canvas
            v-if="gameActive"
            :game-active="gameActive"
            :score="score"
            :time="elapsedMs"
            @end-game="handleEndGame"
            @increment-score="score += 1"
            @start-timer="startTimer"
        />
    </div>
</template>

<style lang="scss" scoped>
.game-container {
    position: relative;
    z-index: 1;
    width: 100%;
    height: $height-minus-nav;
    @include flexCenterAll;
}

.recent-games {
    position: absolute;
    top: $size-1;
    left: $size-3;
    z-index: 3;
    display: flex;
    flex-direction: column;
    padding: $size-3 $size-2 0.4em $size-4;
    overflow: hidden;
    font-size: 1.1em;
    background: $color-bg-secondary;
    border: solid 1px $color-gray3;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow;
    transform: translateX(-250px);

    @include bp-xxl-desktop {
        margin: $size-2 $size-3 0;
    }

    hr {
        position: relative;
        z-index: 2;
        min-height: 1px;
        max-height: 1px;
        margin: 0;
        background-color: $color-primary-light;
        border: 0;
        transform: translateY(-0.2em);

        @include bp-xs-phone {
            transform: translateY(-0.1em);
        }

        @include bp-md-tablet {
            margin-bottom: $size-2;
            transform: translateY(0.25em);
        }

        @include bp-xxl-desktop {
            margin: $size-1 0;
            transform: translateY(0.1em);
        }
    }
}

.recent-games-header {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 2px;
    justify-content: space-between;

    h2 {
        margin: 0;
        font-size: 1em;
        line-height: 1.6ch;
        color: $color-accent;
        white-space: nowrap;

        @include bp-xs-phone {
            line-height: normal;
        }
    }

    button {
        padding: 0.6em;
        margin-top: 1px;
        border-radius: 100%;
        transform: scale(0.75) translate(-5px, -4px);

        @include bp-md-tablet {
            transform: scale(0.9) translate(-8px, -1px);
        }

        @include bp-xxl-desktop {
            transform: scale(0.9) translate(-8px, 1px);
        }

        &:hover {
            background: #ec6e9e22;
        }

        :deep(.icon) {
            width: 1em;
            height: 1em;
            stroke: $color-accent;
        }
    }
}

.recent-games-list {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: 20em;
    padding: 0 $size-4 $size-1 $size-1;
    margin: 0 $size-2 0.2em $size-4;
    margin: 0;
    overflow: hidden;
    font-size: 0.85em;
    list-style: none;
    opacity: 0;

    li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.3em 0.15em;
        border-bottom: solid 1px $color-gray2;

        &:last-child {
            border: 0;
        }

        span {
            font-size: 1em;

            &:last-child,
            &.separator {
                font-family: $secondary-font-stack;
                color: $color-text-muted;
            }

            &:last-child {
                font-size: 0.65em;
            }

            &.separator {
                margin: 0 $size-2;
                font-size: 0.7em;
            }
        }
    }
}

.end-screen {
    position: relative;
    flex-direction: column;
    width: 0;
    height: 0;
    padding: $size-2;
    overflow: hidden;
    background: $color-bg-secondary;
    border: solid 1px $color-gray3;
    border-radius: $border-radius-md;
    box-shadow: $box-shadow;
    @include flexCenterAll;

    h1 {
        position: relative;
        z-index: 2;
        margin: 0;
        color: $color-accent;
        white-space: nowrap;
        opacity: 0;
    }

    hr {
        position: relative;
        z-index: 2;
        width: 86%;
        min-height: 1px;
        margin-top: $size-1;
        background-color: $color-primary-light;
        border: 0;
        opacity: 0;
    }

    .stats {
        position: relative;
        z-index: 2;
        display: flex;
        gap: $size-2;
        align-items: center;
        font-size: 1.1em;
        opacity: 0;
    }
}

.main-buttons {
    display: flex;
    gap: $size-2;
    justify-content: flex-end;
    width: 13.9em;
    margin: 0 auto;

    :deep(button) {
        font-size: 1.4em;
        opacity: 0;
        will-change: transform, opacity;
    }
}
</style>
