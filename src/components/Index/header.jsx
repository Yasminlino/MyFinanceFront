// src/components/Header/Header.jsx
import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/context/AuthContext";   // 👈 seu contexto
// Ícones (Tabler) — opcional:
import { IconHome, IconCategory, IconCreditCard, IconUserCircle } from "@tabler/icons-react";
// Logo (ajuste o caminho se necessário)
// import logo from "./logo.webp";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(false); // dropdown controlado (não depende do JS do Bootstrap)

  const handleLogout = (e) => {
    e.preventDefault();
    try {
      logout?.();                 // limpa auth no contexto
      localStorage.removeItem("authToken");
    } finally {
      navigate("/Login", { replace: true });
    }
  };

  return (
    <header className="navbar navbar-expand-md navbar-light d-print-none sticky-top bg-white border-bottom">
      <div className="container-xl">

        {/* Marca */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          {/* <img src={logo} alt="logo" className="logoHeader" /> */}
          <span className="fw-bold">My Finance</span>
        </Link>

        {/* Toggle mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          {/* Menu principal */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <span className="me-2"><IconHome size={20} /></span>
                <span>Página Inicial</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/Category" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <span className="me-2"><IconCategory size={20} /></span>
                <span>Categorias</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/Account" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <span className="me-2"><IconCreditCard size={20} /></span>
                <span>Cadastro de Contas</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/Transaction" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <span className="me-2"><IconCreditCard size={20} /></span>
                <span>Contas a pagar</span>
              </NavLink>
            </li>
          </ul>

          {/* Usuário / Login-Logout */}
          <ul className="navbar-nav ms-auto">
            {!isAuthenticated ? (
              <li className="nav-item">
                <NavLink to="/Login" className="nav-link">Login</NavLink>
              </li>
            ) : (
              <li className="nav-item dropdown">
                {/* Botão do dropdown */}
                <button
                  type="button"
                  className="nav-link d-flex align-items-center bg-transparent border-0"
                  onClick={() => setOpen((s) => !s)}
                >
                  <IconUserCircle size={22} className="me-2" />
                  <div className="d-none d-md-block text-start">
                    <div>{user?.email || "Usuário"}</div>
                    <div className="small text-secondary">Administrador</div>
                  </div>
                </button>

                {/* Menu do dropdown */}
                <div
                  className={`dropdown-menu dropdown-menu-end ${open ? "show" : ""}`}
                  onBlur={() => setOpen(false)}
                >
                  {/* Coloque outros itens se quiser */}
                  <button type="button" className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
