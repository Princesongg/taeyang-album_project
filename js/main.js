'use strict';

// Playback follows visibility, page activity, and motion preferences.
const videoControllers = new WeakMap();
function setVideoEnabled(video, enabled) { videoControllers.get(video)?.(enabled); }
document.querySelectorAll('.teaser__video').forEach(video => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = video.closest('.teaser').id === 'teaser-1';
  let visible = false;
  let manuallyPaused = false;
  let automaticPause = false;
  video.muted = true;
  const sync = () => {
    if (enabled && visible && !document.hidden && !preference.matches && !manuallyPaused) video.play().catch(() => {});
    else { automaticPause = !video.paused; video.pause(); }
  };
  videoControllers.set(video, value => { enabled = value; sync(); });
  video.addEventListener('pause', () => { if (!automaticPause) manuallyPaused = true; automaticPause = false; });
  video.addEventListener('play', () => { manuallyPaused = false; automaticPause = false; });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .35; sync(); }, {threshold: [0, .35]}).observe(video);
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
});

// Opening text
(function () {

const heroRef = { current: document.querySelector('.hero') };


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
                        if (target.classList.contains('hero__word')) {
                            const startX = target.classList.contains('hero__word--first') ? '10vw' : '-10vw';
                            animations.push(target.animate([
                                { opacity: 0, translate: `${startX} 0` },
                                { opacity: 1, translate: '0 0' },
                            ], {
                                duration: 1800,
                                easing: 'cubic-bezier(.22, 1, .36, 1)',
                                fill: 'backwards',
                            }));
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
})();

// Concept photos
(function () {
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


const sectionRef = { current: document.querySelector('.album-photo') };
const stageRef = { current: document.querySelector('.album-photo__stage') };


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
})();

// Track list
(function () {

const sectionRef = { current: document.querySelector('.tracklist') };


        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const rows = [...sectionRef.current.querySelectorAll('.tracklist__track')];
        const artwork = sectionRef.current.querySelector('.tracklist__artwork');
        const stage = sectionRef.current.querySelector('.tracklist__stage');
        let cleanup = () => {};
        const setup = () => {
            cleanup();
            if (preference.matches) return;
            let frame = 0;
            const stepDistance = 280;
            const scrollDistance = rows.length * stepDistance;
            let pinTop = 0;
            const measure = () => {
                const stageHeight = stage.getBoundingClientRect().height;
                pinTop = Math.min(0, window.innerHeight - stageHeight);
                sectionRef.current.style.height = `${stageHeight + scrollDistance}px`;
                stage.style.setProperty('--tracklist-pin-top', `${pinTop}px`);
            };
            sectionRef.current.classList.add('tracklist--pinned');
            measure();
            const animations = [];
            const rowLetters = rows.map(row => [...row.querySelectorAll('.tracklist__letter')]);
            const updateColors = () => {
                frame = 0;
                const distance = pinTop - sectionRef.current.getBoundingClientRect().top;
                const activeIndex = Math.max(0, Math.min(rows.length - 1, Math.floor(distance / stepDistance)));
                rows.forEach((row, rowIndex) => {
                    const color = rowIndex === activeIndex ? '#013db9' : '#989898';
                    const letters = rowLetters[rowIndex];
                    letters.forEach(letter => { letter.style.color = color; });
                    const badge = row.querySelector('.tracklist__badge');
                    if (badge) badge.style.backgroundColor = color;
                });
            };
            const scheduleColors = () => {
                if (!frame) frame = requestAnimationFrame(updateColors);
            };
            const resizeObserver = new ResizeObserver(() => { measure(); scheduleColors(); });
            resizeObserver.observe(stage);
            artwork.style.opacity = '0';
            const artworkObserver = new IntersectionObserver(entries => {
                if (!entries.some(entry => entry.isIntersecting)) return;
                animations.push(artwork.animate([
                    { opacity: 0, transform: 'translateY(72px)' },
                    { opacity: 1, transform: 'translateY(0)' },
                ], { duration: 1100, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }));
                artwork.style.opacity = '';
                artworkObserver.disconnect();
            }, { threshold: .15 });
            artworkObserver.observe(artwork);
            window.addEventListener('scroll', scheduleColors, { passive: true });
            window.addEventListener('resize', scheduleColors);
            updateColors();
            cleanup = () => {
                window.removeEventListener('scroll', scheduleColors);
                window.removeEventListener('resize', scheduleColors);
                cancelAnimationFrame(frame);
                resizeObserver.disconnect();
                sectionRef.current.classList.remove('tracklist--pinned');
                sectionRef.current.style.height = '';
                stage.style.removeProperty('--tracklist-pin-top');
                artworkObserver.disconnect();
                animations.forEach(animation => animation.cancel());
                artwork.style.opacity = '';
                rows.forEach(row => {
                    row.querySelectorAll('.tracklist__letter').forEach(letter => { letter.style.color = ''; });
                    const badge = row.querySelector('.tracklist__badge');
                    if (badge) badge.style.backgroundColor = '';
                });
            };
        };
        setup();
        preference.addEventListener('change', setup);
        return () => { cleanup(); preference.removeEventListener('change', setup); };
})();

// Music video lettering
(function () {

const sectionRef = { current: document.querySelector('.mv-text') };


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
})();

// Music video expansion
(function () {

const storyRef = { current: document.querySelector('.mv-story') };
const setVideoVisible = value => { document.querySelector('.mv-story__video').classList.toggle('mv-story__video--visible', value); setVideoEnabled(document.querySelector('#music-video video'), value); };

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
})();

// Album editions
(function () {
const albums = [
    { name: 'QUINTESSENCE Blue', cover: 'cover-blue', disc: 'disc-blue' },
    { name: 'QUINTESSENCE Pink', cover: 'cover-pink', disc: 'disc-pink' },
    { name: 'QUINTESSENCE Vinyl', cover: 'cover-vinyl', disc: 'disc-vinyl' },
    { name: 'QUINTESSENCE Black', cover: 'cover-black', disc: 'disc-black' },
];

const sectionRef = { current: document.querySelector('.music') };


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
})();

// Documentary cards
(function () { const sectionRef = {current: document.querySelector('.documentary')};
        const section = sectionRef.current;
        const cards = [...section.querySelectorAll('.documentary__card')];
        const stack = section.querySelector('.documentary__cards');
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        const render = () => {
            frame = 0;
            const stackTop = stack.getBoundingClientRect().top;
            const height = window.innerHeight;
            const clamp = value => Math.max(0, Math.min(1, value));
            const entrance = clamp((height * .95 - stackTop) / (height * .65));
            const exit = clamp((stackTop + stack.offsetHeight) / (height * .4));
            const shade = entrance * entrance * (3 - 2 * entrance) * exit;
            section.style.setProperty('--documentary-card-dim', preference.matches ? 0 : shade * .22);
            cards.forEach(card => {
                if (preference.matches) { card.style.transform = ''; return; }
                // Measure the unchanged layout position so the transform cannot feed back into itself.
                const top = stackTop + card.offsetTop;
                const progress = Math.max(0, Math.min(1, (height * .98 - top) / (height * .72)));
                const remaining = (1 - progress) ** 2;
                card.style.transform = `translateY(${Math.min(180, height * .2) * remaining}px) rotateX(${5 * remaining}deg)`;
            });
        };
        const update = () => { if (!frame) frame = requestAnimationFrame(render); };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        preference.addEventListener('change', update);
        return () => {
            cancelAnimationFrame(frame);
            section.style.removeProperty('--documentary-card-dim');
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            preference.removeEventListener('change', update);
        }; })();

// Keep documentary copy readable from the start; stagger subtle digital flickers.
document.querySelectorAll('.documentary__letter').forEach((letter, index) => {
    if (!letter.textContent.trim() || index % 4 !== 0) return;
    letter.classList.add('documentary__letter--flicker');
    letter.style.setProperty('--flicker-duration', `${5.8 + (index % 7) * .43}s`);
    letter.style.setProperty('--flicker-delay', `${-(index * .71 % 9)}s`);
});
document.querySelectorAll('.documentary__ring').forEach(element => { const svgRef = {current: element}; const back = element.classList.contains('documentary__ring--back');
        const svg = svgRef.current;
        const textPath = svg.querySelector('textPath');
        const perimeter = svg.querySelector('path').getTotalLength();
        svg.querySelector('text').setAttribute('textLength', perimeter * 3);
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const started = performance.now();
        let frame = 0;
        let visible = false;
        const render = time => {
            const phase = ((time - started) / (back ? 110000 : 80000)) % 1;
            textPath.setAttribute('startOffset', back ? -perimeter + phase * perimeter : -phase * perimeter);
            frame = requestAnimationFrame(render);
        };
        const update = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(render);
        };
        const observer = new IntersectionObserver(entries => {
            visible = entries.some(entry => entry.isIntersecting);
            update();
        });
        observer.observe(svg);
        preference.addEventListener('change', update);
        document.addEventListener('visibilitychange', update);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            preference.removeEventListener('change', update);
            document.removeEventListener('visibilitychange', update);
        }; });

// Documentary film expansion
(function () {

const ref = { current: document.querySelector('.documentary-film') };
const setEnabled = value => setVideoEnabled(document.querySelector('#documentary-player video'), value);

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
})();

// Closing message
(function () {

const ref = { current: document.querySelector('.closing-text') };


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
})();

// Footer title: fade from faint to solid once it enters the viewport.
(function () {
    const title = document.querySelector('.album-footer__title');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!title || preference.matches) return;
    let animation;
    title.style.opacity = '.12';
    const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        animation = title.animate([
            { opacity: .12 },
            { opacity: 1 },
        ], {
            duration: 1800,
            easing: 'ease-in-out',
            fill: 'backwards',
        });
        title.style.opacity = '';
    }, { threshold: .2 });
    observer.observe(title);
    preference.addEventListener('change', () => {
        if (!preference.matches) return;
        observer.disconnect();
        animation?.cancel();
        title.style.opacity = '';
    });
})();

// Back to top.
const topButton = document.querySelector('.top-button');
topButton.setAttribute('aria-label', '맨 위로 이동');
const updateTopButton = () => { topButton.hidden = window.scrollY <= window.innerHeight * .6; };
window.addEventListener('scroll', updateTopButton, { passive: true });
window.addEventListener('resize', updateTopButton);
topButton.addEventListener('click', () => window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
updateTopButton();
// Respect motion preferences for the locally hosted 3D viewer.
const model = document.querySelector('model-viewer');
const modelPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const updateModel = () => model.toggleAttribute('auto-rotate', !modelPreference.matches);
modelPreference.addEventListener('change', updateModel);
updateModel();
