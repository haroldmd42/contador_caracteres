import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { ThemeProvider } from './context/ThemeContext';

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
import DataFaker from './pages/DataFaker/DataFaker';
import DiffChecker from './pages/DiffChecker/DiffChecker';
import JwtDecoder from './pages/JwtDecoder/JwtDecoder';
import DataConverter from './pages/DataConverter/DataConverter';
import RegexTester from './pages/RegexTester/RegexTester';
import ContrastChecker from './pages/ContrastChecker/ContrastChecker';
import DeviceSimulator from './pages/DeviceSimulator/DeviceSimulator';

/**
 * Root application component.
 * Defines the routing structure with a shared layout and ThemeProvider context.
 */
export default function App() {
  return (
    <ThemeProvider>
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
            <Route path={ROUTES.MOCK_DATA} element={<DataFaker />} />
            <Route path={ROUTES.DIFF_CHECKER} element={<DiffChecker />} />
            <Route path={ROUTES.JWT_DECODER} element={<JwtDecoder />} />
            <Route path={ROUTES.DATA_CONVERTER} element={<DataConverter />} />
            <Route path={ROUTES.REGEX_TESTER} element={<RegexTester />} />
            <Route path={ROUTES.CONTRAST_CHECKER} element={<ContrastChecker />} />
            <Route path={ROUTES.DEVICE_SIMULATOR} element={<DeviceSimulator />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

