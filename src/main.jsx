import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Callback from './components/Callback.jsx'
import TestPage from './components/TestPage.jsx'
import { AudioProvider } from './audio'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AudioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </AudioProvider>
  </StrictMode>,
)
