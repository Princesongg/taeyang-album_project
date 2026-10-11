import { useEffect, useRef } from 'react';
import './Music.css';

const albums = [
    { name: 'QUINTESSENCE Blue', cover: 'cover-blue', disc: 'disc-blue' },
    { name: 'QUINTESSENCE Pink', cover: 'cover-pink', disc: 'disc-pink' },
    { name: 'QUINTESSENCE Vinyl', cover: 'cover-vinyl', disc: 'disc-vinyl' },
    { name: 'QUINTESSENCE Black', cover: 'cover-black', disc: 'disc-black' },
];
const navigation = [['Concept Photo', '#concept-photo'], ['Play List', '#play-list'], ['Music Video', '#music-video'], ['Documentary', '#documentary']];

export default function Music() {
    const sectionRef = useRef(null);
    useEffect(() => {
        const section = sectionRef.current;
        const stage = section.querySelector('.music__stage');
        const cards = [...section.querySelectorAll('.music__album')];
        const counter = section.querySelector('.music__counter');
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        let previous = 0;
        let current = 0;
        let target = 0;
        let dim = 0;
        let targetDim = 0;
        const spins = albums.map(() => 0);
        const outs = albums.map(() => 0);
        const scrollScreens = .3 + (albums.length - 1) * 1.1;
        // Hold the final sleeve and spinning disc before the next section overlaps.
        const finalAlbumHold = 1;
        section.style.setProperty('--music-scroll-screens', scrollScreens + finalAlbumHold + 1);
        const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
        const render = (time) => {
            const dt = previous ? Math.min(64, time - previous) : 16;
            previous = time;
            current += (target - current) * (1 - Math.exp(-dt / 140));
            dim += (targetDim - dim) * (1 - Math.exp(-dt / 100));
            stage.style.setProperty('--music-dim', dim);
            const mobile = stage.clientWidth <= 700;
            const width = stage.clientWidth;
            const coverWidth = mobile ? width * .56 : Math.min(width * .2928, stage.clientHeight * .52);
            const cardWidth = coverWidth * 833 / 562;
            // The reference spaces albums by their sleeve, not sleeve + disc.
            const step = coverWidth * 1.65;
            stage.style.setProperty('--music-perspective', `${stage.clientHeight / (2 * Math.tan(25 * Math.PI / 180))}px`);
            const leadIn = .3 / scrollScreens;
            const travel = clamp((current - leadIn) / (1 - leadIn)) * step * (albums.length - 1);
            const active = Math.round(travel / step);
            counter.textContent = `/${String(active + 1).padStart(2, '0')}`;
            counter.setAttribute('aria-label', `Album ${active + 1} of ${albums.length}`);
            cards.forEach((card, index) => {
                const distance = index * step - travel;
                const near = clamp(Math.abs(distance) / step);
                const opening = index === active ? (index === 0 ? clamp(current / leadIn) : 1) : 0;
                outs[index] += (opening - outs[index]) * (1 - Math.exp(-dt / 360));
                spins[index] += dt * .04125 * outs[index];
                card.style.width = `${cardWidth}px`;
                card.style.height = `${coverWidth * 575 / 562}px`;
                card.style.top = `${stage.clientHeight * (mobile ? .55 : .5) - coverWidth * 575 / 562 / 2}px`;
                card.style.left = `${width / 2 - coverWidth / 2 + distance}px`;
                card.style.transform = `translateZ(${-Math.min(Math.abs(distance) * .3, coverWidth * .9)}px) rotateY(${clamp(-distance / step, -1, 1) * 34.38}deg)`;
                // Keep the extended disc above the neighbouring sleeve.
                card.style.zIndex = String(Math.round(outs[index] * 100) + Math.round((1 - near) * 10));
                card.style.setProperty('--music-disc-out', outs[index]);
                card.style.setProperty('--music-spin', `${-spins[index] - outs[index] * 66.46}deg`);
            });
            const bounds = section.getBoundingClientRect();
            if (bounds.top < window.innerHeight && bounds.bottom > 0 && !preference.matches) frame = requestAnimationFrame(render);
            else { frame = 0; previous = 0; }
        };
        const update = () => {
            section.classList.toggle('music--reduced', preference.matches);
            const nextSection = section.nextElementSibling;
            const overlap = nextSection?.classList.contains('documentary')
                ? clamp(1 - nextSection.getBoundingClientRect().top / window.innerHeight)
                : 0;
            const press = overlap * overlap * (3 - 2 * overlap);
            targetDim = preference.matches ? 0 : .55 * press;
            target = clamp(-section.getBoundingClientRect().top / (window.innerHeight * scrollScreens));
            if (preference.matches) {
                dim = 0;
                stage.style.setProperty('--music-dim', 0);
                cancelAnimationFrame(frame);
                frame = 0;
                cards.forEach((card) => card.removeAttribute('style'));
            } else if (!frame) frame = requestAnimationFrame(render);
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        preference.addEventListener('change', update);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            preference.removeEventListener('change', update);
        };
    }, []);
    return (
        <section className="music" ref={sectionRef} id="music" aria-label="QUINTESSENCE album editions">
            <div className="music__stage">
                <header className="music__navigation">
                    <a className="music__brand" href="#hero">TAEYANG</a>
                    <nav aria-label="Album section navigation">{navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
                </header>
                <div className="music__gallery">
                    {albums.map(({ name, cover, disc }, index) => (
                        <div className={`music__album music__album--${index}`} key={name} role="img" aria-label={name}>
                            <div className="music__disc"><img src={`/images/music/${disc}.png`} alt="" loading="lazy" /></div>
                            <div className="music__cover"><img src={`/images/music/${cover}.png`} alt="" loading="lazy" /></div>
                        </div>
                    ))}
                </div>
                <span className="music__counter" aria-label="Album 1 of 4">/01</span>
            </div>
        </section>
    );
}
