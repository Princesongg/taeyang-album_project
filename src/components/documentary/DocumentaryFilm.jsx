import { useEffect, useRef, useState } from 'react';
import Teaser from '../teaser/Teaser';
import './DocumentaryFilm.css';

export default function DocumentaryFilm() {
    const ref = useRef(null);
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const section = ref.current;
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        const render = () => {
            frame = 0;
            const height = window.innerHeight;
            const progress = preference.matches ? 1 : Math.max(0, Math.min(1, -section.getBoundingClientRect().top / (height * 1.1)));
            const arrival = Math.min(1, progress / .45);
            const enter = arrival * arrival * (3 - 2 * arrival);
            const expansion = Math.max(0, Math.min(1, (progress - .32) / .68));
            const zoom = expansion * expansion * (3 - 2 * expansion);
            section.style.setProperty('--film-enter', enter);
            section.closest('.documentary').style.setProperty('--documentary-dim', preference.matches ? 0 : enter * .55);
            section.style.setProperty('--film-zoom', zoom);
            section.style.setProperty('--film-fade', Math.max(0, Math.min(1, (progress - .65) / .35)));
            setEnabled(progress > .65);
        };
        const update = () => { if (!frame) frame = requestAnimationFrame(render); };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        preference.addEventListener('change', update);
        return () => {
            cancelAnimationFrame(frame);
            section.closest('.documentary')?.style.removeProperty('--documentary-dim');
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            preference.removeEventListener('change', update);
        };
    }, []);
    return <section className="documentary-film" ref={ref} id="documentary-video" aria-label="QUINTESSENCE documentary film">
        <div className="documentary-film__stage">
            <div className="documentary-film__window">
                <img className="documentary-film__photo" src="/images/documentary/chapter-1.png" alt="TAEYANG documentary filming on set" />
                <Teaser source="/video/QUINTESSENCE THE DOCUMENTARY TEASER TAEYANG.mp4" id="documentary-player" label="TAEYANG QUINTESSENCE The Documentary Teaser" pinned={false} enabled={enabled} className="documentary-film__player" />
            </div>
        </div>
    </section>;
}
