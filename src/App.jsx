import Hero from './components/hero/Hero';
import AlbumPhoto from './components/album/AlbumPhoto';
import Teaser from './components/teaser/Teaser';
import TrackList from './components/tracklist/TrackList';
import MvStory from './components/mv-teaser/MvStory';
import Music from './components/music/Music';
import Documentary from './components/documentary/Documentary';
import ClosingText from './components/documentary/ClosingText';
import TopButton from './components/TopButton';
import RotatingModel from './components/3d/RotatingModel';
import Footer from './components/footer/Footer';
import './components/album/PhotoTeaser.css';

const App = () => (
    <main>
        <Hero />
        <div className="photo-teaser-story">
            <AlbumPhoto />
            <Teaser />
        </div>
        <TrackList />
        <MvStory />
        <Music />
        <Documentary />
        <RotatingModel />
        <ClosingText />
        <Footer />
        <TopButton />
    </main>
);
export default App;
