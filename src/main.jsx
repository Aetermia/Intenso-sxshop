import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './Root.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <Root />
    </CartProvider>
  </React.StrictMode>
);
