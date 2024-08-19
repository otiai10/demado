import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders
import { debugs, mados } from '../loaders';

// View
import './index.scss'
import { PopupPage } from './Popup.tsx';
import { OptionsPage } from './Options.tsx';
import { DashboardPage } from './Dashboard.tsx';
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
    path: "/dashboard",
    element: <DashboardPage />,
    loader: mados,
  },
  {
    path: "/debug",
    element: <DebugPage />,
    loader: debugs,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
