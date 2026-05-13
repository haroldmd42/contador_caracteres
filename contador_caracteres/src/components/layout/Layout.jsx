import { Outlet } from 'react-router-dom';
import NavBar from '../Navbar/NavBar';
import Footer from '../Footer/Footer';

/**
 * Application layout wrapper.
 * Renders NavBar, page content (via Outlet), and Footer consistently.
 */
export default function Layout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
