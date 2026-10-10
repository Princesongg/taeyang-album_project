import { useEffect, useRef } from 'react';
import './ClosingText.css';

const lines = ['THE MOST IMPORTANT', 'BUT UNSEEN.'];

export default function ClosingText() {
    const ref = useRef(null);
    useEffect(() => {
        const section = ref.current;
        const letters = [...section.querySelectorAll('.closing-text__letter')];
        const signature = section.querySelector('.closing-text__signature');
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const animations = [];
        let played = false;
        const show = () => {
            observer.disconnect();
            animations.forEach(animation => animation.cancel());
            letters.forEach(letter => { letter.style.opacity = ''; letter.style.filter = ''; });
            signature.style.opacity = '';
            signature.style.filter = '';
        };
        const observer = new IntersectionObserver(entries => {
            if (played || !entries.some(entry => entry.isIntersecting)) return;
            played = true;
            observer.disconnect();
            letters.forEach((letter, index) => {
                animations.push(letter.animate([{ opacity: .04, filter: 'blur(9px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 650, delay: index * 35, fill: 'both', easing: 'ease-out' }));
                letter.style.opacity = '';
            });
            animations.push(signature.animate([{ opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 700, delay: (letters.length - 1) * 35 + 850, fill: 'both', easing: 'ease-out' }));
            signature.style.opacity = '';
        }, { threshold: .1 });
        if (!preference.matches) {
            letters.forEach(letter => { letter.style.opacity = '0'; });
            signature.style.opacity = '0';
            observer.observe(section);
        }
        const update = () => { if (preference.matches) show(); };
        preference.addEventListener('change', update);
        return () => { show(); preference.removeEventListener('change', update); };
    }, []);
    return <section ref={ref} className="closing-text" aria-label="Album closing message">
        <div className="closing-text__stage">
            <div className="closing-text__content">
                <h2 aria-label="THE MOST IMPORTANT BUT UNSEEN.">{lines.map((line, lineIndex) =>
                    <span className="closing-text__line" aria-hidden="true" key={lineIndex}>{Array.from(line).map((letter, index) =>
                        <span className="closing-text__letter" key={index}>{letter}</span>)}</span>)}</h2>
                <p className="closing-text__signature">TAEYANG · QUINTESSENCE</p>
            </div>
        </div>
    </section>;
}
