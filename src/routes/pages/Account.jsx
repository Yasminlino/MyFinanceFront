import React, { useEffect, useState } from "react";
import Create from "../Modals/Account/Create"; // Import Create component
import Update from "../Modals/Account/Update";
import { getAccounts } from "../../api/retornoApi/ApiAccount"
import { getCategories } from "../../api/retornoApi/ApiCategory";
import { deleteAccount } from "../../api/retornoApi/ApiAccount"
import { Alert } from "../functions/alert";
import { formatCurrency } from "../functions/mask";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function Account() {
    const { accounts, error } = getAccounts();
    const { categories, errorCategories } = getCategories();

    if (error) {
        return <div>Erro ao carregar contas: {error.message}</div>;
    }

    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" })
    const [account, setAccount] = useState(null);

    // Handle the update modal
    const handle = async (funcao, account) => {
        if (funcao == "create") {
            setShowModalCreate(true);

        } else if (funcao == "update") {
            setAccount(account); // Set the selected account to update
            setShowModalUpdate(true); // Open the update modal

        } else if (funcao == "delete") {
            if (window.confirm("Are you sure you want to delete this account?")) {
                const { accounts: Accounts, error } = await deleteAccount(account);

                if (Accounts) {
                    window.location.reload(true);
                    setAlert({ type: "success", message: "Conta deletada com sucesso!" });
                    setTimeout(() => setAlert({ type: "", message: "" }), 15000);
                }
                else if (error) {
                    setAlert({ type: "error", message: "Falha ao deletar conta. Tente novamente." });
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
                <label>Create</label>
                <button className="form-control" onClick={() => handle("create")}><RiStickyNoteAddFill /></button>
            </div>
            <div>
                <h3>Account</h3>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr className="info colorwhite">
                            <th>Id</th>
                            <th>Name</th>
                            <th>Value</th>
                            <th>Category</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts && accounts.map((account) => (
                            <tr key={account.id}>
                                <td>{account.id}</td>
                                <td>{account.name}</td>
                                <td>{formatCurrency(account.value)}</td>
                                <td>{categories.filter(c => c.id == account.categoryid)[0]?.name}</td>
                                {/* <td> {categories[account.categoryid].name || 'Carregando...'}</td> */}
                
                                <td className="aligmentButton">
                                    <button className="col-lg-3" id={`button${account.id}`} onClick={() => handle("update", account)} >
                                        <FaEdit />
                                    </button>
                                </td>
                                <td className="aligmentButton">
                                    <button id={`button${account.id}`} onClick={() => handle("delete", account.id)} className="colorred col-lg-3">
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
            {showModalUpdate && <Update account={account} closeModal={closeModalUpdate} />}
        </div>
    );
}

export default Account;
