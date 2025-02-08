import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './routes/Index/header';
import Footer from './routes/Index/footer';
import Home from "./routes/pages/Home";
import Category from "./routes/pages/Category";
import Account from "./routes/pages/Account";
import Transaction from "./routes/pages/Transaction";
import Login from "./component/Login";
import { AuthProvider, useAuth } from './context/AuthContext';  // Importando o AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <div>Carregando...</div>;  // Ou um loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  return children;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/Login" element={<Login />} />

        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Transaction"
          element={
            <ProtectedRoute>
              <Transaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/Home" /> : <Navigate to="/Login" />}
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
