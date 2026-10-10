import { useEffect, useRef } from 'react';
import './AlbumPhoto.css';

const assetPath = '/images/album';
const photos = [
    { id: 1, x: 1078.8705, y: 952.0845, width: 188, height: 242, angle: 13.04 },
    { id: 2, x: 988.5, y: 308, width: 355, height: 222, angle: 0 },
    { id: 3, x: 579.469, y: 361.251, width: 247.215, height: 370.823, angle: -20.83 },
    { id: 4, x: 643, y: 840, width: 336, height: 224, angle: 8.37 },
    { id: 5, x: 1267.34, y: 797.505, width: 245.133, height: 321.313, angle: -2.83 },
    { id: 6, x: 1398, y: 353, width: 392, height: 490, angle: 6.1 },
];
const gallery = [6, 5, 3, 1];
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function Snapshot({ photo }) {
    const { id, x, y, width, height, angle } = photo;
    return (
        <div className={`album-photo__snapshot album-photo__snapshot--${id}`} style={{
            left: `${x / 1920 * 100}%`, top: `${y / 1200 * 100}%`,
            width: `${width / 1920 * 100}%`, height: `${height / 1200 * 100}%`,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        }}>
            <img src={`${assetPath}/photo-${id}.png`} alt="" draggable="false" />
        </div>
    );
}

export default function AlbumPhoto() {
    const sectionRef = useRef(null);
    const stageRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        let metrics;
        let current = 0;
        let dim = 0;
        let lastTime = 0;
        const panels = [...stage.querySelectorAll('.album-photo__panel')];
        const smooth = (value) => { const p = clamp(value); return p * p * (3 - 2 * p); };

        const measure = () => {
            const width = stage.clientWidth;
            const height = stage.clientHeight;
            const canvasWidth = Math.min(width, height * 1.6);
            const defaultPanelWidth = Math.max(height * .8, width * .72);
            const panelWidths = gallery.map((id) => {
                if (id === 6) return Math.min(defaultPanelWidth, height * 1084 / 1041);
                if (id === 5) return Math.min(defaultPanelWidth, height * 1424 / 1208);
                if (id === 3) return Math.min(defaultPanelWidth, height * 906 / 777);
                if (id === 1) return Math.min(defaultPanelWidth, height * 717 / 663);
                return defaultPanelWidth;
            });
            const panelWidth = panelWidths[0];
            const galleryStart = (width - panelWidth) / 2;
            const panelOffsets = panelWidths.map((_, index) => panelWidths.slice(0, index).reduce((sum, value) => sum + value, 0));
            const travel = Math.max(0, galleryStart + panelWidths.reduce((sum, value) => sum + value, 0) - width);
            metrics = {
                width, height, panelWidth, panelWidths, panelOffsets, galleryStart, travel,
                canvasWidth,
                zoomDistance: height * 1.5, slideDistance: travel / 1.8,
                startX: (width - canvasWidth) / 2 + canvasWidth * 1398 / 1920,
                startY: (height - canvasWidth * .625) / 2 + canvasWidth * 353 / 1920,
                startWidth: canvasWidth * 392 / 1920,
                startHeight: canvasWidth * 490 / 1920,
            };
            section.style.setProperty('--album-scroll-distance', `${metrics.zoomDistance + metrics.slideDistance + height * .15}px`);
            section.style.setProperty('--album-gallery-start', `${galleryStart}px`);
            section.style.setProperty('--album-panel-width', `${panelWidth}px`);
            current = clamp(-section.getBoundingClientRect().top, 0, metrics.zoomDistance + metrics.slideDistance);
            schedule();
        };

        const render = (time) => {
            frame = 0;
            if (preference.matches || !metrics) return;
            const target = clamp(-section.getBoundingClientRect().top, 0, metrics.zoomDistance + metrics.slideDistance);
            const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
            lastTime = time;
            const teaser = section.nextElementSibling;
            const overlap = teaser?.classList.contains('teaser')
                ? clamp(1 - teaser.getBoundingClientRect().top / window.innerHeight)
                : 0;
            const targetDim = smooth(overlap) * .6;
            dim += (targetDim - dim) * (1 - Math.exp(-elapsed / 80));
            if (Math.abs(targetDim - dim) < .001) dim = targetDim;
            stage.style.setProperty('--album-teaser-dim', dim);
            current += (target - current) * (1 - Math.exp(-elapsed / 45));
            if (Math.abs(target - current) < .15) current = target;
            const zoom = clamp(current / metrics.zoomDistance);
            // First establish the portrait in the centre, then expand the whole scene.
            const centre = smooth(zoom / .22);
            const growth = clamp((zoom - .22) / .78);
            const align = smooth((growth - .35) / .65);
            const mix = (from, to, progress) => from + (to - from) * progress;
            // Horizontal movement overlaps the end of enlargement so the phases join.
            const slideStart = metrics.zoomDistance * .88;
            const shift = clamp((current - slideStart) * 1.8, 0, metrics.travel);
            const centreWidth = Math.min(metrics.width * .36, metrics.height * .6);
            const centreHeight = centreWidth * 1.25;
            stage.style.setProperty('--album-lead-x', `${mix(metrics.startX, metrics.width / 2, centre)}px`);
            stage.style.setProperty('--album-lead-y', `${mix(metrics.startY, metrics.height / 2, centre)}px`);
            stage.style.setProperty('--album-lead-width', `${mix(mix(metrics.startWidth, centreWidth, centre), metrics.panelWidth, growth)}px`);
            stage.style.setProperty('--album-lead-height', `${mix(mix(metrics.startHeight, centreHeight, centre), metrics.height, growth)}px`);
            stage.style.setProperty('--album-lead-angle', `${6.1 * (1 - centre)}deg`);
            stage.style.setProperty('--album-cover-opacity', 1 - smooth(zoom / .16));
            stage.style.setProperty('--album-spread', 1 + centre * .5 + growth * .9);
            stage.style.setProperty('--album-photo-opacity', 1 - smooth((growth - .55) / .45));
            panels.slice(1).forEach((panel, index) => {
                const photo = photos.find(({ id }) => id === gallery[index + 1]);
                const x = (metrics.width - metrics.canvasWidth) / 2 + photo.x * metrics.canvasWidth / 1920;
                const y = (metrics.height - metrics.canvasWidth * .625) / 2 + photo.y * metrics.canvasWidth / 1920;
                const spreadX = metrics.width / 2 + (x - metrics.width / 2) * (1 + centre * .5 + growth * .9);
                const spreadY = metrics.height / 2 + (y - metrics.height / 2) * (1 + centre * .5 + growth * .9);
                const finalWidth = metrics.panelWidths[index + 1];
                const finalX = metrics.galleryStart + metrics.panelOffsets[index + 1] + finalWidth / 2;
                panel.style.setProperty('--panel-x', `${mix(spreadX, finalX, align)}px`);
                panel.style.setProperty('--panel-y', `${mix(spreadY, metrics.height / 2, align)}px`);
                panel.style.setProperty('--panel-width', `${mix(photo.width * metrics.canvasWidth / 1920 * (1 - centre * .25 - growth * .15), finalWidth, align)}px`);
                panel.style.setProperty('--panel-height', `${mix(photo.height * metrics.canvasWidth / 1920 * (1 - centre * .25 - growth * .15), metrics.height, align)}px`);
                panel.style.setProperty('--panel-angle', `${photo.angle * (1 - align)}deg`);
            });
            stage.style.setProperty('--album-shift', `${-shift}px`);
            if (current !== target || dim !== targetDim) frame = requestAnimationFrame(render);
            else lastTime = 0;
        };

        function schedule() {
            if (!frame && !preference.matches) frame = requestAnimationFrame(render);
        }

        const onPreference = () => {
            section.classList.toggle('album-photo--reduced', preference.matches);
            if (preference.matches) {
                cancelAnimationFrame(frame);
                frame = 0;
                stage.removeAttribute('style');
                panels.forEach((panel) => panel.removeAttribute('style'));
            } else measure();
        };

        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(stage);
        window.addEventListener('scroll', schedule, { passive: true });
        preference.addEventListener('change', onPreference);
        onPreference();
        measure();

        return () => {
            cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            window.removeEventListener('scroll', schedule);
            preference.removeEventListener('change', onPreference);
        };
    }, []);

    return (
        <section className="album-photo" id="concept-photo" ref={sectionRef} aria-label="QUINTESSENCE album and concept photos">
            <div className="album-photo__stage" ref={stageRef}>
                <div className="album-photo__world">
                    <div className="album-photo__canvas">
                        <div className="album-photo__scatter" aria-hidden="true">
                            {photos.filter(({ id }) => !gallery.includes(id)).map((photo) => <Snapshot key={photo.id} photo={photo} />)}
                        </div>
                        <div className="album-photo__cover">
                            <img src={`${assetPath}/album-blue.png`} alt="TAEYANG — QUINTESSENCE blue album" draggable="false" />
                        </div>
                    </div>
                    <figure className="album-photo__lead">
                        <img src={`${assetPath}/photo-6.png`} alt="TAEYANG QUINTESSENCE black and white portrait" draggable="false" />
                    </figure>
                    <div className="album-photo__gallery">
                        {gallery.map((id) => (
                            <figure className={`album-photo__panel album-photo__panel--${id}`} key={id}>
                                <img src={`${assetPath}/photo-${id}.png`} alt={`TAEYANG QUINTESSENCE concept photo ${id}`} draggable="false" />
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
