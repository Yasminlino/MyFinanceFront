import React, { useEffect, useState } from "react";
import Create from "../Modals/Category/Create";
import { getCategories } from "../../api/retornoApi/ApiCategory";
import { deleteCategory } from "../../api/retornoApi/ApiCategory";
import { Alert } from "../functions/alert";
import { MdDelete } from "react-icons/md";

function Categories() {
    const { categories, error } = getCategories();

    if (error) {
        return <div>Erro ao carregar categorias: {error.message}</div>;
    }

    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" })
    const [category, setCategory] = useState(null);

    // Handle the update modal
    const handle = async (funcao, category) => {
        if(funcao == "create"){
            setShowModalCreate(true);

        }else if (funcao == "update") {
            setCategory(category); 
            setShowModalUpdate(true); 

        } else if (funcao == "delete") {
            if (window.confirm("Are you sure you want to delete this category?")) {
                const { categories: Categories, error } = await deleteCategory(category);

                if (Categories) {
                    window.location.reload(true);
                    setAlert({ type: "success", message: "Categoria deletada com sucesso!" });  // Corrigido para "success"
                    setTimeout(() => setAlert({ type: "", message: "" }), 15000);
                }
                else if (error){
                    setAlert({ type: "error", message: "Falha ao deletar categoria. Categoria sendo utilizada em histórico de contas!" });
                    setTimeout(() => setAlert({ type: "", message: "" }), 15000);
                }
            }
        }

    }

    // Close the create modal
    const closeModalCreate = () => {
        setShowModalCreate(false);
    };

    // Close the update modal
    const closeModalUpdate = () => {
        setShowModalUpdate(false);
    };

    return (
        <div>
            {alert.message && <Alert type={alert.type} message={alert.message} />}
            <div className="navbar-right" style={{ marginRight: "50px" }}>
                <button className="btn btn-primary btn-lg" onClick={() => handle("create")}>Criar</button>
            </div>
            <div>
                <h3>Categorias</h3>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr className="info colorwhite">
                            <th>Id</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories && categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.status}</td>
                                <td>
                                    {/* Delete button */}
                                    <button className="btn btn-danger" onClick={() => handle("delete", category)}>
                                    <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showModalCreate && <Create closeModal={closeModalCreate} />}
            {/* Update Modal */}
            {showModalUpdate && <Update category={category} closeModal={closeModalUpdate} />}
        </div>
    );
}

export default Categories;
