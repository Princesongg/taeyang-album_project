import Teaser from '../teaser/Teaser';
import './MvTeaser.css';

export default function MvTeaser({ enabled = true }) {
    return (
        <Teaser
            source="/video/TAEYANG - ‘LIVE FAST DIE SLOW’ MV TEASER.mp4"
            id="music-video"
            label="TAEYANG LIVE FAST DIE SLOW MV Teaser"
            pinned={false}
            enabled={enabled}
            className="mv-teaser"
        />
    );
}
