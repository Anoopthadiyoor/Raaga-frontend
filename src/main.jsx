import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import PlayerProvider from './Context/PlayerContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>  
    <BrowserRouter>
            <PlayerProvider>

    <App />
            </PlayerProvider>
    </BrowserRouter>
  </StrictMode>
)
