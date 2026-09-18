import { Outlet } from 'react-router-dom';
import NavBar from '../Navbar/NavBar';
import Footer from '../Footer/Footer';
import ThemeToggle from '../ui/ThemeToggle/ThemeToggle';

/**
 * Application layout wrapper.
 * Renders NavBar, page content (via Outlet), floating ThemeToggle, and Footer consistently.
 */
export default function Layout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <ThemeToggle />
      <Footer />
    </>
  );
}
