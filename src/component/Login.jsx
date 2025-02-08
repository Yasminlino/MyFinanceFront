import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiAccount } from '../api/api';
import { useAuth } from '../context/AuthContext';  // Importando o useAuth
import { VscDebugBreakpointLogUnverified } from 'react-icons/vsc';
import RegisterUser from '../routes/Modals/Register/RegisterUser';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Agora podemos usar o login diretamente do contexto
    const [showModalCreate, setShowModalCreate] = useState(false);

    const handle = async (funcao, account) => {
        if (funcao == "create") {
            setShowModalCreate(true);

        } 
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const configuration = {
                "login": username,
                "senha": password,
            };

            const response = await apiAccount.post('/Autenticar', configuration);
            console.log("Retorno API LOGIN:", response.data)
            if (response && response.data.token) {
                const { token } = response.data;
                localStorage.setItem('authToken', token);

                login();

                setLoginSuccess(true); 
            } else {
                alert('Credenciais inválidas');
            }
        } catch (error) {
            console.error('Erro ao autenticar:', error);
            alert('Erro ao tentar fazer login');
        }
    };

    useEffect(() => {
        if (loginSuccess) {
            navigate('/home'); 
        }
    }, [loginSuccess, navigate]);

    const closeModalCreate = () => {
        setShowModalCreate(false);
    };



    return (
        <div id="login">
            <div className="containerLogin">
                <div id="login-row" className="row justify-content-center align-items-center">
                    <div id="login-column" className="col-md-6 loginStyle">
                        <div id="login-box" className="col-md-12 backgroundWhite">
                            <form id="login-form" className="form" onSubmit={handleSubmit}>
                                <h3 className="text-center text-info">LOGIN DO USUÁRIO</h3>
                                <div className="form-group">
                                    <label htmlFor="username" className="text-info">Username:</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="text-info">Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="remember-me" className="text-info">
                                        <span><input id="remember-me" name="remember-me" type="checkbox" /></span>
                                        <span>Remember me</span>
                                    </label>
                                </div>
                                <input type="submit" className="btn form-control button" value="Login" />
                                <div id="register-link" className="text-right">
                                    <a href="#" onClick={() => handle("create")} className="text-info">Register here</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
             {/* Create Modal */}
             {showModalCreate && <RegisterUser closeModal={closeModalCreate} />}
        </div>
    );
};

export default Login;
