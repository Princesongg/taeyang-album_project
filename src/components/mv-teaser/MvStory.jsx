import { useEffect, useRef, useState } from 'react';
import MvText from '../mv-text/MvText';
import MvTeaser from './MvTeaser';
import './MvStory.css';

export default function MvStory() {
    const storyRef = useRef(null);
    const [videoVisible, setVideoVisible] = useState(false);
    useEffect(() => {
        const story = storyRef.current;
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const photo = story.querySelector('.mv-text__photo--2');
        const canvas = story.querySelector('.mv-text');
        const stage = story.querySelector('.mv-story__stage');
        const videoWindow = story.querySelector('.mv-story__video');
        let frame = 0;
        let current = 0;
        let target = 0;
        let previous = 0;
        const mix = (a, b, p) => a + (b - a) * p;
        const render = (time) => {
            const delta = previous ? Math.min(64, time - previous) : 16;
            previous = time;
            current += (target - current) * (1 - Math.exp(-delta / 90));
            const zoom = Math.max(0, Math.min(1, (current - .15) / .7));
            const eased = zoom * zoom * (3 - 2 * zoom);
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const canvasOffset = (stage.clientHeight - height) / 2;
            photo.style.left = `${mix(width * .17447917, 0, eased)}px`;
            photo.style.top = `${mix(height * .45648148, -canvasOffset, eased)}px`;
            photo.style.width = `${mix(width * .6484375, width, eased)}px`;
            photo.style.height = `${mix(height * .09259259, stage.clientHeight, eased)}px`;
            // Keep the video inside the growing photo window, rather than
            // enlarging the vertically stretched Figma strip into a full frame.
            videoWindow.style.left = photo.style.left;
            videoWindow.style.top = `${mix(height * .45648148 + canvasOffset, 0, eased)}px`;
            videoWindow.style.width = photo.style.width;
            videoWindow.style.height = photo.style.height;
            story.style.setProperty('--mv-video-reveal', Math.max(0, Math.min(1, (zoom - .02) / .18)));
            setVideoVisible(zoom > .02);
            story.style.setProperty('--mv-surroundings', 1 - Math.min(1, zoom * 2));
            if (Math.abs(current - target) > .0005) frame = requestAnimationFrame(render);
            else { frame = 0; previous = 0; }
        };
        const update = () => {
            story.classList.toggle('mv-story--reduced', preference.matches);
            if (preference.matches) {
                setVideoVisible(true);
                cancelAnimationFrame(frame);
                frame = 0;
                photo.removeAttribute('style');
                videoWindow.removeAttribute('style');
                return;
            }
            target = Math.max(0, Math.min(1, -story.getBoundingClientRect().top / (window.innerHeight * 1.5)));
            if (!frame) frame = requestAnimationFrame(render);
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
        <div className="mv-story" ref={storyRef}>
            <div className="mv-story__stage">
                <MvText />
                <div className={`mv-story__video${videoVisible ? ' mv-story__video--visible' : ''}`}><MvTeaser enabled={videoVisible} /></div>
            </div>
        </div>
    );
}
