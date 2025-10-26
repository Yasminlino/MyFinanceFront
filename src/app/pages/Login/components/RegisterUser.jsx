import React, { useEffect, useState } from "react";
import { createAccount } from "../../../../services/api/retornoApi/ApiAccount";
import {getCategories} from "../../../../services/api/retornoApi/ApiCategory"
import { Alert } from "../../../../components/functions/alert";
import { formatCurrency, removeFormatCurrency } from "../../../../components/functions/mask";

function RegisterUser({closeModal }) {
    let { categories, errorCart } = getCategories();
    // categories = categories.filter(c => c.status == "Ativa");

    const [dataCreated, setDataCreated] = useState({ name: "", value: "", categoryid: "" });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false); 

    const handleClose = () => {
        closeModal();
    };

    const handleChange = (campo) => (event) => {
        if(campo === "categoryid"){
            const selectedOption = event.target.options[event.target.selectedIndex];
            setDataCreated((prevData) => ({
                ...prevData,
                [campo]: selectedOption.id, 
            }));
            return;
        }

        if(campo === "value"){
            const value = formatCurrency(event.target.value);
            setDataCreated((prevData) => ({
                ...prevData,
                [campo]: value,  // Atualiza a propriedade correta no objeto dataCreated
            }));
            return;
        }
        
        const { value } = event.target;
        setDataCreated((prevData) => ({
            ...prevData,
            [campo]: value,  // Atualiza a propriedade correta no objeto dataCreated
        }));
    };

    const handleSave = async () => {
        let isValid = true;

        for(const key in dataCreated)
        {
            if(dataCreated.hasOwnProperty(key)){
                if(dataCreated[key] === "" || dataCreated[key] === null){
                    document.getElementById(key).classList.add("error");
                    isValid = false;
                }
                else{
                    document.getElementById(key).classList.remove("error");
                }
            }

        }

        if(!isValid) {
            setError("Por favor, preencha os campos obrigatórios");
            return
        }

        const { account: returnCreate, error } = await registerNewUser({ dataCreated });

        if (returnCreate) {
            console.log("Usuário criado com sucesso", returnCreate);
            closeModal();
            window.location.reload(true);
            setAlert({ type: "success", message: "Conta criada com sucesso!" });
        } else if (error) {
            console.log("Erro ao criar a categoria", error);
            setAlert({ type: "error", message: "Falha ao criar conta. Tente novamente." });
        }
    };

    return (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            {alert.message && <Alert type={alert.type} message={alert.message} />}
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4>Register new User</h4>
                    </div>
                    <div className="modal-body">
                        <form className="form-horizontal">
                            <fieldset>
                                <div className="form-group">
                                    <label className="control-label">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        required
                                        
                                        value={dataCreated.name}
                                        onChange={handleChange("email")}
                                    />
                                    <label className="control-label">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        required
                                        value={dataCreated.password}
                                        onChange={handleChange("value")}
                                    />
                                    <label className="control-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="form-control"
                                        required
                                        value={dataCreated.confirmPassword}
                                        onChange={handleChange("confirmPassword")}
                                    />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">Conta atualizada com sucesso!</div>}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterUser;
