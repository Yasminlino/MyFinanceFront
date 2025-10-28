import React, { useEffect, useState } from "react";
import { createAccount } from "../../../../services/api/retornoApi/ApiAccount";
import { getCategories } from "../../../../services/api/retornoApi/ApiCategory"
import { Alert } from "../../../../components/functions/alert";
import { formatCurrency, removeFormatCurrency } from "../../../../components/functions/mask";

function Create({ closeModal }) {
    let { categories, errorCart } = getCategories();
    // categories = categories.filter(c => c.status == "Ativa");

    const [dataCreated, setDataCreated] = useState({ name: "", value: "", categoryid: "", dataOperacao: "" });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleClose = () => {
        closeModal();
    };

    const handleChange = (campo) => (event) => {
        if (campo === "categoryid") {
            const selectedOption = event.target.options[event.target.selectedIndex];
            setDataCreated((prevData) => ({
                ...prevData,
                [campo]: selectedOption.id,
            }));
            return;
        }

        if (campo === "value") {
            const value = formatCurrency(event.target.value);
            setDataCreated((prevData) => ({
                ...prevData,
                [campo]: value,  // Atualiza a propriedade correta no objeto dataCreated
            }));
            return;
        }

        if (campo === "validaParcela") {
            const value = event.target.value;
            setDataCreated((prevData) => ({
                ...prevData,
                [campo]: Numbervalue,  // Atualiza a propriedade correta no objeto dataCreated
            }));
            return;
        }
        
        if (campo === "dataOperacao") {
            const value = event.target.value;
            setDataCreated((prevData) => ({
                ...prevData,
                [campo]: Number(value),
            }));
            return;
        }

        const { value } = event.target;
        setDataCreated((prevData) => ({
            ...prevData,
            [campo]: value,  
        }));
    };

    const handleSave = async () => {
        let isValid = true;

        for (const key in dataCreated) {
            if (dataCreated.hasOwnProperty(key)) {
                if (dataCreated[key] === "" || dataCreated[key] === null) {
                    document.getElementById(key).classList.add("error");
                    isValid = false;
                }
                else {
                    document.getElementById(key).classList.remove("error");
                }
            }

        }

        if (!isValid) {
            setError("Por favor, preencha os campos obrigatórios");
            return
        }


        dataCreated.value = removeFormatCurrency(dataCreated.value);
        const { account: returnCreate, error } = await createAccount({ dataCreated });

        if (returnCreate) {
            console.log("Categoria criada com sucesso", returnCreate);
            closeModal();
            window.location.reload(true);
            setAlert({ type: "success", message: "Conta criada com sucesso!" });
        } else if (error) {
            console.log("Erro ao criar a categoria", error);
            setAlert({ type: "error", message: "Falha ao criar conta. Tente novamente." });
        }
    };

    return (
         <>
            <div className="modal-backdrop show my-backdrop" />
            <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                {alert.message && <Alert type={alert.type} message={alert.message} />}
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title m-0">Criar nova conta</h4>
                            <button type="button" className="btn btn-close" aria-label="Close" onClick={closeModal} />
                        </div>
                        <div className="modal-body">
                            <form className="form-horizontal">
                                <fieldset>
                                    <div className="form-group">
                                        <label className="control-label">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-control"
                                            required
                                            placeholder="Name Account"
                                            value={dataCreated.name}
                                            onChange={handleChange("name")}
                                        />
                                        <br />
                                        <label className="control-label">Value</label>
                                        <input
                                            type="text"
                                            id="value"
                                            className="form-control"
                                            required
                                            placeholder="0,00"
                                            value={dataCreated.value}
                                            onChange={handleChange("value")}
                                        />
                                        <br />
                                        <label className="control-label">Category</label>
                                        <select
                                            className="form-control"
                                            id="categoryid"
                                            value={dataCreated.categoryId}
                                            onChange={handleChange("categoryid")}
                                        >
                                            <option value=""></option>
                                            {categories && categories.map((category) => (
                                                <option key={category.id} id={category.id} value={category.name}>{category.name}</option>
                                            ))}
                                        </select>
                                        < br />
                                        <label >Dia vencimento</label>
                                        <input
                                            type="number"
                                            max="31"
                                            min="1"
                                            id="dataOperacao"
                                            className="form-control"
                                            required
                                            placeholder=""
                                            value={dataCreated.dataOperacao}
                                            onChange={handleChange('dataOperacao')}
                                        />

                                        {/* <div className="form-group-aligment">
                                            <div className="form-control50">
                                                <label className="control-label">Possui Parcelas?</label>
                                                <select
                                                    className="form-control "
                                                    id="validaParcela"
                                                    value={dataCreated.validaParcela}
                                                    onChange={handleChange("validaParcela")}
                                                >
                                                    <option value=""></option>
                                                    <option value="Sim">Sim</option>
                                                    <option value="Não">Não</option>

                                                </select>

                                            </div>
                                            <div className="form-control50">
                                                {dataCreated.validaParcela == "Sim" && (
                                                    <>
                                                        <label className="control-label">Quantidade de Parcelas:</label>
                                                        <input
                                                            className="form-control "
                                                            id="qntdParcela"
                                                            type="number"
                                                            value={dataCreated.qntdParcela}
                                                            onChange={handleChange("qntdParcela")}
                                                        >
                                                        </input>

                                                        <label className="control-label">Em que mês iniciou:</label>
                                                        <input
                                                            type="date"
                                                            value={dataCreated.date ? formatDate(dataCreated.date) : ""}
                                                            onChange={handleChange("date")}
                                                            id="date"
                                                            className="form-control"
                                                            required
                                                        >
                                                        </input>
                                                    </>
                                                )
                                                }

                                            </div>
                                        </div> */}

                                    </div>
                                </fieldset>
                            </form>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">Conta atualizada com sucesso!</div>}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleSave}>Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
            </>
            );
}

            export default Create;
