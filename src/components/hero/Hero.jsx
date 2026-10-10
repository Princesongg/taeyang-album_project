import { useEffect, useRef } from 'react';
import './Hero.css';

const menuItems = [
    { label: 'Concept Photo', href: '#concept-photo' },
    { label: 'Play List', href: '#play-list' },
    { label: 'Music Video', href: '#music-video' },
    { label: 'Documentary', href: '#documentary' },
];

export default function Hero() {
    const heroRef = useRef(null);

    useEffect(() => {
        const hero = heroRef.current;
        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let observer;
        let disposed = false;
        const animations = [];
        const reset = () => {
            observer?.disconnect();
            animations.forEach((animation) => animation.cancel());
            hero.querySelectorAll('[data-hero-reveal]').forEach((element) => {
                element.removeAttribute('data-motion-pending');
            });
        };
        const onPreferenceChange = () => {
            if (motionPreference.matches) reset();
        };

        if (!motionPreference.matches) {
            const elements = hero.querySelectorAll('[data-hero-reveal]');
            elements.forEach((element) => element.setAttribute('data-motion-pending', ''));
            document.fonts.ready.then(() => {
                if (disposed || motionPreference.matches) return;
                observer = new IntersectionObserver((entries) => {
                    entries.forEach(({ target, isIntersecting }) => {
                        if (!isIntersecting) return;
                        observer.unobserve(target);
                        target.removeAttribute('data-motion-pending');
                        if (target.classList.contains('hero__definition')) {
                            target.querySelectorAll('h2, .hero__meanings').forEach((element, index) => {
                                animations.push(element.animate([
                                    { opacity: 0, transform: 'translateY(24px)' },
                                    { opacity: 1, transform: 'translateY(0)' },
                                ], {
                                    duration: 900,
                                    delay: index === 0 ? 0 : 1100,
                                    easing: 'cubic-bezier(.22, 1, .36, 1)',
                                    fill: 'backwards',
                                }));
                            });
                            return;
                        }
                        const letters = target.querySelectorAll('.hero__letter');
                        if (letters.length) {
                            letters.forEach((letter, index) => {
                                animations.push(letter.animate([
                                    { transform: 'translateY(110%)' },
                                    { transform: 'translateY(0)' },
                                ], {
                                    duration: 1500,
                                    delay: 60 + index * 20,
                                    easing: 'cubic-bezier(.4, 0, .15, 1)',
                                    fill: 'backwards',
                                }));
                            });
                        } else {
                            animations.push(target.animate([
                                { opacity: 0, transform: 'translateY(48px)' },
                                { opacity: 1, transform: 'translateY(0)' },
                            ], {
                                duration: 1500,
                                easing: 'cubic-bezier(.4, 0, .15, 1)',
                                fill: 'backwards',
                            }));
                        }
                    });
                }, { threshold: 0.12 });
                elements.forEach((element) => observer.observe(element));
            });
        }

        motionPreference.addEventListener('change', onPreferenceChange);
        return () => {
            disposed = true;
            reset();
            motionPreference.removeEventListener('change', onPreferenceChange);
        };
    }, []);

    return (
        <section ref={heroRef} className="hero" id="hero" aria-labelledby="hero-title">
            <div className="hero__canvas">
                <header className="hero__header">
                    <a className="hero__brand" href="#hero">TAEYANG</a>
                    <nav className="hero__nav" aria-label="Album navigation">
                        {menuItems.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
                    </nav>
                </header>
                <div className="hero__intro" data-hero-reveal>
                    <p className="hero__album">The 4th Studio Album</p>
                    <p className="hero__description">
                        The word that constantly stays on my mind.<br />
                        And the word that is most needed for this generation.
                    </p>
                </div>
                <h1 id="hero-title" aria-label="QUINTESSENCE">
                    <span className="hero__word hero__word--first" aria-hidden="true" data-hero-reveal>
                        {'QUINTE'.split('').map((letter, index) => <span className="hero__letter" key={index}>{letter}</span>)}
                    </span>
                    <span className="hero__word hero__word--last" aria-hidden="true" data-hero-reveal>
                        {'SSENCE'.split('').map((letter, index) => <span className="hero__letter" key={index}>{letter}</span>)}
                    </span>
                </h1>
                <div className="hero__definition" data-hero-reveal>
                    <h2>QUINTESSENCE</h2>
                    <div className="hero__meanings">
                        <p>1. THE ASPECT OF SOMETHING<br />IN ITS PUREST AND MOST CONCENTRATED FORM.</p>
                        <p>2. ( IN CLASSICAL AND MEDIEVAL PHILOSOPHY ) A FIFTH SUBSTANCE<br />THOUGHT TO COMPOSE THE HEAVENLY BODIES.</p>
                        <p>3. THE MOST PERFECT OR TYPICAL EXAMPLE OF A QUALITY OR CLASS.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
