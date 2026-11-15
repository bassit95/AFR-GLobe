import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ onClick }) => {
  return (
    <Link className="brand-mark" to="/" onClick={onClick}>
      <span>Africa</span>
      <span>Global</span>
    </Link>
  );
};

export default Logo;