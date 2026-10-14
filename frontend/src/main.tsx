import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { registerServiceWorker } from './services/pushNotifications'

import { LanguageProvider } from './context/LanguageContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'

// Register Web Push Service Worker
registerServiceWorker().catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
)
