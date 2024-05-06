import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'

import { RouterProvider, createHashRouter } from "react-router-dom";
import { PopupPage } from './Popup.tsx';
import { OptionsPage, loader as MadoLoader } from './Options.tsx';

const router = createHashRouter([
  { path: "/popup", element: <PopupPage />, },
  {
    path: "/options",
    element: <OptionsPage />,
    loader: MadoLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
