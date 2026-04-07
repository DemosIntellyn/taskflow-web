import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App'
import './index.css'

Sentry.init({
  dsn: import.meta.env.VITE_GLITCHTIP_DSN || '',
  tracesSampleRate: 1.0,
  environment: import.meta.env.VITE_ENV || 'production',
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Sentry.ErrorBoundary fallback={<div className="p-8 text-red-600">Something went wrong. Our team has been notified.</div>}>
    <App />
  </Sentry.ErrorBoundary>
)
