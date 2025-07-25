import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/detector', label: 'Detector' },
    { path: '/ai-image', label: 'AI Image Detector' },
    { path: '/fake-news', label: 'Fake News' },
    { path: '/scam-detector', label: 'Scam Detector' },
    { path: '/about', label: 'About Us' }
  ];

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-tabs">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `nav-tab ${isActive ? 'active' : ''}`
                }
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
