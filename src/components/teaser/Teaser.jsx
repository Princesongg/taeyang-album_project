import { useEffect, useRef, useState } from 'react';
import './Teaser.css';

const videoSource = '/video/QUINTESSENCE VISUAL FILM TAEYANG.mp4';

export default function Teaser({
    source = videoSource,
    id = 'teaser-1',
    label = 'TAEYANG QUINTESSENCE Visual Film',
    pinned = true,
    enabled = true,
    showControls = false,
    className = '',
}) {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!enabled) {
            video.pause();
            return;
        }
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let visible = false;
        let manuallyPaused = false;
        let automaticPause = false;

        const syncPlayback = () => {
            if (visible && !document.hidden && !preference.matches && !manuallyPaused) {
                video.play().catch(() => {});
            } else if (!visible || document.hidden || preference.matches) {
                automaticPause = true;
                video.pause();
            }
        };
        const onPause = () => {
            if (!automaticPause) manuallyPaused = true;
            automaticPause = false;
        };
        const onPlay = () => { manuallyPaused = false; automaticPause = false; };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting && entry.intersectionRatio >= .35;
            syncPlayback();
        }, { threshold: [0, .35] });

        video.addEventListener('pause', onPause);
        video.addEventListener('play', onPlay);
        document.addEventListener('visibilitychange', syncPlayback);
        preference.addEventListener('change', syncPlayback);
        observer.observe(video);
        return () => {
            observer.disconnect();
            video.removeEventListener('pause', onPause);
            video.removeEventListener('play', onPlay);
            document.removeEventListener('visibilitychange', syncPlayback);
            preference.removeEventListener('change', syncPlayback);
            video.pause();
        };
    }, [enabled]);

    const togglePlayback = () => {
        const video = videoRef.current;
        if (video.paused) video.play().catch(() => {});
        else video.pause();
    };

    return (
        <section className={`teaser${pinned ? "" : " teaser--inline"} ${className}`} id={id} aria-label={label}>
            <div className="teaser__stage">
            <video
                ref={videoRef}
                className="teaser__video"
                src={source}
                muted={muted}
                loop
                playsInline
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                aria-label={label}
            />
            {showControls && <div className="teaser__controls">
                <button type="button" onClick={togglePlayback} aria-label={playing ? 'Pause teaser' : 'Play teaser'}>
                    {playing ? 'Pause' : 'Play'}
                </button>
                <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Unmute teaser' : 'Mute teaser'} aria-pressed={!muted}>
                    {muted ? 'Sound on' : 'Sound off'}
                </button>
            </div>}
            </div>
        </section>
    );
}
