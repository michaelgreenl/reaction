import { gsap } from 'gsap';
import Flip from 'gsap/Flip';
import { useGsap } from '@/composables/useGsap.js';

gsap.registerPlugin(Flip);

export function useUtilAnimations() {
    const { registerAnim } = useGsap();

    const fadeIn = registerAnim(({ selector, opts, onComplete }) => {
        gsap.set(selector, { opacity: 0 });
        gsap.to(selector, {
            duration: 0.2,
            ease: 'linear',
            opacity: 1,
            ...opts,
            onComplete,
        });
    });

    const fadeOut = registerAnim(({ selector, opts, onComplete }) => {
        gsap.set(selector, { opacity: 1 });
        gsap.to(selector, {
            duration: 0.2,
            ease: 'linear',
            opacity: 0,
            ...opts,
            onComplete,
        });
    });

    const flipFrom = ({ state, opts, onComplete = () => {} }) => {
        Flip.from(state, {
            duration: 0.3,
            ease: 'power3.out',
            ...opts,
            onComplete,
        });
    };

    return {
        fadeIn,
        fadeOut,
        flipFrom,
    };
}
