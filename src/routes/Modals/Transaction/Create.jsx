import React, { useState, useEffect } from "react";
import { getCategories } from "../../../api/retornoApi/ApiCategory";
import { formatCurrency } from "../../functions/mask";
import { removeFormatCurrency } from "../../functions/mask";
import { formatDate } from "../../functions/mask";
import { createTransaction } from "../../../api/retornoApi/ApiTransaction";

function CreateTransaction({ account, closeModal }) {
    const [dados, setDados] = useState({})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const status = ['', 'PENDENTE', 'PAGO NO PRAZO', 'AGUARDANDO', 'PAGO ATRASADO'];

    let { categories, errorCart } = getCategories();
    categories = categories.filter(c => c.status == "Ativa");

    const handleChange = (campo) => (event) => {
        let { value } = event.target;

        if (campo === "categoryid") {
            setDados((prevData) => ({
                ...prevData,
                [campo]: value,
            }));
            return;
        }
        if (campo === "value") {
            const value = formatCurrency(event.target.value);
            setDados((prevData) => ({
                ...prevData,
                [campo]: value,
            }));
            return;
        }

        setDados((prevData) => ({
            ...prevData,
            [campo]: value,
        }));
    };

    useEffect(() => {
        if (account) {
            setDados({
                name: account.name,
                value: account.value.toString().replace(/(\d+)(\d{2})$/, "$1,$2"),
                date: formatDate(account.month) || formatDate(account.date),
                status: account.status
            });
        }
    }, [account]);

    const handleSave = async () => {
        let isValid = true;

        for (const key in dados) {
            if (dados.hasOwnProperty(key)) {
                if (dados[key] === "" || dados[key] === null) {
                    document.getElementById(key).classList.add("error");
                } else {
                    document.getElementById(key).classList.remove("error");
                }
            }
        }

        if (!isValid) {
            setError("Por favor, preencha os campos obrigatórios");
            setTimeout(() => setError({ type: "", message: "" }), 5000);
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        
        const updatedAccount = { ...dados };
        updatedAccount.value = removeFormatCurrency(updatedAccount.value);
        
        const { account: data, error }  = await createTransaction(updatedAccount); 

        if (data) {
            setSuccess(true);
            setLoading(false);
            closeModal();
            console.log("Conta atualizada com sucesso", data);
        } else if (error) {
            console.log("Erro ao atualizar a conta", error);
            setError("Erro ao atualizar a conta. Tente novamente.");
            setLoading(false);
        }
    };

    return (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">Criar nova conta</h4>
                    </div>
                    <div className="modal-body">
                        <label>Nome</label>
                        <input
                            type="text"
                            value={dados.name}
                            onChange={handleChange("name")}
                            id="name"
                            className="form-control"
                            required
                        />
                        <br />
                        <label>Value</label>
                        <input
                            type="text"
                            value={dados.value}
                            onChange={handleChange("value")}
                            id="value"
                            className="form-control"
                            required
                        />
                        <br />

                        <label className="control-label">DueDate</label>
                        <input
                            type="date"
                            value={dados.date ? formatDate(dados.date) : ""}
                            onChange={handleChange("date")}
                            id="date"
                            className="form-control"
                            required
                        />
                        <br />
                        <label className="control-label">Status</label>
                        <select
                            className="form-control"
                            id="status"
                            value={dados.status}  // Usando categoryid para o valor da categoria
                            onChange={handleChange("status")}
                        >
                            {status && status.map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>

                    {/* Exibindo erros ou sucesso */}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">Conta criada com sucesso!</div>}

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Fechar</button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Salvando..." : "Create Account"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateTransaction;
