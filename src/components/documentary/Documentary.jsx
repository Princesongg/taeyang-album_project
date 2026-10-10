import { Children, cloneElement, isValidElement, useEffect, useRef } from 'react';
import './Documentary.css';
import DocumentaryFilm from './DocumentaryFilm';

const asset = (name) => `/images/documentary/${name}`;
const box = (x, y, width, height) => ({ left: `${x / 6.8}%`, top: `${y / 6.8}cqw`, width: `${width / 6.8}%`, height: height == null ? undefined : `${height / 6.8}cqw` });

function Writing({ as: Tag = 'p', children, ...props }) {
    const ref = useRef(null);
    useEffect(() => {
        const element = ref.current;
        const letters = [...element.querySelectorAll('.documentary__letter')];
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (preference.matches) return;
        letters.forEach(letter => { letter.style.opacity = '0'; });
        const animations = [];
        const show = () => {
            letters.forEach(letter => { letter.style.opacity = ''; });
            animations.forEach(animation => animation.cancel());
        };
        const observer = new IntersectionObserver(entries => {
            if (!entries.some(entry => entry.isIntersecting)) return;
            observer.disconnect();
            const interval = Math.min(48, 4500 / Math.max(letters.length, 1));
            letters.forEach((letter, index) => {
                animations.push(letter.animate([{ opacity: 0 }, { opacity: 1 }], {
                    duration: 130, delay: index * interval, fill: 'both', easing: 'ease-out',
                }));
                letter.style.opacity = '';
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
        observer.observe(element);
        preference.addEventListener('change', show);
        return () => { observer.disconnect(); show(); preference.removeEventListener('change', show); };
    }, []);
    const split = nodes => Children.map(nodes, child => {
        if (typeof child === 'string') return Array.from(child).map((letter, index) =>
            <span className="documentary__letter" key={index}>{letter}</span>);
        if (isValidElement(child) && child.props.children) return cloneElement(child, {}, split(child.props.children));
        return child;
    });
    return <Tag ref={ref} {...props}>{split(children)}</Tag>;
}

function Photo({ name, x, y, width, height, crop, className = '', alt = '' }) {
    return <div className={`documentary__photo ${className}`} style={box(x, y, width, height)}>
        <img src={asset(name)} alt={alt} loading="lazy" style={crop ? { width: `${crop[0]}%`, height: `${crop[1]}%`, left: `${crop[2]}%`, top: `${crop[3]}%` } : undefined} />
    </div>;
}

function TextOrbit({ back = false }) {
    const svgRef = useRef(null);
    useEffect(() => {
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
        };
    }, [back]);
    const id = back ? 'documentary-orbit-back' : 'documentary-orbit-front';
    const radiusX = 742;
    const radiusY = 326;
    const h = ((radiusX - radiusY) / (radiusX + radiusY)) ** 2;
    const length = Math.PI * (radiusX + radiusY) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
    const phrase = "TAE YANG THE 4TH STUDIO ALBUM ‘QUINTESSENCE’  ".repeat(4);
    return <svg ref={svgRef} className={`documentary__ring documentary__ring--${back ? 'back' : 'front'}`} viewBox="0 0 1524 696">
        <defs><path id={id} d="M 20 348 A 742 326 0 1 1 1504 348 A 742 326 0 1 1 20 348" /></defs>
        <text fill="currentColor" fontSize="21" textLength={length * 3} lengthAdjust="spacing">
            <textPath href={`#${id}`} startOffset="0">
                {phrase.repeat(3)}
            </textPath>
        </text>
    </svg>;
}

function AlbumExplanation() {
    return <article className="documentary__card documentary__card--album" aria-label="About QUINTESSENCE">
        <Writing as="h2" className="documentary__album-title">TAEYANG<br />'QUINTESSENCE'</Writing>
        <Writing as="p" className="documentary__copy" style={box(129, 152, 530)}>&gt; ‘QUINTESSENCE’는 본질에 대한 태양의 오랜 고민에서 출발한 앨범이다.<br />보이지 않지만 가장 중요한 가치를 찾아가는 그 여정을 음악으로 구현해 냈다.</Writing>
        <Photo name="album.png" x={139} y={202} width={450} height={300} crop={[100, 150, 0, -21.53]} alt="QUINTESSENCE blue album and CD" />
        <Writing as="p" className="documentary__copy" style={box(137, 513, 535)}>이번 앨범에서 태양은 섣불리 정답을 정의하기보다, 찾아가는 과정에서<br />마주한 스스로의 물음과 감정, 그리고 그에 임하는 본인의 태도에 집중했다.</Writing>
        <Photo name="strip-1.png" x={0} y={571} width={680} height={140} />
        <Photo name="strip-2.png" x={0} y={721} width={680} height={50} />
        <Photo name="strip-3.png" x={0} y={781} width={680} height={20} />
        <Writing as="p" className="documentary__copy" style={box(109, 828, 560)}>아티스트 개인의 서사로 시작된 이 질문들이 음악을 통해,<br />청자 각자의 내면에 자리한 본질적인 무언가를 건드리는 울림으로 확장되길 기대한다.</Writing>
        <Photo name="portrait.png" x={190} y={885} width={300} height={140} className="documentary__photo--cover" />
        <Photo name="wing.png" x={531} y={40} width={196.439} height={271} className="documentary__wing" />
        <img className="documentary__line" style={{ top: `${1055 / 6.8}cqw` }} src={asset('line-white.svg')} alt="" />
        <time className="documentary__date" style={{ top: `${1059 / 6.8}cqw` }} dateTime="2026-05-18">2026.05.18</time>
    </article>;
}

function DocumentaryExplanation() {
    return <article className="documentary__card documentary__card--chapters" aria-labelledby="documentary-heading">
        <Writing as="h2" id="documentary-heading" className="documentary__chapter-title">QUINTESSENCE: THE DOCUMENTARY</Writing>
        <Photo name="chapter-1.png" x={72} y={157} width={300} height={200} className="documentary__round--right documentary__photo--cover" />
        <div className="documentary__chapter-copy documentary__chapter-copy--right" style={box(349, 178.2, 260)}><Writing as="h3">CHAPTER 1 'DIFFERENCE'</Writing><Writing as="p">새로운 프로듀서와 아티스트들을 만나<br />익숙함을 벗어나 ‘다름’을 마주한 시작.</Writing></div>
        <Photo name="title-1.png" x={409} y={257} width={200} height={100} crop={[161.33, 181.5, -30.67, -40.5]} />
        <div className="documentary__chapter-copy" style={box(72, 381.8, 212)}><Writing as="h3">CHAPTER 2 'CONFLUENCE'</Writing><Writing as="p">The Kid LAROI를 비롯한<br />다양한 음악적 색이<br />‘TAEYANG’이라는 하나의<br />사운드로 만나는 순간.</Writing></div>
        <Photo name="title-2.png" x={72} y={497} width={212} height={100} crop={[155.32, 184.34, -27.66, -42.34]} />
        <Photo name="chapter-2.png" x={309} y={397} width={300} height={200} crop={[136.89, 115.5, -18.59, 0]} className="documentary__round--left" />
        <Photo name="chapter-3.png" x={72} y={637} width={267} height={200} crop={[156.47, 117.5, -14.71, -2.5]} className="documentary__round--right" />
        <div className="documentary__chapter-copy documentary__chapter-copy--right" style={box(349, 645, 260)}><Writing as="h3">CHAPTER 3 'ESSENCE'</Writing><Writing as="p">수많은 고민과 시도 끝에 도달한 가장<br />순수한 음악적 본질,<br />그리고 ‘LIVE FAST DIE SLOW’.</Writing></div>
        <Photo name="title-3.png" x={369} y={737} width={240} height={100} crop={[148.89, 201, -24.44, -50]} />
        <Writing as="p" className="documentary__closing" style={box(72, 857, 537)}>다름을 지나, 융합을 거쳐, 결국 본질로.<br />태양이 9년의 시간 끝에 찾아낸 ‘QUINTESSENCE’를 만나보자.</Writing>
        <img className="documentary__line" style={{ top: `${907 / 6.8}cqw` }} src={asset('line-blue.svg')} alt="" />
        <time className="documentary__date" style={{ top: `${911 / 6.8}cqw` }} dateTime="2026-05-13">2026.05.13</time>
    </article>;
}

export default function Documentary() {
    const sectionRef = useRef(null);
    useEffect(() => {
        const cards = [...sectionRef.current.querySelectorAll('.documentary__card')];
        const stack = sectionRef.current.querySelector('.documentary__cards');
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        const render = () => {
            frame = 0;
            const stackTop = stack.getBoundingClientRect().top;
            const height = window.innerHeight;
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
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            preference.removeEventListener('change', update);
        };
    }, []);
    return <section ref={sectionRef} className="documentary" id="documentary" aria-label="QUINTESSENCE album story">
        <div className="documentary__background" aria-hidden="true">
            <div className="documentary__stars">{Array.from({ length: 32 }, (_, index) =>
                <span className="documentary__star" key={index} style={{
                    left: `${8 + (index * 29 % 84)}%`, top: `${8 + (index * 37 % 82)}%`,
                    '--star-size': `${index % 3 === 0 ? 7 : 4}px`,
                    '--star-duration': `${14 + index % 5 * 3}s`, '--star-delay': `${-index * 2.3}s`,
                }} />)}</div>
            <TextOrbit />
            <TextOrbit back />
            <span className="documentary__vertical documentary__vertical--right">QUINTESSENCE</span>
            <span className="documentary__vertical documentary__vertical--left">TAE YANG</span>
        </div>
        <div className="documentary__cards"><AlbumExplanation /><DocumentaryExplanation /></div>
        <DocumentaryFilm />
    </section>;
}
