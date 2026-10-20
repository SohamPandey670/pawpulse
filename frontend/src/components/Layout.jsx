import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="paw-layout-container">
      <Sidebar />
      <div className="paw-main-wrapper">
        <Navbar />
        <main className="paw-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
