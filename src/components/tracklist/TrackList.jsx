import { useEffect, useRef } from 'react';
import './TrackList.css';

const tracks = [
    { name: 'BAD' },
    { name: 'LIVE FAST DIE SLOW', title: true },
    { name: 'WOULD YOU', featuring: '(feat. TARZZAN, WOOCHAN)' },
    { name: 'MOVIE' },
    { name: 'OPEN UP', featuring: '(feat. The Kid LAROI)' },
    { name: 'LOVE LIKE THIS' },
    { name: 'YES' },
    { name: 'NOW' },
    { name: 'G.O.A.T' },
    { name: '4U' },
];

const navigation = [
    ['Concept Photo', '#concept-photo'],
    ['Play List', '#play-list'],
    ['Music Video', '#music-video'],
    ['Documentary', '#documentary'],
];

const writeLetters = text => Array.from(text).map((letter, index) => <span className="tracklist__letter" key={index}>{letter}</span>);

export default function TrackList() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const rows = [...sectionRef.current.querySelectorAll('.tracklist__track')];
        let cleanup = () => {};
        const setup = () => {
            cleanup();
            if (preference.matches) return;
            let stopped = false;
            let next = 0;
            let busy = false;
            const visible = new Set();
            const animations = [];
            rows.forEach(row => row.querySelectorAll('.tracklist__letter, .tracklist__badge').forEach(letter => { letter.style.opacity = '0'; }));
            const advance = async () => {
                if (stopped || busy || !visible.has(rows[next])) return;
                busy = true;
                const row = rows[next];
                const letters = [...row.querySelectorAll('.tracklist__letter')];
                const interval = Math.min(45, 1400 / Math.max(letters.length, 1));
                const current = letters.map((letter, index) => {
                    const animation = letter.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, delay: index * interval, fill: 'both' });
                    letter.style.opacity = '';
                    animations.push(animation);
                    return animation;
                });
                const badge = row.querySelector('.tracklist__badge');
                if (badge) {
                    const animation = badge.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, delay: letters.length * interval, fill: 'both' });
                    badge.style.opacity = '';
                    animations.push(animation);
                    current.push(animation);
                }
                await Promise.all(current.map(animation => animation.finished.catch(() => {})));
                if (stopped) return;
                next += 1;
                busy = false;
                advance();
            };
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { visible.add(entry.target); observer.unobserve(entry.target); }
                });
                advance();
            }, { threshold: .25, rootMargin: '0px 0px -5% 0px' });
            rows.forEach(row => observer.observe(row));
            cleanup = () => {
                stopped = true;
                observer.disconnect();
                animations.forEach(animation => animation.cancel());
                rows.forEach(row => row.querySelectorAll('.tracklist__letter, .tracklist__badge').forEach(letter => { letter.style.opacity = ''; }));
            };
        };
        setup();
        preference.addEventListener('change', setup);
        return () => { cleanup(); preference.removeEventListener('change', setup); };
    }, []);

    return (
        <section ref={sectionRef} className="tracklist" id="play-list" aria-labelledby="tracklist-title">
            <header className="tracklist__navigation">
                <a className="tracklist__brand" href="#hero">TAEYANG</a>
                <nav aria-label="Album section navigation">
                    {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
                </nav>
            </header>
            <div className="tracklist__artwork">
                <img src="/images/tracklist/album-open.png" alt="QUINTESSENCE open album with the silver emblem and album introduction" loading="lazy" />
            </div>
            <div className="tracklist__content">
                <div className="tracklist__heading">
                    <p className="tracklist__eyebrow">The 4th Studio Album</p>
                    <h2 id="tracklist-title">QUINTESSENCE</h2>
                    <p className="tracklist__label">Track List</p>
                </div>
                <ol className="tracklist__tracks">
                    {tracks.map(({ name, title, featuring }, index) => (
                        <li className={`tracklist__track${title ? ' tracklist__track--title' : ''}${featuring ? ' tracklist__track--featuring' : ''}`} key={name}>
                            <span className="tracklist__number" aria-hidden="true">{writeLetters(String(index + 1).padStart(2, '0'))}</span>
                            <div className="tracklist__song">
                                <span className="tracklist__song-name">{writeLetters(name)}</span>
                                {featuring && <span className="tracklist__featuring">{writeLetters(featuring)}</span>}
                            </div>
                            {title && <span className="tracklist__badge">Title</span>}
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
