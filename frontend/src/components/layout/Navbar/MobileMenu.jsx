import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileMenu = ({ open, setOpen, links }) => {
  if (!open) return null;

  return (
    <nav className="mobile-menu" aria-label="Navigation mobile">
      {links.map(([label, path]) => (
        <NavLink key={path} to={path} onClick={() => setOpen(false)}>
          {label}
          <span>↗</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileMenu;