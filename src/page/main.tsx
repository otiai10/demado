import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { RouterProvider, createHashRouter } from "react-router-dom";
import { PopupPage } from './Popup.tsx';
import { OptionsPage } from './Options.tsx';

const router = createHashRouter([
  { path: "/popup", element: <PopupPage />, },
  { path: "/options", element: <OptionsPage />, },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
