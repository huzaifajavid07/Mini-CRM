import React from 'react';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

import ClientsPage from "./pages/ClientsPage";
import LeadsPage from "./pages/LeadsPage";
import TasksPage from "./pages/TasksPage";
import ClientDetail from "./pages/ClientDetail";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingPage from './pages/LoadingPage';

import LoginModal from "./pages/LoginModal";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/loading",
    element: (
      <>
        {/* <Navbar /> */}
        <LoadingPage />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <LoginModal />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <Dashboard />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/client",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <ClientsPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/:id",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <ClientDetail />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/leads",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <LeadsPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <TasksPage />
        </>
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
