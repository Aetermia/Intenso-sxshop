import React from 'react';
import logo from '../assets/logo.png';
import './Logo.css';

export default function Logo({ size = 'sm', className = '' }) {
  return (
    <img
      src={logo}
      alt="Intenso Tandil"
      className={`logo logo--${size} ${className}`}
    />
  );
}
