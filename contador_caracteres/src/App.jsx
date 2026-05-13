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
        </Route>
      </Routes>
    </HashRouter>
  );
}
