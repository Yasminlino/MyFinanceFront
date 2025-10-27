// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Index/header";
import Footer from "./components/Index/footer";

import Home from "./app/pages/Home/Home";
import Category from "./app/pages/Categories/Category";
import Account from "./app/pages/Accounts/Account";
import Transaction from "./app/pages/Transactions/Transaction";
import Login from "./app/pages/Login/Login";

import { useAuth } from "./services/context/AuthContext";

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
