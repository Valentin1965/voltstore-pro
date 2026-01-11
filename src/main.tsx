// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './services/auth.tsx'; // імпорт провайдера
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>  {/* Обгортаємо весь App */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);