import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './Landing';
import Layout from './Layout';
import { createHashRouter, RouterProvider } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/",
        element:<></>,
      },
      {
        path: "/",
        element: <></>,
      },
      {
        path: "/",
        element: <></>,
      },
      {
        path: "/",
        element: <></>,
      },
      {
        path: "/",
        element: <></>,
      },
    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
