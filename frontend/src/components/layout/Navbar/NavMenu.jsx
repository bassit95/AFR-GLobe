import React from 'react';
import { NavLink } from 'react-router-dom';

function NavMenu({ label, path, isScrolled, onClick }) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `text-xs tracking-[0.2em] font-medium transition-colors duration-200 uppercase ${
          isScrolled
            ? isActive
              ? 'text-[#B85C38]'
              : 'text-[#1A1A1A] hover:text-[#B85C38]'
            : isActive
            ? 'text-[#D4A574]'
            : 'text-white/90 hover:text-white'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default NavMenu;