import { onUnmounted, shallowRef } from 'vue';
import { gsap } from 'gsap';

export function useGsap(scope) {
    const ctx = shallowRef(null);

    const init = () => {
        if (!ctx.value) {
            ctx.value = gsap.context(() => {}, scope ? scope.value : undefined);
        }
    };

    const registerAnim = (animationLogic) => {
        return (userOptions = {}) => {
            init();

            const defaults = {
                tl: gsap.timeline(),
                delay: 0,
                onComplete: () => {},
                onStart: () => {},
                ...userOptions,
            };

            ctx.value.add(() => {
                animationLogic(defaults);
            });

            return defaults.tl;
        };
    };

    onUnmounted(() => {
        ctx.value?.revert();
    });

    return {
        registerAnim,
        ctx,
    };
}
