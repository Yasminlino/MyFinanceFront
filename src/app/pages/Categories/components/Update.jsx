import React, { useState, useEffect } from "react";
import { updateCategory } from "../../../../services/api/retornoApi/ApiCategory";

function Update({ category, closeModal }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false); // Para controlar o estado de carregamento
    const [error, setError] = useState(""); // Para armazenar erros
    const [success, setSuccess] = useState(false); // Para armazenar sucesso

    useEffect(() => {
        if (category) {
            setName(category.name); // Carregar o nome da categoria para edição
        }
    }, [category]);

    const handleSave = async () => {
        if (name.trim() === "") {
            alert("Por favor, insira o nome da categoria");
            return;
        }

        setLoading(true); // Inicia o carregamento
        setError(""); // Limpa erros anteriores
        setSuccess(false); // Reseta o estado de sucesso

        // Agora, enviamos o id e name no corpo da requisição
        const updatedCategory = { id: category.id, name };

        const { categories: updatedCategories, error } = await updateCategory(updatedCategory);

        if (updatedCategories) {
            window.location.reload(true);
            setSuccess(true); // Marca como sucesso
            setLoading(false); // Finaliza o carregamento
            closeModal(); // Fecha o modal após salvar
            console.log("Categoria atualizada com sucesso", updatedCategories);
        } else if (error) {
            console.log("Erro ao atualizar a categoria", error);
            setError("Erro ao atualizar a categoria. Tente novamente."); // Exibe o erro
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
                        <h4 className="modal-title">Editar Categoria</h4>
                    </div>
                    <div className="modal-body">
                        <label>Id</label>
                        <input
                            type="text"
                            value={category.id}
                            disabled
                            className="form-control"
                        />
                    </div>
                    <div className="modal-body">
                        <label>Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <label className="control-label">Tipo categoria</label>
                    <select
                        className="form-control"
                        id="subCategory"
                        placeholder="SubCategory"
                        value={dataCreated.subCategory}
                        onChange={handleChange}
                    >
                        <option value=""></option>
                        <option value="Ativo">Receitas</option>
                        <option value="Passivo">Despesas</option>
                    </select>

                    {/* Exibindo erros ou sucesso */}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">Categoria atualizada com sucesso!</div>}

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Fechar</button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={loading} // Desabilita o botão durante o carregamento
                        >
                            {loading ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Update;
