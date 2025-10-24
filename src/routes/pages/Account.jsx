import React, { useEffect, useState } from "react";
import Create from "../Modals/Account/Create";
import Update from "../Modals/Account/Update";
import { getAccounts } from "../../api/retornoApi/ApiAccount";
import { getCategories } from "../../api/retornoApi/ApiCategory";
import { deleteAccount } from "../../api/retornoApi/ApiAccount";
import { Alert } from "../functions/alert";
import { formatCurrency } from "../functions/mask";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PageHeader from "../../components/PageHeader"; // 👈 usa o header

function Account() {
    const { accounts, error } = getAccounts();
    const { categories } = getCategories();

    if (error) {
        return <div>Erro ao carregar contas: {error.message}</div>;
    }

    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [account, setAccount] = useState(null);

    const handle = async (funcao, payload) => {
        if (funcao === "create") {
            setShowModalCreate(true);
        } else if (funcao === "update") {
            setAccount(payload);
            setShowModalUpdate(true);
        } else if (funcao === "delete") {
            if (window.confirm("Tem certeza que deseja excluir esta conta?")) {
                const { accounts: ok, error: err } = await deleteAccount(payload); // payload = id
                if (ok) {
                    setAlert({ type: "success", message: "Conta deletada com sucesso!" });
                    setTimeout(() => window.location.reload(), 600);
                } else if (err) {
                    setAlert({ type: "error", message: "Falha ao deletar conta. Tente novamente." });
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
                title="Contas"
                secondary={{ label: "Atualizar", onClick: () => window.location.reload() }}
                primary={{ label: "Nova conta", onClick: () => handle("create"), icon: <RiStickyNoteAddFill /> }}
            />

            <div className="card">
                <div className="table-responsive">
                    {/* se quiser cabeçalho “grudado”, troque por: table-responsive table-responsive-sticky e adicione table-sticky abaixo */}
                    <table className="table card-table table-vcenter table-hover">
                        <thead>
                            <tr>
                                <th className="w-1">ID</th>
                                <th>Nome</th>
                                <th className="text-end">Valor</th>
                                <th>Categoria</th>
                                <th className="w-1 text-center">Editar</th>
                                <th className="w-1 text-center">Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts?.map((acc) => (
                                <tr key={acc.id}>
                                    <td>{acc.id}</td>
                                    <td>{acc.name}</td>
                                    <td className="text-end">{formatCurrency(acc.value)}</td>
                                    <td>{categories?.find((c) => c.id === acc.categoryid)?.name}</td>

                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-icon"
                                            aria-label={`Editar conta ${acc.name}`}
                                            onClick={() => handle("update", acc)}
                                        >
                                            <FaEdit />
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-icon btn-danger"
                                            aria-label={`Excluir conta ${acc.name}`}
                                            onClick={() => handle("delete", acc.id)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {(!accounts || accounts.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="text-center text-secondary">
                                        Nenhuma conta encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModalCreate && <Create closeModal={closeModalCreate} />}
            {showModalUpdate && <Update account={account} closeModal={closeModalUpdate} />}
        </div>
    );
}

export default Account;
