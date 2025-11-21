import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { RouterProvider } from 'react-router'

import { ThemeProvider } from './contexts/theme-provider'
import rootRouter from './routes/rootRoutes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={rootRouter}></RouterProvider>
    </ThemeProvider>
  </StrictMode>,
)
