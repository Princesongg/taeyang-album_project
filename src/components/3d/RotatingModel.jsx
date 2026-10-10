import { useEffect, useRef, useState } from 'react';
import './RotatingModel.css';

export default function RotatingModel() {
    const ref = useRef(null);
    const [ready, setReady] = useState(false);
    const [rotate, setRotate] = useState(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setRotate(!preference.matches);
        preference.addEventListener('change', update);
        let disposed = false;
        import('@google/model-viewer').then(() => { if (!disposed) setReady(true); });
        return () => { disposed = true; preference.removeEventListener('change', update); };
    }, []);
    return <section className="rotating-model" ref={ref} aria-label="TAEYANG rotating 3D artwork">
        {ready && <model-viewer src="/models/taeyang3d.glb" alt="TAEYANG 3D artwork" auto-rotate={rotate} auto-rotate-delay="0" rotation-per-second="15deg" camera-controls disable-zoom interaction-prompt="none" shadow-intensity="0.7" exposure="1" loading="eager" />}
    </section>;
}
