import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAccount } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import RegisterUser from "../routes/Modals/Register/RegisterUser";
// import logo from "../assets/logo.webp"; // opcional: troque o caminho se tiver um logo

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ username: "", password: "", remember: true });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);

    const errors = useMemo(() => {
        const errs = {};
        if (form.username && form.username.length < 3) errs.username = "Informe seu e-mail ou usuário.";
        if (form.password && form.password.length < 4) errs.password = "A senha deve ter pelo menos 4 caracteres.";
        return errs;
    }, [form.username, form.password]);

    useEffect(() => {
        const remembered = localStorage.getItem("remember");
        if (remembered === "1") {
            // se quiser, recupere o último username salvo
            // const last = localStorage.getItem("lastUser");
            // if (last) setForm(f => ({ ...f, username: last }));
        }
    }, []);

    const onChange = (e) => {
        const { name, type, checked, value } = e.target;
        setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errors.username || errors.password) {
            alert("Corrija os erros antes de continuar.");
            return;
        }

        try {
            setLoading(true);

            // sua API espera { login, senha }
            const payload = { login: form.username, senha: form.password };
            const response = await apiAccount.post("/Autenticar", payload);

            if (response?.data?.token) {
                localStorage.setItem("authToken", response.data.token);
                if (form.remember) {
                    localStorage.setItem("remember", "1");
                    // localStorage.setItem("lastUser", form.username);
                } else {
                    localStorage.removeItem("remember");
                    localStorage.removeItem("lastUser");
                }

                // seu contexto
                await login();

                // redireciona como já fazia
                navigate("/home", { replace: true });
            } else {
                alert("Credenciais inválidas.");
            }
        } catch (error) {
            console.error("Erro ao autenticar:", error);
            alert("Não foi possível autenticar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page page-center min-vh-100 d-flex align-items-center">
            <div className="container container-tight py-4" style={{ maxWidth: 420 }}>
                

                <div className="card card-md">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Entrar</h2>

                        <form onSubmit={handleSubmit} autoComplete="on" noValidate>
                            {/* Usuário/E-mail */}
                            <div className="mb-3">
                                <label className="form-label" htmlFor="username">E-mail ou usuário</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                    placeholder="voce@email.com"
                                    value={form.username}
                                    onChange={onChange}
                                    autoFocus
                                />
                                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                            </div>

                            {/* Senha */}

                            <div className="mb-3">
                                <label className="form-label" htmlFor="password">Senha</label>

                                <div className="position-relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPwd ? "text" : "password"}
                                        className={`form-control ${errors?.password ? "is-invalid" : ""} pe-5`}
                                        placeholder="Sua senha"
                                        value={form.password}
                                        onChange={onChange}
                                        autoComplete="current-password"
                                    />

                                    {/* botão do olho dentro do input */}
                                    <button
                                        type="button"
                                        className="btn p-0 border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-3"
                                        onClick={() => setShowPwd((s) => !s)}
                                        aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                                        tabIndex={-1}
                                    >
                                        {showPwd ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                                    </button>
                                </div>

                                {errors?.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                            </div>


                            {/* Lembrar de mim */}
                            <div className="mb-2">
                                <label className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="remember"
                                        checked={form.remember}
                                        onChange={onChange}
                                    />
                                    <span className="form-check-label">Lembrar de mim</span>
                                </label>
                            </div>

                            {/* Botão */}
                            <div className="form-footer d-flex align-items-center justify-content-between">
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                                            Carregando...
                                        </>
                                    ) : (
                                        "Entrar"
                                    )}
                                </button>
                            </div>

                            {/* Registrar */}
                            <div className="mt-3 text-center">
                                <button type="button" className="btn btn-link p-0" onClick={() => setShowModalCreate(true)}>
                                    Registrar-se
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-4 text-center text-muted small">
                    {/* mensagem opcional */}
                </div>
            </div>

            {/* Modal de registro */}
            {showModalCreate && <RegisterUser closeModal={() => setShowModalCreate(false)} />}
        </div>
    );
}
