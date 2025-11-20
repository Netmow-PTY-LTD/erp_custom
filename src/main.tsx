import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { RouterProvider } from 'react-router'
import router from './app/routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
     <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
