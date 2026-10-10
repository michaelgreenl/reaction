<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import { useBreakpoints } from '@/composables/useBreakpoints.js';
import { gsap } from 'gsap';
import LogoSVG from '@/components/Icons/LogoSVG.vue';

const { isSmPhone, isMobile } = useBreakpoints();

const authStore = useAuthStore();
const route = useRoute();

watch(
    () => authStore.gameActive,
    (newVal) => {
        if (isMobile.value) {
            gsap.to(`.nav-link, ${isSmPhone.value ? '.nav-logo' : undefined}`, {
                duration: 0.2,
                ease: 'linear',
                opacity: newVal ? 0 : 1,
            });
        }
    },
);
</script>

<template>
    <nav class="nav">
        <router-link class="nav-logo" to="/">
            <LogoSVG />
            <h2>Reaction</h2>
        </router-link>
        <router-link
            v-if="!authStore.isAuthenticated && route.fullPath !== '/login' && route.fullPath !== '/register'"
            class="nav-link"
            to="/login"
        >
            Login
        </router-link>
        <router-link v-if="authStore.isAuthenticated && route.fullPath !== '/profile'" class="nav-link" to="/profile"
            >Profile</router-link
        >
        <button
            v-if="authStore.isAuthenticated && route.fullPath === '/profile'"
            class="nav-link"
            @click="authStore.logout"
        >
            Logout
        </button>
    </nav>
</template>

<style lang="scss" scoped>
.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3.2em;
    padding-right: $size-4;
    padding-left: $size-3;
    font-family: $primary-font-stack;

    @include bp-sm-phone {
        padding-right: $size-5;
        padding-left: $size-4;
    }
}

.nav-logo {
    @include flexCenterAll;

    transition: transform 0.2s ease;

    svg {
        width: $size-8;
        height: $size-8;
    }

    h2 {
        margin: 0;
        font-style: italic;
        font-weight: 300;
        color: $color-gray1;
        text-shadow: 1px 1px 2px #0003;
    }

    a {
        margin-left: $size-4;
    }

    &:hover {
        transform: scale(1.02);
    }
}

.nav-link {
    position: relative;
    padding: 0;
    font-family: $primary-font-stack;
    font-size: 0.9em;
    font-weight: 300;
    color: $color-gray1;
    background: transparent;
    border: 0;
    opacity: 1;

    &::after {
        position: absolute;
        right: 110%;
        bottom: -5px;
        left: -10%;
        height: 2px;
        content: '';
        background: $color-bg-secondary;
        border-radius: 2px;
        transition: all 0.2s ease;
    }

    &:hover {
        &::after {
            right: -10%;
        }
    }
}
</style>
