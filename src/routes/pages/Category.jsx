import React, { useState } from "react";
import Create from "../Modals/Category/Create";
import { getCategories, deleteCategory } from "../../api/retornoApi/ApiCategory";
import { Alert } from "../functions/alert";
import { MdDelete } from "react-icons/md";
import PageHeader from "../../components/PageHeader";

function Categories() {
    const { categories, error } = getCategories();
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [category, setCategory] = useState(null);

    if (error) return <div>Erro ao carregar categorias: {error.message}</div>;

    const handle = async (funcao, category) => {
        if (funcao === "create") {
            setShowModalCreate(true);
        } else if (funcao === "update") {
            setCategory(category);
            setShowModalUpdate(true);
        } else if (funcao === "delete") {
            if (window.confirm("Tem certeza que deseja excluir?")) {
                const { categories: ok, error: err } = await deleteCategory(category);
                if (ok) {
                    setAlert({ type: "success", message: "Categoria deletada com sucesso!" });
                    setTimeout(() => window.location.reload(), 800);
                } else if (err) {
                    setAlert({
                        type: "error",
                        message: "Falha ao deletar. Categoria está vinculada a transações.",
                    });
                    setTimeout(() => setAlert({ type: "", message: "" }), 15000);
                }
            }
        }
    };

    const closeModalCreate = () => setShowModalCreate(false);
    const closeModalUpdate = () => setShowModalUpdate(false);

    return (
        <div>
            {alert.message && <Alert type={alert.type} message={alert.message} />}

            <PageHeader
                pretitle="Cadastros"
                title="Categorias"
                secondary={{ label: "Atualizar", onClick: () => window.location.reload() }}
                primary={{ label: "Nova categoria", onClick: () => handle("create") }}
            />

            <div className="card">
                <div className="table-responsive">
                    {/* se quiser header “grudado”, use: table-responsive table-responsive-sticky + table-sticky abaixo */}
                    <table className="table card-table table-vcenter table-hover">
                        <thead>
                            <tr>
                                <th className="w-1">ID</th>
                                <th>Nome</th>
                                <th>Status</th>
                                <th className="w-1 text-center">Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.name}</td>
                                    <td>
                                        <span
                                            className={`badge ${c.status === "Ativo"
                                                    ? "bg-green"
                                                    : c.status === "Inativo"
                                                        ? "bg-secondary"
                                                        : "bg-muted"
                                                }`}
                                        >
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-icon btn-danger"
                                            aria-label={`Excluir categoria ${c.name}`}
                                            onClick={() => handle("delete", c)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {(!categories || categories.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="text-center text-secondary">
                                        Nenhuma categoria encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModalCreate && <Create closeModal={closeModalCreate} />}
            {showModalUpdate && <Update category={category} closeModal={closeModalUpdate} />}
        </div>
    );
}

export default Categories;
