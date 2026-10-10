import { nextTick } from 'vue';
import { gsap } from 'gsap';
import { useGsap } from '@/composables/useGsap.js';

export function useProfileAnimations({ visibleFilterInputs, isMobile }) {
    const { registerAnim } = useGsap();

    const showFilterDropdownAnim = registerAnim(({ tl }) => {
        tl.to('.filter-toggles', { duration: 0.4, ease: 'power4.out', width: 'auto' })
            .to('.filter-toggles', { duration: 0.3, ease: 'power3.out', height: 'auto' }, 0.05)
            .to('.filter-toggles-form-group', { duration: 0.2, ease: 'linear', opacity: 1 }, 0.1)
            .to('.filter-toggles-button', { duration: 0.2, ease: 'linear', opacity: 1 }, 0.15);
    });

    const hideFilterDropdownAnim = registerAnim(({ tl, onComplete }) => {
        tl.to('.filter-toggles-button', { duration: 0.2, ease: 'linear', opacity: 0, onComplete })
            .to('.filter-toggles-form-group', { duration: 0.2, ease: 'linear', opacity: 0 }, 0.05)
            .to('.filter-toggles', { duration: 0.3, ease: 'power3.out', height: 0 }, 0.1)
            .to('.filter-toggles', { duration: 0.4, ease: 'power4.out', width: 0 }, 0.15);
    });

    const showFilterInputsAnim = registerAnim(({ tl, onStart }) => {
        tl.to('.filters', { duration: 0.4, ease: 'power3.out', height: 'auto', onStart });
    });

    const hideFilterInputsAnim = registerAnim(({ tl, onComplete }) => {
        tl.to('.filter-form-button', { duration: 0.1, ease: 'linear', opacity: 0 }).to(
            '.filters',
            { duration: 0.4, ease: 'power3.out', height: 0, onComplete },
            0.1,
        );
    });

    const getSeperator = (offset) => {
        let seperatorSelector;

        // These conditional checks are necessary since seperators on mobile are different than on desktop
        if (isMobile.value) {
            seperatorSelector = `.seperator-${visibleFilterInputs.value.length - offset}`;
        } else {
            seperatorSelector =
                visibleFilterInputs.value.length === 1 ? null : `.seperator-${visibleFilterInputs.value.length - 2}`;
        }

        return seperatorSelector;
    };

    const enterFilterInputAnim = registerAnim(({ key, tl, delay, onComplete }) => {
        const seperatorSelector = getSeperator(1);

        if (!seperatorSelector) {
            tl.to(`.form-group-${key}`, { duration: 0.3, ease: 'power3.out', opacity: 1, delay, onComplete });
        } else {
            tl.to(seperatorSelector, { duration: 0.3, ease: 'linear', opacity: 1, scale: 1, delay }).to(
                `.form-group-${key}`,
                { duration: 0.3, ease: 'power3.out', delay, opacity: 1, onComplete },
                0,
            );
        }
    });

    const exitFilterInputAnim = registerAnim(({ key, tl, onComplete }) => {
        const seperatorSelector = getSeperator(2);

        if (!seperatorSelector) {
            tl.to(`.form-group-${key}`, { duration: 0.3, ease: 'power3.out', opacity: 0, onComplete });
        } else {
            tl.to(seperatorSelector, { duration: 0.3, ease: 'linear', opacity: 0, scale: 0 }).to(
                `.form-group-${key}`,
                { duration: 0.3, ease: 'power3.out', opacity: 0, onComplete },
                0,
            );
        }
    });

    const enterAllFilterInputsAnim = registerAnim(({ tl, onComplete }) => {
        tl.to('.filter-form-seperator', { duration: 0.3, ease: 'linear', opacity: 1, scale: 1 }, 0).to(
            '.filter-form-group',
            { duration: 0.3, ease: 'power3.out', opacity: 1, stagger: 0.1, onComplete },
            0,
        );
    });

    const exitAllFilterInputsAnim = registerAnim(({ tl, onStart, onComplete }) => {
        tl.to('.filter-form-seperator', { duration: 0.3, ease: 'linear', opacity: 0, scale: 0 }).to(
            '.filter-form-group',
            { duration: 0.3, ease: 'power3.out', opacity: 0, stagger: 0.05, onStart, onComplete },
            0,
        );
    });

    const enterFilterButtonsAnim = registerAnim(({ tl, onComplete }) => {
        tl.to('.filter-form-button', { duration: 0.3, ease: 'linear', opacity: 1, x: 0, stagger: 0.1, onComplete });
    });

    const exitFilterButtonsAnim = registerAnim(({ tl, onComplete }) => {
        tl.to('.filter-form-button', { duration: 0.3, ease: 'linear', opacity: 0, x: 0, stagger: 0.1, onComplete });
    });

    const showTableCellsAnim = registerAnim(({ tl }) => {
        gsap.set('.column-cell span', { opacity: 0 });

        tl.to('.column-cell span', {
            duration: 0.2,
            ease: 'linear',
            opacity: 1,
            stagger: { amount: 0.2, from: 'random', grid: 'auto' },
        });
    });

    const hideTableCellsAnim = registerAnim(({ tl, onComplete }) => {
        tl.to('.column-cell span', {
            duration: 0.2,
            ease: 'linear',
            opacity: 0,
            stagger: { amount: 0.2, from: 'random', grid: 'auto' },
            onComplete,
        });
    });

    const growUserStats = registerAnim(({ tl }) => {
        gsap.set('.user-stats', { width: '22em' });

        tl.to('.user-stats hr', { duration: 0.3, ease: 'linear', opacity: 0, scaleX: 0 })
            .to(
                '.user-stats',
                {
                    duration: 0.3,
                    ease: 'power3.out',
                    width: '33.25em',
                    height: '3em',
                },
                0.3,
            )
            .to('.user-stats-seperator', { duration: 0.3, ease: 'linear', opacity: 1, scale: 1 }, 0.4);
    });

    const shrinkUserStats = registerAnim(({ tl }) => {
        gsap.set('.user-stats', { width: '33.25em' });
        gsap.set('.stat-wrapper', { maxWidth: '20em' });

        tl.to('.user-stats-seperator', { duration: 0.3, ease: 'linear', opacity: 0, scale: 0 }, 0.1)
            .to('.user-stats', {
                duration: 0.3,
                ease: 'power3.out',
                height: '6.3em',
                width: '22em',
            })
            .to('.user-stats hr', { duration: 0.3, ease: 'linear', opacity: 1, scaleX: 1 }, 0.4);
    });

    const showSettingsColumnsAnim = registerAnim(({ tl, onComplete }) => {
        if (!isMobile.value) {
            growUserStats();
        }

        tl.to('.toggle-buttons button', {
            duration: 0.2,
            ease: 'linear',
            opacity: !isMobile.value ? 0 : 1,
            stagger: 0.1,
            onComplete: async () => {
                // showSettings is toggled here
                onComplete();
                await nextTick();

                gsap.set('.setting-cell, .column-header-setting', { width: 0, borderWidth: 0, padding: 0 });
                gsap.set('.setting-cell, .setting-cell span, .column-header-setting', { opacity: 0 });

                const tl2 = gsap.timeline();
                tl2.to('.setting-cell', {
                    duration: 0.3,
                    ease: 'power3.out',
                    width: 'auto',
                    minWidth: '4.25em',
                    borderWidth: 1,
                    padding: '3px 1em',
                    opacity: 1,
                })
                    .to(
                        '.column-header-setting',
                        {
                            duration: 0.3,
                            ease: 'power3.out',
                            width: 'auto',
                            minWidth: '4.25em',
                            borderWidth: 1,
                            padding: '0.5em 0 0.75em',
                        },
                        0,
                    )
                    .to(
                        '.setting-cell span, .column-header-setting',
                        {
                            duration: 0.2,
                            ease: 'linear',
                            opacity: 1,
                            stagger: { amount: 0.2, from: 'random', grid: 'auto' },
                        },
                        0.2,
                    );
            },
        })
            .to('.table-container', { duration: 0.3, ease: 'power3.out', width: '33.25em', maxWidth: '33.25em' })
            .to(
                '.table-header',
                { duration: 0.3, ease: 'power3.out', height: !isMobile.value ? '2.9em' : undefined },
                0.3,
            )
            .to(
                '.toggle-buttons button',
                {
                    duration: 0.2,
                    ease: 'linear',
                    opacity: 1,
                    stagger: 0.1,
                    onComplete: () => {
                        gsap.set('.table-header', { height: 'auto' });
                    },
                },
                0.6,
            );
    });

    const hideSettingsColumnsAnim = registerAnim(({ tl, onComplete }) => {
        if (!isMobile.value) {
            shrinkUserStats();
        }

        tl.to('.setting-cell, .column-header-setting', {
            duration: 0.2,
            ease: 'linear',
            opacity: 0,
            stagger: { amount: 0.2, from: 'random', grid: 'auto' },
            onComplete,
        })
            .to(
                '.setting-cell, .column-header-setting',
                { duration: 0.3, ease: 'power3.out', width: 0, minWidth: 0, borderWidth: 0, padding: 0 },
                0.4,
            )
            .to('.table-header', { duration: 0.3, ease: 'linear', height: '4.3em' }, 0.3)
            .to('.table-container', { duration: 0.3, ease: 'power3.out', width: '22em' }, 0.4);
    });

    return {
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
    };
}
