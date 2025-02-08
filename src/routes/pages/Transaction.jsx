import React, { useEffect, useState } from "react";
// import { getAccountsGrouping } from "../../api/retornoApi/ApiAccount";
import { formatCurrency } from "../functions/mask";
import { Alert } from "../functions/alert";
import { removeFormatCurrency } from "../functions/mask";
import AddTransactionMonthly from "../Modals/Transaction/AddTransactionMonthly"
import { formatDate } from "../functions/mask";
import { formatDateMonth } from "../functions/mask";
import { updateTransaction } from "../../api/retornoApi/ApiTransaction";
import { deleteTransaction } from "../../api/retornoApi/ApiTransaction";
import { GetTransactionGroupingByDate } from "../../api/retornoApi/ApiTransaction";

import { VscSaveAll } from "react-icons/vsc";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import CreateTransaction from "../Modals/Transaction/Create";
import { FaEdit } from "react-icons/fa";

export default function Transaction() {

    const status = ['', 'PENDENTE', 'PAGO NO PRAZO', 'AGUARDANDO', 'PAGO ATRASADO'];
    const list = ['name', 'value', 'month', 'status'];
    const titles = ['ACCOUNT', 'VALUE', 'DUEDATE', 'STATUS', ''];
    const [transactions, setTransactions] = useState([]);

    const [updates, setUpdates] = useState({});
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [transactionMonthly, setTransactionMonthly] = useState([]);
    const [alert, setAlert] = useState({ type: "", message: "" })


    useEffect(() => {
        const initialData = transactions.flatMap(category => {
            return category.accounts.flatMap(account => {
                return account.transactions.map(transaction => ({
                    id: transaction.id,
                    name: transaction.name,
                    value: transaction.value,
                    month: transaction.date,
                    categoryId: category.categoryId,
                    idAccount: account.id,
                    status: transaction.status
                }));
            });
        });
        setTransactionMonthly(initialData);
    }, [transactions]);

    useEffect(() => {
        transactionMonthly.map(account => {
            if (account.status != "PENDENTE") {
                attr(account.id, 'readonly');
                attr(account.id, 'disabled');
                document.getElementById(`button${account.id}`).setAttribute('disabled', true);

                document.getElementById(`buttonEdit${account.id}`).removeAttribute('disabled');
            } else
                document.getElementById(`buttonEdit${account.id}`).setAttribute('disabled', true);
        })
    },);

    const handleDateChange = async (event) => {
        const newDate = formatDateMonth(event.target.value);
        var transactions = await GetTransactionGroupingByDate(newDate);

        setTransactions(transactions); // Atualiza o estado da data selecionada
    };

    const handle = (funcao, id, account) => {
        let sum = 0;
        if (funcao == "add") {
            if (!document.getElementById("dateFilter").value) {
                setAlert({ type: "error", message: "Preencha os campos obrigatórios" });
                setTimeout(() => setAlert({ type: "", message: "" }), 5000);
            }
            else
                setShowModalAdd(true);

        } else if (funcao == "create") {
            if (!document.getElementById("dateFilter").value) {
                setAlert({ type: "error", message: "Preencha os campos obrigatórios" });
                setTimeout(() => setAlert({ type: "", message: "" }), 5000);
            }
            else
                setShowModalCreate(true);

        } else if (funcao == "atualizar") {
            if (!document.getElementById("dateFilter").value) {
                setAlert({ type: "error", message: "Preencha os campos obrigatórios" });
                setTimeout(() => setAlert({ type: "", message: "" }), 5000);
            }
            else {
                const dateInputValue = document.getElementById("dateFilter").value;
                handleDateChange({ target: { value: dateInputValue } });
            }

        } else if (funcao == "iconFilter") {
            toggleCategoryState(id);

        } else if (funcao == "sum") {
            const element = document.getElementById(`TotalCategory${id}`);
            transactionMonthly.forEach(item => {
                if (item.categoryId === id) {
                    const v = item.value ? removeFormatCurrency(item.value) : 0;
                    sum = sum + parseInt(v);
                }
            })
            element != null ?? element.value(formatCurrency(sum));
            return formatCurrency(sum);
        }
    }

    const handleChange = (campo, id) => (event) => {
        const { value } = event.target;

        let updatedData = transactionMonthly.map(item => {
            if (item.id === id || item.idAccount === id) {
                // Atualiza o campo corretamente usando a sintaxe de espalhamento
                const valueCampo = campo === "value" ? formatCurrency(value) : value;
                return { ...item, [campo]: valueCampo }; // Usando o campo dinamicamente
            }
            return item; // Manter os outros itens inalterados
        });

        setTransactionMonthly(updatedData);
    };

    const closeModalCreate = () => {
        setShowModalCreate(false);
    };

    const closeModalAdd = () => {
        setShowModalAdd(false);
    };

    const handleSave = async (id) => {
        const data = transactionMonthly.filter(d => d.id == id)[0];
        let isValid = true;

        list.map(index => {
            if (!data[index]) {
                isValid = false;
                document.getElementById(`${index}${id}`).classList.add("error");
            } else {
                document.getElementById(`${index}${id}`).classList.remove("error");
            }
        });

        if (!isValid) {
            setAlert({ type: "error", message: "Preencha os campos obrigatórios" });
            setTimeout(() => setAlert({ type: "", message: "" }), 5000);
            return;
        }

        data.value = removeFormatCurrency(data.value);

        const { account: dados, error } = await updateTransaction(data);

        if (dados !== "PENDENTE") {
            // Adiciona 'readonly' e 'disabled' após salvar
            attr(dados.id, 'readonly');
            attr(dados.id, 'disabled');
            document.getElementById(`button${id}`).setAttribute('disabled', true); // Desabilita o botão de salvar

            document.getElementById(`buttonEdit${id}`).removeAttribute('disabled');
        } else if (error) {
            console.log("Erro ao atualizar a conta", error);
        }
    };


    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            const { accounts: Accounts, error } = await deleteTransaction(id);

            if (Accounts) {
                const dateInputValue = document.getElementById("dateFilter").value;
                handleDateChange({ target: { value: dateInputValue } });

                setAlert({ type: "success", message: "Conta deletada com sucesso!" });
                setTimeout(() => setAlert({ type: "", message: "" }), 15000);
            }
            else if (error) {
                setAlert({ type: "error", message: "Falha ao deletar conta. Tente novamente." });
                setTimeout(() => setAlert({ type: "", message: "" }), 15000);
            }
        }
    };

    const handleEdit = async (id) => {
        removeAttr(id, 'readonly');
        removeAttr(id, 'disabled');
        document.getElementById(`button${id}`).removeAttribute('disabled');

        document.getElementById(`buttonEdit${id}`).setAttribute('disabled', true);
    };

    const attr = (id, comand) => {
        list.map(index => {
            const element = document.getElementById(`${index}${id}`);
            if (element) {
                element.setAttribute(comand, true); // Adiciona o atributo 'readonly' ou 'disabled'
            }
        });
    }

    const removeAttr = (id, comand) => {
        list.map(index => {
            const element = document.getElementById(`${index}${id}`);
            if (element) {
                element.removeAttribute(comand); // Remove o atributo 'readonly' ou 'disabled'
            }
        });
    }

    return (
        // ----------------------------------------------cabeçalho-------------------------------------
        <div>
            {alert.message && <Alert type={alert.type} message={alert.message} />}

            <div class="form-group" style={{
                height: '120px', paddingBottom: '20px'
            }}>
                <h2>Transactions</h2>
                <div className="col-lg-3">
                    <label>Month</label>
                    <input
                        className="form-control"
                        type="month"
                        id="dateFilter"
                        onChange={handleDateChange}
                    />
                </div>

                <div className="col-lg-1">
                    <label>Add</label>
                    <button className="form-control" onClick={() => handle("add")}><MdFormatListBulletedAdd /></button>
                </div>

                <div className="col-lg-1">
                    <label>Create</label>
                    <button className="form-control" onClick={() => handle("create")}><RiStickyNoteAddFill /></button>
                </div>

                <div className="col-lg-1">
                    <label>Update</label>
                    <button className="form-control" onClick={() => handle("atualizar")}><GrUpdate /></button>
                </div>
            </div>

            <table className="table table-hover">
                {transactions && transactions.length > 0 ? (
                    transactions && transactions.map((category, index) => (
                        <React.Fragment key={index}>

                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                <tr className="info">
                                    <th className="colorwhite" colSpan="6" id={category.categoryId}>
                                        {category.categoryName.toUpperCase()}
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            {transactionMonthly && transactionMonthly.filter(c => c.categoryId === category.categoryId).length > 0 ? (
                                <>
                                    <tbody>
                                        {/*  ----------------------------------------------titulos------------------------------------- */}
                                        <tr className="colorblue">
                                            {titles && titles.map((title, index) => (
                                                <th key={index}>{title}</th>
                                            ))}
                                            <th></th>
                                            <th></th>
                                        </tr>
                                        {/*  ----------------------------------------------corpo tabela------------------------------------- */}
                                        {transactionMonthly.filter(account => category.categoryId === account.categoryId).length > 0 ? (
                                            transactionMonthly.map((account) => (
                                                category.categoryId === account.categoryId && (
                                                    <tr className="active" key={account.id} id={account.id} >
                                                        {/* Campo de nome */}
                                                        <td id={`name${account.id}`} onChange={handleChange("name", account.id)} value={account.name}>
                                                            {account.name.toUpperCase()}
                                                        </td>

                                                        {/* Campo de valor */}
                                                        <td>
                                                            <input
                                                                id={`value${account.id}`}
                                                                onChange={handleChange("value", account.id)}
                                                                className="form-control"
                                                                type="text"
                                                                value={formatCurrency(account.value)}
                                                            />
                                                        </td>

                                                        {/* Campo de mês */}
                                                        <td>
                                                            <input
                                                                id={`month${account.id}`}
                                                                onChange={handleChange("month", account.id)}
                                                                value={formatDate(account.month)}
                                                                className="form-control"
                                                                type="date"
                                                            />
                                                        </td>

                                                        {/* Campo de status */}
                                                        <td>
                                                            <select
                                                                id={`status${account.id}`}
                                                                onChange={handleChange("status", account.id)}  // Apenas altera o status
                                                                value={account.status}
                                                                className="form-control"
                                                            >
                                                                {status && status.map((month, index) => (
                                                                    <option key={index} value={month}>{month}</option>
                                                                ))}
                                                            </select>
                                                        </td>


                                                        {/* Botão de salvar */}
                                                        <td>
                                                            <button id={`button${account.id}`} onClick={() => handleSave(account.id)} className="form-control">
                                                                <VscSaveAll />
                                                            </button>
                                                        </td>
                                                        <td className="aligmentButton">
                                                            <button
                                                                id={`buttonEdit${account.id}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();  // Impede que o evento de clique na linha seja disparado
                                                                    handleEdit(account.id);  // Chama a função de deletar
                                                                }}
                                                                className="colorred"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                        </td>
                                                        <td className="aligmentButton">
                                                            <button
                                                                id={`button${account.id}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();  // Impede que o evento de clique na linha seja disparado
                                                                    handleDelete(account.id);  // Chama a função de deletar
                                                                }}
                                                                className="colorred"
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">NENHUMA CONTA REGISTRADA NESSE MÊS</td>
                                            </tr>
                                        )}

                                        <tr>
                                            <th>TOTAL</th>
                                            <th id={`TotalCategory${category.categoryId}`} >{handle("sum", category.categoryId)}</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </tbody>
                                </>
                            ) : (
                                // Exibir mensagem caso não tenha transações para a categoria no mês
                                <tbody>
                                    <tr>
                                        <td colSpan="6" className="text-center">NENHUMA CONTA REGISTRADA NESSA CATEGORIA</td>
                                    </tr>
                                </tbody>
                            )}

                        </React.Fragment>
                    ))) : (
                    <table className="table table-hover">
                        <thead>
                            <tr className="info">
                                <td className="colorwhite" colSpan="6">CONTAS CADASTRADAS</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="6" className="text-center">NENHUMA CONTA REGISTRADA!</td>
                            </tr>
                        </tbody>
                    </table>

                )}
            </table>

            {showModalAdd &&
                <AddTransactionMonthly
                    date={formatDateMonth(document.getElementById("dateFilter").value)}
                    closeModal={closeModalAdd}
                />}
            {showModalCreate && <CreateTransaction closeModal={closeModalCreate} />}
        </div >
    )

}