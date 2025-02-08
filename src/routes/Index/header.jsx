import React, { useContext } from "react";
import "../../Styles/style.css";
import { AuthContext } from "../../context/AuthContext"; // Importando o contexto de autenticação
import { useNavigate } from "react-router-dom"; // Para navegação após logout

function Header() {
    const { isAuthenticated, logout } = useContext(AuthContext);  // Pegando o estado de autenticação e a função de logout
    const listOptions = ['Home', 'Category', 'Account', 'Transaction'];    
    const navigate = useNavigate();  // Hook de navegação para redirecionar após logout

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <ul className="list-unstyled">
                        {listOptions.map((texto) => (
                            <li key={texto} className="navbar-brand">
                                <a className="bg-primary" href={texto}>{texto}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                        {/* Condicionando a exibição do link de Login ou Logout */}
                        {!isAuthenticated ? (
                            <li><a href="Login">Login</a></li>
                        ) : (
                            <li><a href="Login" onClick={handleLogout}>Logout</a></li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
