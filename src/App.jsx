// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./routes/Index/header";
import Footer from "./routes/Index/footer";

import Home from "./routes/pages/Home";
import Category from "./routes/pages/Category";
import Account from "./routes/pages/Account";
import Transaction from "./routes/pages/Transaction";
import Login from "./components/Login";

import { useAuth } from "./context/AuthContext";

// ---------- Rota protegida ----------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return <div>Carregando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

// ---------- Shell com layout de página ----------
const AppShell = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const onLogin = location.pathname.toLowerCase() === "/login";
  const showChrome = isAuthenticated && !onLogin;

  return (
    <div className="page">
      {showChrome && <Header />}

      <main className="container-xl page-wrapper">
        <Routes>
          {/* Login público */}
          <Route path="/login" element={<Login />} />
          <Route path="/Login" element={<Navigate to="/login" replace />} />

          {/* Rotas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <div className="tw-bg-indigo-500 tw-text-white tw-p-4 tw-rounded-lg">TESTE TAILWIND</div>

                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <ProtectedRoute>
                <Transaction />
              </ProtectedRoute>
            }
          />

          {/* Raiz */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>

      {showChrome && <Footer />}
    </div>
  );
};

export default function App() {
  return <AppShell />;
}
