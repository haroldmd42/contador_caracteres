import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';

/* Layout */
import Layout from './components/layout/Layout';

/* Pages */
import Home from './pages/Home/Home';
import CounterText from './pages/CounterText/CounterText';
import FileLibrary from './pages/FileLibrary/FileLibrary';
import EncoderDecoder from './pages/Encoder/Encoder';
import ImageTools from './pages/ImageTools/ImageTools';
import ImageResizer from './pages/ImageResizer/ImageResizer';
import FileConverter from './pages/FileConverter/FileConverter';
import ImageConverter from './pages/ImageConverter/ImageConverter';
import VideoConverter from './pages/VideoConverter/VideoConverter';
import AudioConverter from './pages/AudioConverter/AudioConverter';
import HUToGherkin from './pages/HUToGherkin/HUToGherkin';

/**
 * Root application component.
 * Defines the routing structure with a shared layout.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.CHARACTER_COUNTER} element={<CounterText />} />
          <Route path={ROUTES.FILE_LIBRARY} element={<FileLibrary />} />
          <Route path={ROUTES.ENCODER} element={<EncoderDecoder />} />
          <Route path={ROUTES.IMAGE_BASE64} element={<ImageTools />} />
          <Route path={ROUTES.IMAGE_RESIZER} element={<ImageResizer />} />
          <Route path={ROUTES.FILE_CONVERTER} element={<FileConverter />} />
          <Route path={ROUTES.IMAGE_CONVERTER} element={<ImageConverter />} />
          <Route path={ROUTES.VIDEO_CONVERTER} element={<VideoConverter />} />
          <Route path={ROUTES.AUDIO_CONVERTER} element={<AudioConverter />} />
          <Route path={ROUTES.HU_GHERKIN} element={<HUToGherkin />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
