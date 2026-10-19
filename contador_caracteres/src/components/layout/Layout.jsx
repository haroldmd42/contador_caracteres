import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../Navbar/NavBar';
import Footer from '../Footer/Footer';
import ThemeToggle from '../ui/ThemeToggle/ThemeToggle';
import { ROUTES } from '../../constants/routes';

/**
 * Application layout wrapper.
 * Renders NavBar, page content (via Outlet), floating ThemeToggle, and Footer consistently.
 * On full-workspace tools (like Device Simulator), omits Footer to keep workspace 100% viewport fitted.
 */
export default function Layout() {
  const location = useLocation();
  const isSimulator = location.pathname === ROUTES.DEVICE_SIMULATOR;

  return (
    <>
      <NavBar />
      <main className={isSimulator ? 'main-simulator-full' : ''}>
        <Outlet />
      </main>
      <ThemeToggle />
      {!isSimulator && <Footer />}
    </>
  );
}
