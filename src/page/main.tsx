import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders
import { mados } from '../loaders';

// View
import './index.scss'
import { PopupPage } from './Popup.tsx';
import { OptionsPage } from './Options.tsx';
import { DebugPage } from './DebugPage.tsx';


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
  {
    path: "/debug",
    element: <DebugPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
