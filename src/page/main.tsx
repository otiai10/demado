import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'

import { RouterProvider, createHashRouter } from "react-router-dom";
import { PopupPage } from './Popup.tsx';
import { OptionsPage } from './Options.tsx';
import { mados } from '../loaders';

const router = createHashRouter([
  {
    path: "/popup",
    element: <PopupPage />,
    loader: mados,
  },
  {
    path: "/options",
    element: <OptionsPage />,
    loader: mados,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
