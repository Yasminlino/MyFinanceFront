import React, { useState, useEffect } from "react";
import { updateAccount } from "../../../../services/api/retornoApi/ApiAccount";
import { getCategories } from "../../../../services/api/retornoApi/ApiCategory";
import { formatCurrency, removeFormatCurrency } from "../../../../components/functions/mask";

function Update({ account, closeModal }) {
    const [dados, setDados] = useState({ id: "", name: "", value: "", categoryid: "" })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    let { categories, errorCart } = getCategories();
    // categories = categories.filter(c => c.status == "Ativa");

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
                id: account.id,
                name: account.name,
                value: account.value.toString().replace(/(\d+)(\d{2})$/, "$1,$2"),
                categoryid: account.categoryid
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

        const updatedAccount = { id: account.id, ...dados };
        updatedAccount.value = removeFormatCurrency(updatedAccount.value);

        const { account: updatedAccounts, error } = await updateAccount(updatedAccount);

        if (updatedAccounts) {
            window.location.reload(true);
            setSuccess(true);
            setLoading(false);
            closeModal();
            console.log("Conta atualizada com sucesso", updatedAccounts);
        } else if (error) {
            console.log("Erro ao atualizar a conta", error);
            setError("Erro ao atualizar a conta. Tente novamente.");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-backdrop show my-backdrop" />
            <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title m-0">Editar Conta</h4>
                            <button type="button" className="btn btn-close" aria-label="Close" onClick={closeModal} />

                        </div>
                        <div className="modal-body">
                            <label>Id</label>
                            <input
                                type="text"
                                id="id"
                                value={account.id}

                                disabled
                                className="form-control"
                            />
                            <br />
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

                            <label className="control-label">Category</label>
                            <select
                                className="form-control"
                                id="categoryid"
                                value={dados.categoryid}  // Usando categoryid para o valor da categoria
                                onChange={handleChange("categoryid")}
                            >
                                <option value=""></option>
                                {categories && categories.map((category) => (
                                    <option key={category.id} id={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Exibindo erros ou sucesso */}
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">Conta atualizada com sucesso!</div>}

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Fechar</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? "Salvando..." : "Salvar alterações"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Update;
