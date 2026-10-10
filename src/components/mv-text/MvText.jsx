import { useEffect, useRef } from 'react';
import './MvText.css';

const layers = [0, 1, 2, 3];

export default function MvText() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const animations = [];
        let observer;
        const clear = () => {
            observer?.disconnect();
            animations.splice(0).forEach((animation) => animation.cancel());
        };
        const setup = () => {
            clear();
            if (preference.matches) return;
            const pending = new Map();
            section.querySelectorAll('.mv-text__phrase').forEach((phrase) => {
                const texts = [...phrase.querySelectorAll('.mv-text__layer')];
                if (phrase.classList.contains('mv-text__phrase--die')) texts.reverse();
                const sequence = texts.map((text, index) => {
                    const opacity = Number(getComputedStyle(text).getPropertyValue('--mv-opacity'));
                    const animation = text.animate([
                        { transform: 'translateY(-0.75em)', opacity: 0 },
                        { transform: 'translateY(-0.6em)', opacity: opacity * .35, offset: .25 },
                        { transform: 'translateY(0)', opacity },
                    ], {
                        duration: 1800,
                        delay: index * 600,
                        easing: 'cubic-bezier(.22, .61, .36, 1)',
                        fill: 'both',
                    });
                    animation.pause();
                    animations.push(animation);
                    return animation;
                });
                pending.set(phrase, sequence);
            });
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    pending.get(entry.target)?.forEach((animation) => animation.play());
                    observer.unobserve(entry.target);
                });
            }, { threshold: .35 });
            pending.forEach((_, phrase) => observer.observe(phrase));
        };
        setup();
        preference.addEventListener('change', setup);
        return () => {
            clear();
            preference.removeEventListener('change', setup);
        };
    }, []);

    return (
        <section className="mv-text" ref={sectionRef} aria-label="LIVE FAST DIE SLOW">
            <div className="mv-text__phrase mv-text__phrase--live" aria-label="LIVE FAST">
                {layers.map((layer) => <span key={layer} aria-hidden="true" className={`mv-text__layer mv-text__layer--${layer}`}>LIVE FAST</span>)}
            </div>
            <div className="mv-text__phrase mv-text__phrase--die" aria-label="DIE SLOW">
                {layers.map((layer) => <span key={layer} aria-hidden="true" className={`mv-text__layer mv-text__layer--${layer}`}>DIE SLOW</span>)}
            </div>
            <img className="mv-text__photo mv-text__photo--1" src="/images/mv-text/photo-1.png" alt="LIVE FAST DIE SLOW music video scene" loading="lazy" />
            <img className="mv-text__photo mv-text__photo--2" src="/images/mv-text/photo-2.png" alt="TAEYANG wearing sunglasses" loading="lazy" />
            <img className="mv-text__photo mv-text__photo--3" src="/images/mv-text/photo-3.png" alt="Music video scene with a car" loading="lazy" />
            <img className="mv-text__logo" src="/images/mv-text/logo.png" alt="QUINTESSENCE" loading="lazy" />
            <p className="mv-text__artist">TAEYANG</p>
        </section>
    );
}
