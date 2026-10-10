import { useEffect, useState } from 'react';
import './TopButton.css';

export default function TopButton() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const update = () => setVisible(window.scrollY > window.innerHeight * .6);
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);
    if (!visible) return null;
    return <button className="top-button" type="button" aria-label="맨 위로 이동" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>
        <span className="top-button__arrow" aria-hidden="true">
            <img className="top-button__arrow--blue" src="/images/top/arrow-blue.svg" alt="" />
            <img className="top-button__arrow--white" src="/images/top/arrow-white.svg" alt="" />
        </span>
        <span className="top-button__text" aria-hidden="true">U<br />P</span>
    </button>;
}
