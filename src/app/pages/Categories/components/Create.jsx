import React, { useState } from "react";
import { createCategory } from "../../../../services/api/retornoApi/ApiCategory";

function Create({ closeModal }) {

    const [dataCreated, setDataCreated] = useState({ name: '', subCategory: '' });
    const [error, setError] = useState("");
    const [alert, setAlert] = useState({ type: "", message: "" })

    const handleChange = (event) => {
        const { id, value } = event.target;
        setDataCreated(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const handleClose = () => {
        closeModal();
    };

    const handleSave = async () => {
        let isValid = true;
        if (!dataCreated) {
            document.getElementById("name").classList.add("error");
            isValid = false;

            setError("Por favor, preencha os campos obrigatórios");
            return

        } else {
            document.getElementById("name").classList.remove("error");
            isValid = true;
        }

        const { categories: createCategories, error } = await createCategory({dataCreated});

        if (createCategories) {
            window.location.reload(true);
            closeModal();
            console.log("Categoria criada com sucesso", createCategories);
            setAlert({ type: "sucess", message: "Categoria deletada com sucesso!" });
            setTimeout(() => setAlert({ type: "", message: "" }), 5000);
        } else if (error) {
            console.log("Erro ao criar a categoria", error);
            setAlert({ type: "error", message: "Falha ao deletar categoria. Tente novamente." });
            setTimeout(() => setAlert({ type: "", message: "" }), 5000);
        }
    }

    return (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4>Create Category</h4>
                    </div>
                    <div className="modal-body">
                        <form action="" className="form-horizontal">
                            <fieldset>
                                <div className="form-group">
                                    <label >Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        required
                                        placeholder="Name Category"
                                        value={dataCreated.name}  // Bind input value to state
                                        onChange={handleChange}
                                    />
                                    <label className="control-label">SubCategory</label>
                                    <select
                                        className="form-control"
                                        id="subCategory"
                                        placeholder="SubCategory"
                                        value={dataCreated.subCategory}
                                        onChange={handleChange}
                                    >
                                        <option value=""></option>
                                        <option value="Ativo">Ativo</option>
                                        <option value="Passivo">Passivo</option>
                                    </select>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {/* {success && <div className="alert alert-success">Conta atualizada com sucesso!</div>} */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Create;
